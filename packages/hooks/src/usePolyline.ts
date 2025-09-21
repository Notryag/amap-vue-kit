import type { LngLatLike } from '@amap-vue/shared'
import { loader, toLngLat } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

import type { OverlayLifecycle } from './useOverlay'
import { useOverlay } from './useOverlay'

export interface UsePolylineOptions extends Partial<AMap.PolylineOptions> {
  path?: LngLatLike[]
  visible?: boolean
}

export interface UsePolylineReturn extends OverlayLifecycle<AMap.Polyline> {
  setPath: (path: LngLatLike[] | undefined) => void
  setOptions: (options: Partial<AMap.PolylineOptions>) => void
  setExtData: (extData: any) => void
  show: () => void
  hide: () => void
}

function normalizePath(AMapInstance: typeof AMap | undefined, path: LngLatLike[] | undefined) {
  if (!Array.isArray(path))
    return []
  return path.map(item => (AMapInstance ? toLngLat(AMapInstance, item) ?? item : item))
}

export function usePolyline(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UsePolylineOptions>,
): UsePolylineReturn {
  const optionsRef = computed<UsePolylineOptions>(() => ({
    ...(toValue(options) as UsePolylineOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(mapRef, optionsRef, ({ AMap, map, options: polylineOptions }) => {
    const { path, visible, map: _ignored, ...rest } = polylineOptions as UsePolylineOptions & { map?: AMap.Map }
    const polyline = new AMap.Polyline({
      ...rest,
      path: normalizePath(AMap, path),
    })
    polyline.setMap(map)
    if (visible === false)
      polyline.hide()
    return polyline
  }, (polyline, nextOptions) => {
    const { path, visible, map: _ignored, ...rest } = nextOptions as UsePolylineOptions & { map?: AMap.Map }
    if (Object.keys(rest).length)
      polyline.setOptions(rest)
    if (path !== undefined)
      setPathInternal(polyline, path)
    if (visible != null)
      visible ? polyline.show() : polyline.hide()
  })

  function setPathInternal(polyline: AMap.Polyline, path: LngLatLike[] | undefined) {
    if (!Array.isArray(path))
      return
    const AMapInstance = loader.get()
    const resolved = normalizePath(AMapInstance, path)
    polyline.setPath(resolved as any)
  }

  function setPath(path: LngLatLike[] | undefined) {
    const instance = overlay.overlay.value
    if (!instance)
      return
    setPathInternal(instance, path)
  }

  function setOptions(options: Partial<AMap.PolylineOptions>) {
    overlay.overlay.value?.setOptions(options)
  }

  function setExtData(extData: any) {
    const instance = overlay.overlay.value as any
    if (!instance)
      return
    if (typeof instance.setExtData === 'function')
      instance.setExtData(extData)
    else
      instance.setOptions?.({ extData })
  }

  function show() {
    overlay.overlay.value?.show()
  }

  function hide() {
    overlay.overlay.value?.hide()
  }

  return {
    ...overlay,
    setPath,
    setOptions,
    setExtData,
    show,
    hide,
  }
}
