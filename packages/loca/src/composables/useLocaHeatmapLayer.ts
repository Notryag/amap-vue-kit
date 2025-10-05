import { computed, shallowRef, unref } from 'vue'
import type {
  LocaContainer,
  LocaHeatmapLayer,
  LocaHeatmapLayerOptions,
  LocaLayerStyle,
  MaybeRefMap,
} from '../types'
import { getLoca } from '../utils'

export interface HeatmapLike {
  [key: string]: any
}

export function useLocaHeatmapLayer(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  options: LocaHeatmapLayerOptions = {},
) {
  const containerRef = computed(() => {
    const resolved = typeof container === 'function' ? container() : unref(container as any)
    return resolved ?? null
  })
  const layer = shallowRef<LocaHeatmapLayer<HeatmapLike> | null>(null)

  function ensureLayer() {
    if (!layer.value) {
      const loca = getLoca()
      layer.value = new loca.HeatmapLayer(options)
      applyOptions(options)
    }
    return layer.value
  }

  function applyOptions(value: Partial<LocaHeatmapLayerOptions>) {
    if (!layer.value)
      return
    if (layer.value.setOptions)
      layer.value.setOptions(value)
    else if (layer.value.setStyle)
      layer.value.setStyle(value as LocaLayerStyle<HeatmapLike>)
  }

  function setData(data: HeatmapLike[], valueField = options.valueField ?? 'value') {
    if (!Array.isArray(data))
      throw new Error('[amap-vue] Loca heatmap layer data must be an array.')

    const layerInstance = ensureLayer()
    layerInstance.setData(data, {
      lnglat(item: HeatmapLike) {
        const lng = item.lng ?? item.longitude ?? item.x
        const lat = item.lat ?? item.latitude ?? item.y
        if (typeof lng !== 'number' || typeof lat !== 'number')
          throw new Error('[amap-vue] Heatmap data items require numeric lng/lat fields.')
        return [lng, lat]
      },
      value(item: HeatmapLike) {
        const value = item[valueField]
        if (typeof value !== 'number')
          throw new Error(`[amap-vue] Heatmap value field "${valueField}" must be numeric.`)
        return value
      },
    })
  }

  function setStyle(style: LocaLayerStyle<HeatmapLike>) {
    const layerInstance = ensureLayer()
    layerInstance.setStyle(style)
  }

  function updateOptions(next: Partial<LocaHeatmapLayerOptions>) {
    ensureLayer()
    applyOptions(next)
  }

  function addTo(target?: LocaContainer | null) {
    const layerInstance = ensureLayer()
    const resolved = target ?? containerRef.value
    if (!resolved)
      throw new Error('[amap-vue] Attempted to add a Loca heatmap layer without a container.')
    layerInstance.addTo(resolved)
  }

  function remove() {
    layer.value?.remove()
  }

  function render() {
    if (layer.value && typeof (layer.value as any).render === 'function')
      layer.value!.render()
    else
      containerRef.value?.render()
  }

  function destroy() {
    if (layer.value) {
      layer.value.destroy()
      layer.value = null
    }
  }

  return {
    layer,
    ensureLayer,
    setData,
    setStyle,
    updateOptions,
    addTo,
    remove,
    render,
    destroy,
  }
}
