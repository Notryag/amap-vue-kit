import type { LocaContainer, LocaLayerStyle, LocaPointLayer, LocaPointLayerOptions, MaybeRefMap } from '../types'
import { createFeatureCollection, createGeoJSONSource, createPointFeature, getLoca } from '../utils'
import { useLocaLayer } from './useLocaLayer'

export interface PointLike {
  [key: string]: any
}

export interface UseLocaPointLayerOptions extends LocaPointLayerOptions {
  container?: LocaContainer | null
}

export function useLocaPointLayer(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  options: UseLocaPointLayerOptions = {},
) {
  const { layer, ensureLayer, addTo, remove, render, destroy } = useLocaLayer<LocaPointLayer<PointLike>>(
    container,
    () => {
      const loca = getLoca()
      const instance = new loca.PointLayer(options)
      return instance
    },
    'point',
    options.container,
  )

  function setData(data: PointLike[], lngKey = 'lng', latKey = 'lat') {
    if (!Array.isArray(data))
      throw new TypeError('[amap-vue] Loca point layer data must be an array.')

    const layerInstance = ensureLayer()
    const features = data.map((item) => {
      const lng = item[lngKey]
      const lat = item[latKey]
      if (typeof lng !== 'number' || typeof lat !== 'number')
        throw new TypeError(`[amap-vue] Loca point layer requires numeric "${lngKey}"/"${latKey}" fields on each data item.`)
      return createPointFeature(item, lng, lat)
    })

    layerInstance.setSource(createGeoJSONSource(createFeatureCollection(features)))
  }

  function setStyle(style: LocaLayerStyle<PointLike>) {
    const layerInstance = ensureLayer()
    layerInstance.setStyle(style)
  }

  return {
    layer,
    ensureLayer,
    setData,
    setStyle,
    addTo,
    remove,
    render,
    destroy,
  }
}
