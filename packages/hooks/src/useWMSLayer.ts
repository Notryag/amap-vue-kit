import type { MaybeRefOrGetter } from 'vue'
import { useOgcTileLayer } from './useOgcTileLayer'

export type UseWMSLayerOptions = AMap.TileLayer.WMSOptions

/** Attach an EPSG:3857 WMS raster layer to the map. */
export function useWMSLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseWMSLayerOptions>,
) {
  return useOgcTileLayer(map, options, (amap, settings) => new amap.TileLayer.WMS(settings))
}
