import type { LngLatLike, PixelLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toLngLat, toPixel } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseTextOptions extends Partial<AMap.TextOptions> {
  position?: LngLatLike
  offset?: PixelLike
  visible?: boolean
  text?: string
}

export interface UseTextReturn extends OverlayLifecycle<AMap.Text> {
  setPosition: (position: LngLatLike | undefined) => void
  setOffset: (offset: PixelLike | undefined) => void
  setText: (text: string | undefined) => void
  setStyle: (style: Record<string, any> | undefined) => void
  setZIndex: (zIndex: number | undefined) => void
  setExtData: (extData: any) => void
  setOptions: (options: Partial<AMap.TextOptions>) => void
  show: () => void
  hide: () => void
}

export function useText(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTextOptions>,
): UseTextReturn {
  const optionsRef = computed<UseTextOptions>(() => ({
    ...(toValue(options) as UseTextOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(mapRef, optionsRef, ({ AMap, map, options: textOptions }) => {
    const { position, offset, visible, ...rest } = textOptions as UseTextOptions & { map?: AMap.Map }
    const text = new AMap.Text({
      ...rest,
      position: position ? toLngLat(AMap, position) ?? position : rest.position,
      offset: offset ? toPixel(AMap, offset) ?? offset : rest.offset,
    })
    text.setMap(map)
    if (visible === false)
      text.hide()
    return text
  }, (text, nextOptions) => {
    const { position, offset, visible, map: _ignored, ...rest } = nextOptions as UseTextOptions & { map?: AMap.Map }
    if (Object.keys(rest).length)
      text.setOptions(rest)
    if (position !== undefined)
      setPositionInternal(text, position)
    if (offset !== undefined)
      setOffsetInternal(text, offset)
    if (visible != null)
      visible ? text.show() : text.hide()
  })

  function setPositionInternal(text: AMap.Text, position: LngLatLike | undefined) {
    if (!position)
      return
    const AMapInstance = loader.get()
    const resolved = AMapInstance ? toLngLat(AMapInstance, position) ?? position : position
    text.setPosition(resolved as any)
  }

  function setOffsetInternal(text: AMap.Text, offset: PixelLike | undefined) {
    if (offset == null)
      return
    const AMapInstance = loader.get()
    const resolved = AMapInstance ? toPixel(AMapInstance, offset) ?? offset : offset
    text.setOffset?.(resolved as any)
  }

  function setPosition(position: LngLatLike | undefined) {
    const instance = overlay.overlay.value
    if (!instance)
      return
    if (!position) {
      instance.setPosition(position as any)
      return
    }
    setPositionInternal(instance, position)
  }

  function setOffset(offset: PixelLike | undefined) {
    const instance = overlay.overlay.value
    if (!instance)
      return
    setOffsetInternal(instance, offset)
  }

  function setText(textValue: string | undefined) {
    if (textValue == null)
      return
    overlay.overlay.value?.setText(textValue)
  }

  function setStyle(style: Record<string, any> | undefined) {
    if (!style)
      return
    overlay.overlay.value?.setStyle(style)
  }

  function setZIndex(zIndex: number | undefined) {
    if (zIndex == null)
      return
    overlay.overlay.value?.setzIndex(zIndex)
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

  function setOptions(options: Partial<AMap.TextOptions>) {
    overlay.overlay.value?.setOptions(options)
  }

  function show() {
    overlay.overlay.value?.show()
  }

  function hide() {
    overlay.overlay.value?.hide()
  }

  return {
    ...overlay,
    setPosition,
    setOffset,
    setText,
    setStyle,
    setZIndex,
    setExtData,
    setOptions,
    show,
    hide,
  }
}
