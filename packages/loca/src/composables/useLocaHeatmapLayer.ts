import type {
  LocaContainer,
  LocaHeatmapLayer,
  LocaHeatmapLayerOptions,
  LocaLayerStyle,
  MaybeRefMap,
} from '../types'
import { createFeatureCollection, createGeoJSONSource, createPointFeature, getLoca } from '../utils'
import { useLocaLayer } from './useLocaLayer'

export interface HeatmapLike {
  [key: string]: any
}

export function useLocaHeatmapLayer(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  options: LocaHeatmapLayerOptions = {},
) {
  const { layer, ensureLayer, addTo, remove, render, destroy } = useLocaLayer<LocaHeatmapLayer<HeatmapLike>>(
    container,
    () => {
      const loca = getLoca()
      const instance = new loca.HeatmapLayer(options)
      if (instance.setOptions)
        instance.setOptions(options)
      else
        instance.setStyle(options as LocaLayerStyle<HeatmapLike>)
      return instance
    },
    'heatmap',
  )

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
      throw new TypeError('[amap-vue] Loca heatmap layer data must be an array.')

    const layerInstance = ensureLayer()
    const features = data.map((item) => {
      const lng = item.lng ?? item.longitude ?? item.x
      const lat = item.lat ?? item.latitude ?? item.y
      const value = item[valueField]
      if (typeof lng !== 'number' || typeof lat !== 'number')
        throw new TypeError('[amap-vue] Heatmap data items require numeric lng/lat fields.')
      if (typeof value !== 'number')
        throw new TypeError(`[amap-vue] Heatmap value field "${valueField}" must be numeric.`)

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
