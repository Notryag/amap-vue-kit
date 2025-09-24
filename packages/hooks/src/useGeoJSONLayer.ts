import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseGeoJSONLayerOptions extends Partial<AMap.GeoJSON.Options> {
  data?: AMap.GeoJSON.GeoJSONObject | AMap.GeoJSON.GeoJSONObject[]
  visible?: boolean
}

export interface UseGeoJSONLayerReturn extends OverlayLifecycle<AMap.GeoJSON> {
  setData: (data: AMap.GeoJSON.GeoJSONObject | AMap.GeoJSON.GeoJSONObject[]) => void
  addOverlays: (overlays: any | any[]) => void
  removeOverlays: (overlays: any | any[]) => void
  clear: () => void
  show: () => void
  hide: () => void
  setOptions: (options: Partial<AMap.GeoJSON.Options>) => void
  getOverlays: () => any[]
}

function hasOwn(target: object, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(target, key)
}

function applyGeoJSONOptions(instance: AMap.GeoJSON, options: UseGeoJSONLayerOptions) {
  const { data, visible, ...rest } = options
  if (rest && Object.keys(rest).length)
    (instance as any).setOptions?.(rest)
  if (hasOwn(options, 'data') && data)
    (instance as any).importData?.(data)
  if (visible != null) {
    if (visible)
      (instance as any).show?.()
    else
      (instance as any).hide?.()
  }
}

export function useGeoJSONLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseGeoJSONLayerOptions>,
): UseGeoJSONLayerReturn {
  const optionsRef = computed<UseGeoJSONLayerOptions>(() => ({
    ...(toValue(options) as UseGeoJSONLayerOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(
    mapRef,
    optionsRef,
    ({ AMap, map, options: geoOptions }) => {
      const { data, visible, ...rest } = geoOptions
      const instance = new (AMap as any).GeoJSON(rest) as AMap.GeoJSON
      if (data)
        (instance as any).importData?.(data)
      instance.setMap(map)
      if (visible === false)
        instance.hide?.()
      return instance
    },
    (instance, nextOptions) => {
      applyGeoJSONOptions(instance, nextOptions)
    },
  )

  function setData(data: AMap.GeoJSON.GeoJSONObject | AMap.GeoJSON.GeoJSONObject[]) {
    if (!data)
      return
    overlay.overlay.value?.importData?.(data)
  }

  function addOverlays(overlays: any | any[]) {
    if (!overlays)
      return
    overlay.overlay.value?.addOverlays?.(overlays)
  }

  function removeOverlays(overlays: any | any[]) {
    if (!overlays)
      return
    overlay.overlay.value?.removeOverlays?.(overlays)
  }

  function clear() {
    overlay.overlay.value?.clearOverlays?.()
  }

  function show() {
    overlay.overlay.value?.show?.()
  }

  function hide() {
    overlay.overlay.value?.hide?.()
  }

  function setOptions(options: Partial<AMap.GeoJSON.Options>) {
    if (!options)
      return
    overlay.overlay.value?.setOptions?.(options)
  }

  function getOverlays() {
    return overlay.overlay.value?.getOverlays?.() ?? []
  }

  return {
    ...overlay,
    setData,
    addOverlays,
    removeOverlays,
    clear,
    show,
    hide,
    setOptions,
    getOverlays,
  }
}
