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
  /** Path coordinates in longitude/latitude order. */
  path: [number, number][]
  [key: string]: any
}

type PulseLineStyleCallback<T> = (index: number, feature: ReturnType<typeof createLineFeature>) => T

export interface LocaPulseLineStyle {
  lineWidth?: number | PulseLineStyleCallback<number>
  headColor?: string | PulseLineStyleCallback<string>
  trailColor?: string | PulseLineStyleCallback<string>
  /** Line altitude in meters. */
  altitude?: number
  /** Fraction of the path occupied by one pulse. */
  interval?: number
  /** Time in milliseconds for a pulse to traverse the path. */
  duration?: number
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

    const features = data.map((item) => {
      const path = item[pathKey]
      if (!Array.isArray(path) || path.length < 2 || path.some(point => !Array.isArray(point) || !Number.isFinite(point[0]) || !Number.isFinite(point[1])))
        throw new Error(`[amap-vue] Pulse line items require at least two [lng, lat] coordinates in "${pathKey}".`)

      return createLineFeature(item, path)
    })

    ensureLayer().setSource(createGeoJSONSource(createFeatureCollection(features)))
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
