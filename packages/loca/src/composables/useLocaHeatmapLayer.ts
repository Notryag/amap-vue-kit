import type {
  LocaContainer,
  LocaHeatmapLayer,
  LocaHeatmapLayerOptions,
  LocaLayerStyle,
  MaybeRefMap,
} from '../types'
import { computed, shallowRef, unref } from 'vue'
import { createFeatureCollection, createGeoJSONSource, createPointFeature, getLoca } from '../utils'

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
    const features = data.map((item) => {
      const lng = item.lng ?? item.longitude ?? item.x
      const lat = item.lat ?? item.latitude ?? item.y
      const value = item[valueField]
      if (typeof lng !== 'number' || typeof lat !== 'number')
        throw new Error('[amap-vue] Heatmap data items require numeric lng/lat fields.')
      if (typeof value !== 'number')
        throw new Error(`[amap-vue] Heatmap value field "${valueField}" must be numeric.`)

      return createPointFeature({
        ...item,
        value,
      }, lng, lat)
    })

    layerInstance.setSource(createGeoJSONSource(createFeatureCollection(features)))
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
    resolved.add(layerInstance)
  }

  function remove() {
    if (layer.value)
      containerRef.value?.remove(layer.value)
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
