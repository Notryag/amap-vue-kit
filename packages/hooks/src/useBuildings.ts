import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export type UseBuildingsOptions = AMap.BuildingsOptions

/** Attach a Buildings layer and watch its display and area styles. */
export function useBuildings(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseBuildingsOptions> = {},
) {
  const api = useOverlay(
    map,
    options,
    ({ AMap, options: { styleOpts, ...settings } }) => {
      const layer = new AMap.Buildings(settings)
      if (styleOpts)
        layer.setStyle(styleOpts)
      return layer
    },
    undefined,
    undefined,
    {
      attach: (map, layer) => map.add(layer),
      detach: (map, layer) => map.remove(layer),
    },
  )

  const { overlay } = api
  const style = computed(() => toValue(options).styleOpts)
  const zoomRange = computed(() => toValue(options).zooms)
  watch(style, value => overlay.value?.setStyle(value ?? { areas: [], hideWithoutStyle: false }), { deep: true })
  watch(() => toValue(options).opacity, opacity => overlay.value?.setOpacity(opacity ?? 1))
  watch(() => toValue(options).zIndex, zIndex => overlay.value?.setzIndex(zIndex ?? 11))
  watch(zoomRange, (zooms) => {
    if (zooms)
      overlay.value?.setZooms(zooms)
  }, { deep: true })
  watch(() => toValue(options).visible, (visible) => {
    if (visible === false)
      overlay.value?.hide()
    else
      overlay.value?.show()
  })

  return api
}
