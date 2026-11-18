import type { MaybeRefOrGetter } from 'vue'
import { useOgcTileLayer } from './useOgcTileLayer'

export type UseWMTSLayerOptions = AMap.TileLayer.WMTSOptions

/** Attach an EPSG:3857 WMTS raster layer to the map. */
export function useWMTSLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseWMTSLayerOptions>,
) {
  return useOgcTileLayer(map, options, (amap, settings) => new amap.TileLayer.WMTS(settings))
}
