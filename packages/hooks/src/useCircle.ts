import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toLngLat } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseCircleOptions extends Partial<AMap.CircleOptions> {
  center?: LngLatLike
  radius?: number
  visible?: boolean
}

export interface UseCircleReturn extends OverlayLifecycle<AMap.Circle> {
  setCenter: (center: LngLatLike | undefined) => void
  setRadius: (radius: number | undefined) => void
  setOptions: (options: Partial<AMap.CircleOptions>) => void
  setExtData: (extData: any) => void
  show: () => void
  hide: () => void
}

function resolveCenter(AMapInstance: typeof AMap | undefined, center: LngLatLike | undefined) {
  if (!center)
    return undefined
  return AMapInstance ? toLngLat(AMapInstance, center) ?? center : center
}

export function useCircle(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseCircleOptions>,
): UseCircleReturn {
  const optionsRef = computed<UseCircleOptions>(() => ({
    ...(toValue(options) as UseCircleOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(mapRef, optionsRef, ({ AMap, map, options: circleOptions }) => {
    const { center, radius, visible, map: _ignored, ...rest } = circleOptions as UseCircleOptions & { map?: AMap.Map }
    const circle = new AMap.Circle({
      ...rest,
      center: resolveCenter(AMap, center),
      radius,
    })
    circle.setMap(map)
    if (visible === false)
      circle.hide()
    return circle
  }, (circle, nextOptions) => {
    const { center, radius, visible, map: _ignored, ...rest } = nextOptions as UseCircleOptions & { map?: AMap.Map }
    if (Object.keys(rest).length)
      circle.setOptions(rest)
    if (center !== undefined)
      setCenterInternal(circle, center)
    if (typeof radius === 'number')
      circle.setRadius(radius)
    if (visible != null)
      visible ? circle.show() : circle.hide()
  })

  function setCenterInternal(circle: AMap.Circle, center: LngLatLike | undefined) {
    if (!center)
      return
    const AMapInstance = loader.get()
    const resolved = resolveCenter(AMapInstance, center)
    circle.setCenter(resolved as any)
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

  function setOptions(options: Partial<AMap.CircleOptions>) {
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
