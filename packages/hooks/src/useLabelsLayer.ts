import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { computed, toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseLabelsLayerOptions extends Partial<AMap.LabelsLayerOptions> {
  visible?: boolean
  opacity?: number
  zIndex?: number
}

export interface UseLabelsLayerReturn extends OverlayLifecycle<AMap.LabelsLayer> {
  show: () => void
  hide: () => void
  setOpacity: (opacity: number | undefined) => void
  setZIndex: (zIndex: number | undefined) => void
  setOptions: (options: Partial<AMap.LabelsLayerOptions>) => void
  add: (markers: AMap.LabelMarker | AMap.LabelMarker[]) => void
  remove: (markers: AMap.LabelMarker | AMap.LabelMarker[]) => void
  clear: () => void
}

function applyLabelsLayerOptions(layer: AMap.LabelsLayer, options: UseLabelsLayerOptions) {
  const { visible, opacity, zIndex, map: _ignoredMap, ...rest } = options

  if (opacity != null && typeof (layer as any).setOpacity === 'function')
    (layer as any).setOpacity(opacity)

  if (zIndex != null && typeof (layer as any).setzIndex === 'function')
    (layer as any).setzIndex(zIndex)

  if (visible != null) {
    if (visible)
      (layer as any).show?.()
    else
      (layer as any).hide?.()
  }

  if (Object.keys(rest).length && typeof (layer as any).setOptions === 'function')
    (layer as any).setOptions(rest)
}

export function useLabelsLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseLabelsLayerOptions>,
): UseLabelsLayerReturn {
  const optionsRef = computed<UseLabelsLayerOptions>(() => ({
    ...(toValue(options) as UseLabelsLayerOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(
    mapRef,
    optionsRef,
    ({ AMap, map, options: layerOptions }) => {
      const { visible: _ignoredVisible, map: _ignoredMap, ...rest } = layerOptions as UseLabelsLayerOptions & { map?: AMap.Map }
      const instance = new (AMap as any).LabelsLayer(rest)
      instance.setMap(map)
      return instance
    },
    (layer, nextOptions) => {
      applyLabelsLayerOptions(layer, nextOptions)
    },
    () => ({ plugins: ['AMap.LabelsLayer'] }),
  )

  const pendingAdds = new Set<AMap.LabelMarker>()
  const pendingRemovals = new Set<AMap.LabelMarker>()
  let flushScheduled = false

  function scheduleFlush() {
    if (flushScheduled)
      return
    if (!pendingAdds.size && !pendingRemovals.size)
      return
    flushScheduled = true
    const schedule = typeof queueMicrotask === 'function' ? queueMicrotask : (fn: () => void) => Promise.resolve().then(fn)
    schedule(() => {
      flushScheduled = false
      flushPending()
    })
  }

  function flushPending() {
    const instance = overlay.overlay.value
    if (!instance)
      return

    if (pendingRemovals.size) {
      instance.remove(Array.from(pendingRemovals))
      pendingRemovals.clear()
    }

    if (pendingAdds.size) {
      instance.add(Array.from(pendingAdds))
      pendingAdds.clear()
    }
  }

  function normalizeMarkers(markers: AMap.LabelMarker | AMap.LabelMarker[]) {
    return Array.isArray(markers) ? markers : [markers]
  }

  watch(() => overlay.overlay.value, (instance) => {
    if (instance) {
      // Layer instance just became available (or was replaced); flush queued operations
      // immediately so pending label markers actually call through to `LabelsLayer.add/remove`.
      flushPending()
    }
    else {
      pendingAdds.clear()
      pendingRemovals.clear()
    }
  })

  function show() {
    overlay.overlay.value?.show?.()
  }

  function hide() {
    overlay.overlay.value?.hide?.()
  }

  function setOpacity(opacity: number | undefined) {
    if (opacity == null)
      return
    overlay.overlay.value?.setOpacity?.(opacity)
  }

  function setZIndex(zIndex: number | undefined) {
    if (zIndex == null)
      return
    overlay.overlay.value?.setzIndex?.(zIndex)
  }

  function setOptions(options: Partial<AMap.LabelsLayerOptions>) {
    if (!options)
      return
    overlay.overlay.value?.setOptions?.(options)
  }

  function add(markers: AMap.LabelMarker | AMap.LabelMarker[]) {
    if (!markers)
      return
    const items = normalizeMarkers(markers)
    for (const marker of items) {
      pendingRemovals.delete(marker)
      pendingAdds.add(marker)
    }
    scheduleFlush()
  }

  function remove(markers: AMap.LabelMarker | AMap.LabelMarker[]) {
    if (!markers)
      return
    const items = normalizeMarkers(markers)
    for (const marker of items) {
      if (!pendingAdds.delete(marker))
        pendingRemovals.add(marker)
    }
    scheduleFlush()
  }

  function clear() {
    pendingAdds.clear()
    pendingRemovals.clear()
    overlay.overlay.value?.clear?.()
  }

  return {
    ...overlay,
    show,
    hide,
    setOpacity,
    setZIndex,
    setOptions,
    add,
    remove,
    clear,
  }
}
