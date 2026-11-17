import type {
  LocaContainer,
  LocaLayerStyle,
  LocaPolygonLayer,
  LocaPolygonLayerOptions,
  MaybeRefMap,
} from '../types'
import { createGeoJSONSource, getLoca } from '../utils'
import { useLocaLayer } from './useLocaLayer'

export type PolygonSource = Record<string, any>

export interface PolygonLikeProperties {
  [key: string]: any
}

export function useLocaPolygonLayer(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  options: LocaPolygonLayerOptions = {},
) {
  const { layer, ensureLayer, addTo, remove, render, destroy } = useLocaLayer<LocaPolygonLayer<PolygonLikeProperties>>(
    container,
    () => {
      const loca = getLoca()
      const instance = new loca.PolygonLayer(options)
      return instance
    },
    'polygon',
  )

  function setData(source: PolygonSource) {
    const layerInstance = ensureLayer()
    if (!source)
      throw new Error('[amap-vue] Polygon layer requires a GeoJSON feature or feature collection.')
    layerInstance.setSource(createGeoJSONSource(source))
  }

  function setStyle(style: LocaLayerStyle<PolygonLikeProperties>) {
    const layerInstance = ensureLayer()
    layerInstance.setStyle(style)
  }

  function on(event: string, handler: (payload: any) => void) {
    const instance = ensureLayer()
    instance.on(event, handler)
  }

  function off(event: string, handler: (payload: any) => void) {
    layer.value?.off(event, handler)
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
    on,
    off,
  }
}
