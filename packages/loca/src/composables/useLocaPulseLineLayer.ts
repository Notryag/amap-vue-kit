import type {
  LocaContainer,
  LocaLayerStyle,
  LocaPulseLineLayer,
  LocaPulseLineLayerOptions,
  MaybeRefMap,
} from '../types'
import { createFeatureCollection, createGeoJSONSource, createLineFeature, getLoca } from '../utils'
import { useLocaLayer } from './useLocaLayer'

export interface PulseLineItem {
  path: [number, number][]
  [key: string]: any
}

export function useLocaPulseLineLayer(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  options: LocaPulseLineLayerOptions = {},
) {
  const { layer, ensureLayer, addTo, remove, render, destroy } = useLocaLayer<LocaPulseLineLayer<PulseLineItem>>(
    container,
    () => {
      const loca = getLoca()
      const instance = new loca.PulseLineLayer(options)
      return instance
    },
    'pulse line',
  )

  function setData(data: PulseLineItem[], pathKey = 'path') {
    if (!Array.isArray(data))
      throw new TypeError('[amap-vue] Pulse line layer data must be an array.')

    const layerInstance = ensureLayer()
    const features = data.map((item) => {
      const path = item[pathKey]
      if (!Array.isArray(path) || path.some(point => !Array.isArray(point) || point.length < 2))
        throw new Error('[amap-vue] Pulse line items require a "path" array of [lng, lat] tuples.')

      return createLineFeature(item, path)
    })

    layerInstance.setSource(createGeoJSONSource(createFeatureCollection(features)))
  }

  function setStyle(style: LocaLayerStyle<PulseLineItem>) {
    const layerInstance = ensureLayer()
    layerInstance.setStyle(style)
  }

  function updateOptions(next: Partial<LocaPulseLineLayerOptions>) {
    const instance = ensureLayer()
    if (instance.setOptions)
      instance.setOptions(next)
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
