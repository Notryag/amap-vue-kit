import type { BoundsLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import { toBounds } from '@amap-vue/shared'
import { computed, toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export type CanvasLayerBounds = BoundsLike | [number, number, number, number]

export interface UseCanvasLayerOptions extends Omit<AMap.CanvasLayerOptions, 'canvas' | 'bounds'> {
  /** A null canvas leaves the layer detached. */
  canvas: HTMLCanvasElement | null
  bounds: CanvasLayerBounds
}

function resolveBounds(amap: typeof AMap, bounds: CanvasLayerBounds) {
  if (Array.isArray(bounds) && bounds.length === 4) {
    const [west, south, east, north] = bounds
    return toBounds(amap, [
      [west, south],
      [east, north],
    ])
  }
  return toBounds(amap, bounds)
}

/** Display a caller-owned canvas over a geographic extent. */
export function useCanvasLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseCanvasLayerOptions>,
) {
  const canvas = computed(() => toValue(options).canvas)
  const bounds = computed(() => toValue(options).bounds)
  const zooms = computed(() => toValue(options).zooms)
  let amap: typeof AMap | undefined

  const api = useOverlay(
    () => canvas.value
      ? toValue(map)
      : null,
    options,
    ({ AMap, options: { canvas, bounds, ...settings } }) => {
      amap = AMap
      const extent = resolveBounds(AMap, bounds)
      if (!canvas || !extent)
        throw new Error('[amap-vue] CanvasLayer requires a canvas and valid bounds.')
      return new AMap.CanvasLayer({ ...settings, canvas, bounds: extent })
    },
    undefined,
    undefined,
    {
      attach: (map, layer) => map.add(layer),
      detach: (map, layer) => map.remove(layer),
    },
  )

  const { overlay } = api
  watch(canvas, (value) => {
    if (value)
      overlay.value?.setCanvas(value)
  })
  watch(bounds, (value) => {
    const extent = amap && resolveBounds(amap, value)
    if (extent)
      overlay.value?.setBounds(extent)
  }, { deep: true })
  watch(zooms, (value) => {
    if (value)
      overlay.value?.setZooms(value)
  }, { deep: true })
  watch(() => toValue(options).opacity, opacity => overlay.value?.setOpacity(opacity ?? 1))
  watch(() => toValue(options).zIndex, zIndex => overlay.value?.setzIndex(zIndex ?? 6))
  watch(() => toValue(options).visible, (visible) => {
    if (visible === false)
      overlay.value?.hide()
    else
      overlay.value?.show()
  })

  return {
    ...api,
    /** Upload freshly drawn pixels to the SDK in 3D view. */
    refresh() {
      if (canvas.value && toValue(map))
        overlay.value?.reFresh()
    },
  }
}
