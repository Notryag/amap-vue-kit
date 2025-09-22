import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toLngLat } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseCircleMarkerOptions extends Partial<AMap.CircleMarkerOptions> {
  center?: LngLatLike
  radius?: number
  visible?: boolean
  options?: Partial<AMap.CircleMarkerOptions>
}

export interface UseCircleMarkerReturn extends OverlayLifecycle<AMap.CircleMarker> {
  setCenter: (center: LngLatLike | undefined) => void
  setRadius: (radius: number | undefined) => void
  setOptions: (options: Partial<AMap.CircleMarkerOptions>) => void
  setExtData: (extData: any) => void
  show: () => void
  hide: () => void
}

export function useCircleMarker(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseCircleMarkerOptions>,
): UseCircleMarkerReturn {
  const optionsRef = computed<UseCircleMarkerOptions>(() => ({
    ...(toValue(options) as UseCircleMarkerOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(mapRef, optionsRef, ({ AMap, map, options: markerOptions }) => {
    const {
      center,
      radius,
      visible,
      options: extraOptions,
      ...rest
    } = markerOptions as UseCircleMarkerOptions & { map?: AMap.Map }
    const mergedOptions = { ...extraOptions, ...rest }
    const marker = new AMap.CircleMarker({
      ...mergedOptions,
      center: center ? toLngLat(AMap, center) ?? center : undefined,
      radius,
    })
    marker.setMap(map)
    if (visible === false)
      marker.hide()
    return marker
  }, (marker, nextOptions) => {
    const {
      center,
      radius,
      visible,
      options: extraOptions,
      map: _ignored,
      ...rest
    } = nextOptions as UseCircleMarkerOptions & { map?: AMap.Map }
    const mergedOptions = { ...extraOptions, ...rest }
    if (Object.keys(mergedOptions).length)
      marker.setOptions(mergedOptions)
    if (center !== undefined)
      setCenterInternal(marker, center)
    if (typeof radius === 'number')
      marker.setRadius(radius)
    if (visible != null)
      visible ? marker.show() : marker.hide()
  })

  function setCenterInternal(marker: AMap.CircleMarker, center: LngLatLike | undefined) {
    if (!center)
      return
    const AMapInstance = loader.get()
    const resolved = AMapInstance ? toLngLat(AMapInstance, center) ?? center : center
    marker.setCenter(resolved as any)
  }

  function setCenter(center: LngLatLike | undefined) {
    const instance = overlay.overlay.value
    if (!instance)
      return
    if (!center) {
      instance.setCenter(center as any)
      return
    }
    setCenterInternal(instance, center)
  }

  function setRadius(radius: number | undefined) {
    if (radius == null)
      return
    overlay.overlay.value?.setRadius(radius)
  }

  function setOptions(options: Partial<AMap.CircleMarkerOptions>) {
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
    setCenter,
    setRadius,
    setOptions,
    setExtData,
    show,
    hide,
  }
}
