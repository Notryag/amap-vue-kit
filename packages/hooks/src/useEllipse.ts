import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toLngLat } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseEllipseOptions extends Partial<AMap.EllipseOptions> {
  center?: LngLatLike
  radius?: [number, number]
  visible?: boolean
}
export interface UseEllipseReturn extends OverlayLifecycle<AMap.Ellipse> {
  setCenter: (center: LngLatLike | undefined) => void
  setRadius: (radius: [number, number] | undefined) => void
  setOptions: (options: Partial<AMap.EllipseOptions>) => void
  setExtData: (extData: any) => void
  show: () => void
  hide: () => void
}

function resolveCenter(AMapInstance: typeof AMap | undefined, center: LngLatLike | undefined) {
  if (!center)
    return undefined
  return AMapInstance ? toLngLat(AMapInstance, center) ?? center : center
}

export function useEllipse(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseEllipseOptions>,
): UseEllipseReturn {
  const optionsRef = computed<UseEllipseOptions>(() => ({
    ...(toValue(options) as UseEllipseOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(mapRef, optionsRef, ({ AMap, map, options: ellipseOptions }) => {
    const { center, radius, visible, map: _ignored, ...rest } = ellipseOptions as UseEllipseOptions & { map?: AMap.Map }
    const ellipse = new AMap.Ellipse({
      ...rest,
      center: resolveCenter(AMap, center),
      radius,
    })
    ellipse.setMap(map)
    if (visible === false)
      ellipse.hide()
    return ellipse
  }, (ellipse, nextOptions) => {
    const { center, radius, visible, map: _ignored, ...rest } = nextOptions as UseEllipseOptions & { map?: AMap.Map }
    if (Object.keys(rest).length)
      ellipse.setOptions(rest)
    if (center !== undefined)
      setCenterInternal(ellipse, center)
    if (Array.isArray(radius))
      ellipse.setRadius(radius as [number, number])
    if (visible != null)
      visible ? ellipse.show() : ellipse.hide()
  })

  function setCenterInternal(ellipse: AMap.Ellipse, center: LngLatLike | undefined) {
    if (!center)
      return
    const AMapInstance = loader.get()
    const resolved = resolveCenter(AMapInstance, center)
    ellipse.setCenter(resolved as any)
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

  function setRadius(radius: [number, number] | undefined) {
    if (!Array.isArray(radius))
      return
    overlay.overlay.value?.setRadius(radius)
  }

  function setOptions(options: Partial<AMap.EllipseOptions>) {
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
