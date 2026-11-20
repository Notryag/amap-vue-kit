import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'
import { toRaw, toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export type LayerGroupMember = AMap.LayerGroupMember

export interface UseLayerGroupOptions {
  /** Native layers synchronized in batches by instance identity. */
  layers?: readonly LayerGroupMember[]
  /** When set, applies visibility to all layers in the group. */
  visible?: boolean
}

export interface UseLayerGroupReturn extends OverlayLifecycle<AMap.LayerGroup> {
  addLayers: (layers: readonly LayerGroupMember[]) => void
  removeLayers: (layers: readonly LayerGroupMember[]) => void
  clearLayers: () => void
  /** Returns a snapshot of current members. */
  getLayers: () => LayerGroupMember[]
  hasLayer: (layer: LayerGroupMember) => boolean
  setOptions: (options: AMap.LayerGroupOptions) => void
}

type LayerHandler = Parameters<AMap.Evented['on']>[1]

/** Manages native layers as a group and keeps listeners attached to current members. */
export function useLayerGroup(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseLayerGroupOptions> = {},
): UseLayerGroupReturn {
  const listeners = new Map<string, Set<LayerHandler>>()
  const api = useOverlay(
    map,
    options,
    ({ AMap }) => new AMap.LayerGroup([]),
    undefined,
    undefined,
    {
      recreateOnMapChange: true,
      attach: (map, group) => group.setMap(map),
      // In JSAPI 2.0, setMap(null) leaves members attached and clearLayers() mutates while iterating.
      detach: (_map, group) => removeMembers(group, group.getLayers().slice()),
    },
  )
  const { overlay } = api

  function addLayers(layers: readonly LayerGroupMember[]) {
    const group = overlay.value
    if (!group)
      return
    const added = [
      ...new Set(layers.map(toRaw)),
    ].filter(layer => !group.hasLayer(layer))
    for (const layer of added) {
      if (!layer.off)
        continue
      for (const [event, handlers] of listeners) {
        for (const handler of handlers)
          layer.on?.(event, handler)
      }
    }
    group.addLayers(added)
    const visible = toValue(options).visible
    for (const layer of added) {
      if (visible === false)
        layer.hide()
      else if (visible === true)
        layer.show()
    }
  }

  function removeMembers(group: AMap.LayerGroup, layers: LayerGroupMember[]) {
    for (const layer of layers) {
      for (const [event, handlers] of listeners) {
        for (const handler of handlers)
          layer.off?.(event, handler)
      }
    }
    group.removeLayers(layers)
  }

  function removeLayers(layers: readonly LayerGroupMember[]) {
    const group = overlay.value
    if (group) {
      removeMembers(group, [
        ...new Set(layers.map(toRaw)),
      ].filter(layer => group.hasLayer(layer)))
    }
  }

  function clearLayers() {
    const group = overlay.value
    if (group)
      removeMembers(group, group.getLayers().slice())
  }

  function getLayers() {
    return overlay.value?.getLayers().slice() ?? []
  }

  function on(event: string, handler: LayerHandler) {
    const handlers = listeners.get(event) ?? new Set()
    if (handlers.has(handler))
      return
    handlers.add(handler)
    listeners.set(event, handlers)
    for (const layer of getLayers()) {
      if (layer.off)
        layer.on?.(event, handler)
    }
  }

  function off(event: string, handler: LayerHandler) {
    const handlers = listeners.get(event)
    if (!handlers?.delete(handler))
      return
    if (!handlers.size)
      listeners.delete(event)
    for (const layer of getLayers())
      layer.off?.(event, handler)
  }

  watch([
    overlay,
    () => new Set(toValue(options).layers?.map(toRaw)),
  ], ([group, layers], [previousGroup, previousLayers]) => {
    if (!group)
      return
    const managed = group === previousGroup
      ? previousLayers
      : new Set<LayerGroupMember>()
    removeLayers([...managed].filter(layer => !layers.has(layer)))
    addLayers([...layers].filter(layer => !managed.has(layer)))
  })

  watch(() => toValue(options).visible, (visible) => {
    if (visible === false)
      overlay.value?.hide()
    else if (visible === true)
      overlay.value?.show()
  })

  return {
    ...api,
    addLayers,
    removeLayers,
    clearLayers,
    getLayers,
    hasLayer: layer => overlay.value?.hasLayer(toRaw(layer)) ?? false,
    setOptions: options => overlay.value?.setOptions(options),
    on,
    off,
  }
}
