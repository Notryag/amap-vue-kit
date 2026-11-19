import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export interface CustomLayerRenderContext {
  canvas: HTMLCanvasElement
  map: AMap.Map
}

export interface UseCustomLayerOptions extends AMap.CustomLayerOptions {
  /** Draw one frame using the current map projection. */
  render: (context: CustomLayerRenderContext) => void
}

/** Create a custom Canvas layer that the SDK can redraw. */
export function useCustomLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseCustomLayerOptions>,
) {
  let attached: { map: AMap.Map, layer: AMap.CustomLayer } | null = null
  const api = useOverlay(
    map,
    options,
    ({ AMap, options: { render: _render, ...settings } }) => {
      const canvas = document.createElement('canvas')
      const layer = new AMap.CustomLayer(canvas, settings)
      layer.render = () => {
        const current = toValue(options)
        if (attached?.layer === layer && current.visible !== false)
          current.render({ canvas, map: attached.map })
      }
      return layer
    },
    undefined,
    undefined,
    {
      attach(map, layer) {
        attached = { map, layer }
        layer.setMap(map)
      },
      detach(_map, layer) {
        attached = null
        layer.setMap(null)
      },
    },
  )

  const { overlay } = api
  const zooms = computed(() => toValue(options).zooms)
  function redraw() {
    overlay.value?.render()
  }

  watch(() => toValue(options).render, redraw)
  watch(zooms, (value) => {
    if (value)
      overlay.value?.setZooms(value)
  }, { deep: true })
  watch(() => toValue(options).opacity, opacity => overlay.value?.setOpacity(opacity ?? 1))
  watch(() => toValue(options).zIndex, zIndex => overlay.value?.setzIndex(zIndex ?? 120))
  watch(() => toValue(options).visible, (visible) => {
    if (visible === false) {
      overlay.value?.hide()
    }
    else {
      overlay.value?.show()
      redraw()
    }
  })

  return { ...api, redraw }
}
