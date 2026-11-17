import type {
  LocaContainer,
  LocaLayerStyle,
  LocaPulseLineLayer,
  LocaPulseLineLayerOptions,
  MaybeRefMap,
} from '../types'
import { computed, shallowRef, unref } from 'vue'
import { createFeatureCollection, createGeoJSONSource, createLineFeature, getLoca } from '../utils'

export interface PulseLineItem {
  path: [number, number][]
  [key: string]: any
}

export function useLocaPulseLineLayer(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  options: LocaPulseLineLayerOptions = {},
) {
  const containerRef = computed(() => {
    const resolved = typeof container === 'function' ? container() : unref(container as any)
    return resolved ?? null
  })
  const layer = shallowRef<LocaPulseLineLayer<PulseLineItem> | null>(null)

  function ensureLayer() {
    if (!layer.value) {
      const loca = getLoca()
      layer.value = new loca.PulseLineLayer(options)
    }
    return layer.value
  }

  function setData(data: PulseLineItem[], pathKey = 'path') {
    if (!Array.isArray(data))
      throw new Error('[amap-vue] Pulse line layer data must be an array.')

    const layerInstance = ensureLayer()
    const features = data.map((item) => {
      const path = item[pathKey]
      if (!Array.isArray(path) || path.some(point => !Array.isArray(point) || point.length < 2))
        throw new Error('[amap-vue] Pulse line items require a "path" array of [lng, lat] tuples.')

      return createLineFeature(item, path)
    })

    layerInstance.setSource(createGeoJSONSource(createFeatureCollection(features)))
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

  function addTo(target?: LocaContainer | null) {
    const layerInstance = ensureLayer()
    const resolved = target ?? containerRef.value
    if (!resolved)
      throw new Error('[amap-vue] Attempted to add a Loca pulse line layer without a container.')
    resolved.add(layerInstance)
  }

  function remove() {
    if (layer.value)
      containerRef.value?.remove(layer.value)
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
