import { computed, shallowRef, unref } from 'vue'
import type {
  LocaContainer,
  LocaLayerStyle,
  LocaPolygonLayer,
  LocaPolygonLayerOptions,
  MaybeRefMap,
} from '../types'
import { getLoca } from '../utils'

export type PolygonSource = Record<string, any>

export interface PolygonLikeProperties {
  [key: string]: any
}

export function useLocaPolygonLayer(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  options: LocaPolygonLayerOptions = {},
) {
  const containerRef = computed(() => {
    const resolved = typeof container === 'function' ? container() : unref(container as any)
    return resolved ?? null
  })
  const layer = shallowRef<LocaPolygonLayer<PolygonLikeProperties> | null>(null)

  function ensureLayer() {
    if (!layer.value) {
      const loca = getLoca()
      layer.value = new loca.PolygonLayer(options)
    }
    return layer.value
  }

  function setData(source: PolygonSource) {
    const layerInstance = ensureLayer()
    if (!source)
      throw new Error('[amap-vue] Polygon layer requires a GeoJSON feature or feature collection.')
    layerInstance.setData(source as any)
  }

  function setStyle(style: LocaLayerStyle<PolygonLikeProperties>) {
    const layerInstance = ensureLayer()
    layerInstance.setStyle(style)
  }

  function addTo(target?: LocaContainer | null) {
    const layerInstance = ensureLayer()
    const resolved = target ?? containerRef.value
    if (!resolved)
      throw new Error('[amap-vue] Attempted to add a Loca polygon layer without a container.')
    layerInstance.addTo(resolved)
  }

  function remove() {
    layer.value?.remove()
  }

  function render() {
    if (layer.value && typeof (layer.value as any).render === 'function')
      layer.value!.render()
    else
      containerRef.value?.render()
  }

  function destroy() {
    if (layer.value) {
      layer.value.destroy()
      layer.value = null
    }
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
