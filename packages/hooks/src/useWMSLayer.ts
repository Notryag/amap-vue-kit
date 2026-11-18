import type { MaybeRefOrGetter } from 'vue'
import { toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export type UseWMSLayerOptions = AMap.TileLayer.WMSOptions

/** Attach an EPSG:3857 WMS raster layer to the map. */
export function useWMSLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseWMSLayerOptions>,
) {
  const api = useOverlay(
    map,
    options,
    ({ AMap, options }) => new AMap.TileLayer.WMS({
      ...Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined)),
      url: options.url,
      params: { ...options.params },
    }),
    undefined,
    undefined,
    {
      attach: (map, layer) => map.add(layer),
      detach: (map, layer) => map.remove(layer),
    },
  )

  const { overlay } = api
  watch([
    () => toValue(options).url,
    () => ({
      ...toValue(options).params,
    }),
  ], ([url, params], [previousUrl, previousParams]) => {
    const layer = overlay.value
    if (!layer)
      return

    const urlChanged = url !== previousUrl
    const paramsChanged = Object.keys(params).length !== Object.keys(previousParams).length
      || Object.entries(params).some(([key, value]) => previousParams[key] !== value)

    if (urlChanged)
      layer.setUrl(url)
    if (paramsChanged)
      layer.setParams({ ...params })
    if (urlChanged || paramsChanged)
      layer.reload()
  })
  watch(() => toValue(options).opacity, opacity => overlay.value?.setOpacity(opacity ?? 1))
  watch(() => toValue(options).zIndex, zIndex => overlay.value?.setzIndex(zIndex ?? 4))
  watch(() => toValue(options).zooms, zooms => overlay.value?.setZooms(zooms ?? [2, 30]), { deep: true })
  watch(() => toValue(options).visible, (visible) => {
    if (visible === false)
      overlay.value?.hide()
    else
      overlay.value?.show()
  })

  return {
    ...api,
    reload: () => overlay.value?.reload(),
  }
}
