import type { BoundsLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toBounds } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseRectangleOptions extends Partial<AMap.RectangleOptions> {
  bounds?: BoundsLike
  visible?: boolean
}
export interface UseRectangleReturn extends OverlayLifecycle<AMap.Rectangle> {
  setBounds: (bounds: BoundsLike | undefined) => void
  setOptions: (options: Partial<AMap.RectangleOptions>) => void
  setExtData: (extData: any) => void
  show: () => void
  hide: () => void
}

function resolveBounds(AMapInstance: typeof AMap | undefined, bounds: BoundsLike | undefined) {
  if (!bounds)
    return undefined
  return AMapInstance ? toBounds(AMapInstance, bounds) ?? bounds : bounds
}

export function useRectangle(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseRectangleOptions>,
): UseRectangleReturn {
  const optionsRef = computed<UseRectangleOptions>(() => ({
    ...(toValue(options) as UseRectangleOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(mapRef, optionsRef, ({ AMap, map, options: rectangleOptions }) => {
    const { bounds, visible, map: _ignored, ...rest } = rectangleOptions as UseRectangleOptions & { map?: AMap.Map }
    const rectangle = new AMap.Rectangle({
      ...rest,
      bounds: resolveBounds(AMap, bounds),
    })
    rectangle.setMap(map)
    if (visible === false)
      rectangle.hide()
    return rectangle
  }, (rectangle, nextOptions) => {
    const { bounds, visible, map: _ignored, ...rest } = nextOptions as UseRectangleOptions & { map?: AMap.Map }
    if (Object.keys(rest).length)
      rectangle.setOptions(rest)
    if (bounds !== undefined)
      setBoundsInternal(rectangle, bounds)
    if (visible != null)
      visible ? rectangle.show() : rectangle.hide()
  })

  function setBoundsInternal(rectangle: AMap.Rectangle, bounds: BoundsLike | undefined) {
    if (!bounds)
      return
    const AMapInstance = loader.get()
    const resolved = resolveBounds(AMapInstance, bounds)
    if (resolved)
      rectangle.setBounds(resolved as any)
  }

  function setBounds(bounds: BoundsLike | undefined) {
    const instance = overlay.overlay.value
    if (!instance)
      return
    if (!bounds) {
      instance.setBounds(bounds as any)
      return
    }
    setBoundsInternal(instance, bounds)
  }

  function setOptions(options: Partial<AMap.RectangleOptions>) {
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
    setBounds,
    setOptions,
    setExtData,
    show,
    hide,
  }
}
