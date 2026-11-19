import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'
import { toRaw, toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export type VectorOverlay = AMap.VectorOverlay

export interface UseVectorLayerOptions extends AMap.VectorLayerOptions {
  /** Native vectors managed by the layer. Changes are applied in batches by instance identity. */
  overlays?: readonly VectorOverlay[]
}

export interface UseVectorLayerReturn extends OverlayLifecycle<AMap.VectorLayer> {
  add: (overlays: VectorOverlay | readonly VectorOverlay[]) => void
  remove: (overlays: VectorOverlay | readonly VectorOverlay[]) => void
  clear: () => void
  has: (overlay: VectorOverlay) => boolean
  /** Queries the native layer for a vector at the given coordinate. */
  query: (position: LngLatLike) => VectorOverlay | undefined
  getBounds: () => AMap.Bounds | undefined
}

/** Adds a native layer that can manage circles, lines and other vector overlays in batches. */
export function useVectorLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseVectorLayerOptions> = {},
): UseVectorLayerReturn {
  const api = useOverlay(
    map,
    options,
    ({ AMap, options: { overlays: _overlays, ...settings } }) => new AMap.VectorLayer(settings),
    undefined,
    undefined,
    {
      recreateOnMapChange: true,
      attach: (map, layer) => map.add(layer),
      detach(map, layer) {
        layer.clear()
        map.remove(layer)
      },
    },
  )
  const { overlay } = api

  watch([
    overlay,
    () => new Set(toValue(options).overlays?.map(toRaw)),
  ], ([layer, vectors], [previousLayer, previousVectors]) => {
    if (!layer)
      return

    const managed = layer === previousLayer
      ? previousVectors
      : new Set<VectorOverlay>()
    const removed = [...managed].filter(vector => !vectors.has(vector))
    const added = [...vectors].filter(vector => !managed.has(vector))
    if (removed.length)
      layer.remove(removed)
    if (added.length)
      layer.add(added)
  })

  watch(() => toValue(options).visible, (visible) => {
    if (visible === false)
      overlay.value?.hide()
    else
      overlay.value?.show()
  })
  watch(() => toValue(options).zIndex, value => overlay.value?.setzIndex(value ?? 110))

  return {
    ...api,
    add: vectors => overlay.value?.add([vectors].flat().map(toRaw)),
    remove: vectors => overlay.value?.remove([vectors].flat().map(toRaw)),
    clear: () => overlay.value?.clear(),
    has: vector => overlay.value?.has(toRaw(vector)) ?? false,
    query: position => overlay.value?.query(position),
    getBounds: () => overlay.value?.getBounds(),
  }
}
