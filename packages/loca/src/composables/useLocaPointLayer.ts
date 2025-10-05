import { computed, shallowRef, unref } from 'vue'
import type { LocaContainer, LocaLayerStyle, LocaPointLayer, LocaPointLayerOptions, MaybeRefMap } from '../types'
import { getLoca } from '../utils'

export interface PointLike {
  [key: string]: any
}

export interface UseLocaPointLayerOptions extends LocaPointLayerOptions {
  container?: LocaContainer | null
}

export function useLocaPointLayer(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  options: UseLocaPointLayerOptions = {},
) {
  const containerRef = computed(() => {
    const resolved = typeof container === 'function' ? container() : unref(container as any)
    return resolved ?? options.container ?? null
  })
  const layer = shallowRef<LocaPointLayer<PointLike> | null>(null)

  function ensureLayer() {
    if (!layer.value) {
      const loca = getLoca()
      layer.value = new loca.PointLayer(options)
    }
    return layer.value
  }

  function setData(data: PointLike[], lngKey = 'lng', latKey = 'lat') {
    if (!Array.isArray(data))
      throw new Error('[amap-vue] Loca point layer data must be an array.')

    const layerInstance = ensureLayer()
    layerInstance.setData(data, {
      lnglat(item: PointLike) {
        const lng = item[lngKey]
        const lat = item[latKey]
        if (typeof lng !== 'number' || typeof lat !== 'number')
          throw new Error(`[amap-vue] Loca point layer requires numeric "${lngKey}"/"${latKey}" fields on each data item.`)
        return [lng, lat]
      },
    })
  }

  function setStyle(style: LocaLayerStyle<PointLike>) {
    const layerInstance = ensureLayer()
    layerInstance.setStyle(style)
  }

  function addTo(target?: LocaContainer | null) {
    const layerInstance = ensureLayer()
    const resolved = target ?? containerRef.value
    if (!resolved)
      throw new Error('[amap-vue] Attempted to add a Loca point layer without a container.')
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

  return {
    layer,
    ensureLayer,
    setData,
    setStyle,
    addTo,
    remove,
    render,
    destroy,
  }
}
