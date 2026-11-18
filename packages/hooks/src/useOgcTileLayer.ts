import type { MaybeRefOrGetter } from 'vue'
import { toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export function useOgcTileLayer<TLayer extends AMap.TileLayer.WMS | AMap.TileLayer.WMTS>(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<AMap.TileLayer.OgcLayerOptions>,
  create: (amap: typeof AMap, options: AMap.TileLayer.OgcLayerOptions) => TLayer,
) {
  const api = useOverlay(
    map,
    options,
    ({ AMap, options }) => create(AMap, {
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
