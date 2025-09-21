import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toLngLat, toPixel, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface UseLabelMarkerOptions extends Partial<AMap.LabelMarkerOptions> {
  position?: LngLatLike
  text?: AMap.LabelMarkerTextOptions
  icon?: AMap.LabelMarkerIconOptions
  zooms?: [number, number]
  opacity?: number
  zIndex?: number
  extData?: any
  visible?: boolean
}

export interface UseLabelMarkerReturn {
  marker: ShallowRef<AMap.LabelMarker | null>
  setPosition: (position: LngLatLike | undefined) => void
  setText: (text: AMap.LabelMarkerTextOptions | undefined) => void
  setIcon: (icon: AMap.LabelMarkerIconOptions | undefined) => void
  setZooms: (zooms: [number, number] | undefined) => void
  setOpacity: (opacity: number | undefined) => void
  setZIndex: (zIndex: number | undefined) => void
  setExtData: (extData: any) => void
  show: () => void
  hide: () => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
  destroy: () => void
}

export function useLabelMarker(
  layerRef: MaybeRefOrGetter<AMap.LabelsLayer | null | undefined>,
  options: MaybeRefOrGetter<UseLabelMarkerOptions>,
): UseLabelMarkerReturn {
  const marker = shallowRef<AMap.LabelMarker | null>(null)
  const listeners = new Set<{ event: string, handler: (event: any) => void }>()
  const optionsRef = computed<UseLabelMarkerOptions>(() => ({
    ...(toValue(options) as UseLabelMarkerOptions | undefined ?? {}),
  }))
  let attachedLayer: AMap.LabelsLayer | null = null

  async function ensureMarker(layerInstance: AMap.LabelsLayer | null | undefined) {
    if (!isClient || marker.value || !layerInstance)
      return

    try {
      const opts = optionsRef.value
      const { position, ...rest } = opts
      const AMapInstance = await loader.load({ plugins: ['AMap.LabelsLayer'] })
      const instance = new (AMapInstance as any).LabelMarker(rest)
      marker.value = instance
      bindListeners(instance)
      attachToLayer(layerInstance)
      if (position)
        setPosition(position)
      if (opts.text)
        setText(opts.text)
      if (opts.icon)
        setIcon(opts.icon)
      if (opts.zooms)
        setZooms(opts.zooms)
      if (opts.opacity != null)
        setOpacity(opts.opacity)
      if (opts.zIndex != null)
        setZIndex(opts.zIndex)
      if (opts.extData !== undefined)
        setExtData(opts.extData)
      if (opts.visible != null) {
        if (opts.visible)
          show()
        else
          hide()
      }
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
    }
  }

  function bindListeners(instance: AMap.LabelMarker) {
    for (const listener of listeners)
      (instance as any).on?.(listener.event, listener.handler)
  }

  function unbindListeners(instance: AMap.LabelMarker) {
    for (const listener of listeners)
      (instance as any).off?.(listener.event, listener.handler)
  }

  function attachToLayer(layerInstance: AMap.LabelsLayer) {
    if (!marker.value)
      return
    if (attachedLayer === layerInstance)
      return
    if (attachedLayer)
      detachFromLayer()
    layerInstance.add(marker.value)
    attachedLayer = layerInstance
  }

  function detachFromLayer() {
    if (marker.value && attachedLayer)
      attachedLayer.remove(marker.value)
    attachedLayer = null
  }

  watch(() => toValue(layerRef), (layerInstance) => {
    if (!layerInstance) {
      detachFromLayer()
      return
    }

    if (marker.value)
      attachToLayer(layerInstance)
    else
      ensureMarker(layerInstance)
  }, { immediate: true })

  watch(() => optionsRef.value.position, value => setPosition(value), { deep: true })
  watch(() => optionsRef.value.text, value => setText(value), { deep: true })
  watch(() => optionsRef.value.icon, value => setIcon(value), { deep: true })
  watch(() => optionsRef.value.zooms, value => setZooms(value as [number, number] | undefined), { deep: true })
  watch(() => optionsRef.value.opacity, value => setOpacity(value))
  watch(() => optionsRef.value.zIndex, value => setZIndex(value))
  watch(() => optionsRef.value.extData, value => setExtData(value))
  watch(() => optionsRef.value.visible, (visible) => {
    if (visible == null)
      return
    if (visible)
      show()
    else
      hide()
  })

  onBeforeUnmount(() => {
    destroy()
  })

  function setPosition(position: LngLatLike | undefined) {
    if (!position)
      return
    const instance = marker.value
    if (!instance)
      return
    const AMapInstance = loader.get()
    const value = AMapInstance ? toLngLat(AMapInstance, position) : position
    instance.setPosition(value as any)
  }

  function resolveTextOptions(text: AMap.LabelMarkerTextOptions) {
    if (!text)
      return text
    if (!('offset' in text) || text.offset == null)
      return text
    const { offset, ...rest } = text as AMap.LabelMarkerTextOptions & { offset?: AMap.Pixel | [number, number] }
    const AMapInstance = loader.get()
    if (!AMapInstance)
      return text
    const resolvedOffset = Array.isArray(offset) ? toPixel(AMapInstance, offset) : offset
    return {
      ...rest,
      offset: resolvedOffset ?? offset,
    }
  }

  function setText(text: AMap.LabelMarkerTextOptions | undefined) {
    if (!text)
      return
    marker.value?.setText(resolveTextOptions(text) as any)
  }

  function setIcon(icon: AMap.LabelMarkerIconOptions | undefined) {
    if (!icon)
      return
    marker.value?.setIcon(icon as any)
  }

  function setZooms(zooms: [number, number] | undefined) {
    if (!zooms)
      return
    marker.value?.setZooms(zooms)
  }

  function setOpacity(opacity: number | undefined) {
    if (opacity == null)
      return
    marker.value?.setOpacity(opacity)
  }

  function setZIndex(zIndex: number | undefined) {
    if (zIndex == null)
      return
    marker.value?.setzIndex(zIndex)
  }

  function setExtData(extData: any) {
    marker.value?.setExtData(extData)
  }

  function show() {
    marker.value?.show?.()
  }

  function hide() {
    marker.value?.hide?.()
  }

  function on(event: string, handler: (event: any) => void) {
    const record = { event, handler }
    listeners.add(record)
    if (marker.value)
      (marker.value as any).on?.(event, handler)
  }

  function off(event: string, handler: (event: any) => void) {
    for (const listener of Array.from(listeners)) {
      if (listener.event === event && listener.handler === handler) {
        if (marker.value)
          (marker.value as any).off?.(event, handler)
        listeners.delete(listener)
      }
    }
  }

  function destroy() {
    const instance = marker.value
    if (instance) {
      unbindListeners(instance)
      detachFromLayer()
      instance.destroy?.()
    }
    marker.value = null
    listeners.clear()
  }

  return {
    marker,
    setPosition,
    setText,
    setIcon,
    setZooms,
    setOpacity,
    setZIndex,
    setExtData,
    show,
    hide,
    on,
    off,
    destroy,
  }
}
