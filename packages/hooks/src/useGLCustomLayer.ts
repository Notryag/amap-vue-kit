import type { MaybeRefOrGetter } from 'vue'
import { warn } from '@amap-vue/shared'
import { computed, toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export interface GLCustomLayerContext {
  gl: AMap.GLContext
  map: AMap.Map
}

export interface UseGLCustomLayerOptions extends Omit<AMap.GLCustomLayerOptions, 'init' | 'render'> {
  /** Allocate resources. Optionally return a function to release them. */
  init?: (context: GLCustomLayerContext) => void | (() => void)
  /** Draw while the SDK has prepared its shared WebGL context. */
  render: (context: GLCustomLayerContext & { state: unknown }) => void
}

/** Attach a custom layer that renders using the map's WebGL context. */
export function useGLCustomLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseGLCustomLayerOptions>,
) {
  let attached: { map: AMap.Map, layer: AMap.GLCustomLayer } | null = null
  let cleanup: (() => void) | undefined

  function releaseResources() {
    const dispose = cleanup
    cleanup = undefined
    try {
      dispose?.()
    }
    catch (error) {
      warn(error instanceof Error
        ? error.message
        : String(error))
    }
  }

  const api = useOverlay(
    map,
    options,
    ({ AMap, map, options: { init: _init, render: _render, ...settings } }) => {
      const layer = new AMap.GLCustomLayer({
        ...settings,
        init(gl) {
          if (!attached || attached.layer !== layer)
            return
          releaseResources()
          cleanup = toValue(options).init?.({ gl, map }) ?? undefined
        },
        render(gl, state) {
          const current = toValue(options)
          if (attached && attached.layer === layer && current.visible !== false)
            current.render({ gl, map, state })
        },
      })
      return layer
    },
    undefined,
    undefined,
    {
      recreateOnMapChange: true,
      attach(map, layer) {
        attached = { map, layer }
        map.add(layer)
      },
      detach(map, layer) {
        attached = null
        releaseResources()
        map.remove(layer)
      },
    },
  )

  const { overlay } = api
  const zooms = computed(() => toValue(options).zooms)
  function redraw() {
    attached?.map.render()
  }

  watch(() => toValue(options).render, redraw)
  watch(zooms, (value) => {
    if (value)
      overlay.value?.setZooms(value)
  }, { deep: true })
  watch(() => toValue(options).opacity, opacity => overlay.value?.setOpacity(opacity ?? 1))
  watch(() => toValue(options).zIndex, zIndex => overlay.value?.setzIndex(zIndex ?? 120))
  watch(() => toValue(options).visible, (visible) => {
    if (visible === false)
      overlay.value?.hide()
    else
      overlay.value?.show()
  })

  return { ...api, redraw }
}
