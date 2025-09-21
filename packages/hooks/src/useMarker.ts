import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { isClient, loader, toLngLat, toPixel, warn } from '@amap-vue/shared'

import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface UseMarkerOptions extends Partial<AMap.MarkerOptions> {
  position?: LngLatLike
  offset?: AMap.Pixel | [number, number]
}

export interface UseMarkerReturn {
  marker: ShallowRef<AMap.Marker | null>
  setPosition: (position: LngLatLike | undefined) => void
  setIcon: (icon: AMap.Icon | string | undefined) => void
  setLabel: (label: AMap.MarkerLabelOptions | string | undefined) => void
  setExtData: (extData: any) => void
  setDraggable: (draggable: boolean | undefined) => void
  setZIndex: (zIndex: number | undefined) => void
  setOffset: (offset: AMap.Pixel | [number, number] | undefined) => void
  show: () => void
  hide: () => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
  destroy: () => void
}

export function useMarker(mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>, options: MaybeRefOrGetter<UseMarkerOptions> = {}): UseMarkerReturn {
  const marker = shallowRef<AMap.Marker | null>(null)
  const listeners = new Set<{ event: string, handler: (event: any) => void }>()
  const optionsRef = computed<UseMarkerOptions>(() => ({
    ...(toValue(options) as UseMarkerOptions | undefined ?? {}),
  }))

  async function ensureMarker(mapInstance: AMap.Map | null | undefined) {
    if (!isClient || marker.value || !mapInstance)
      return

    try {
      const opts = optionsRef.value
      const { position, offset, ...rest } = opts
      const AMap = loader.get() ?? await loader.load()
      const instance = new AMap.Marker({
        ...rest,
        map: mapInstance,
      })
      marker.value = instance
      bindListeners(instance)
      if (position)
        setPosition(position)
      if (offset)
        setOffset(offset)
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
    }
  }

  function bindListeners(instance: AMap.Marker) {
    for (const listener of listeners)
      (instance as any).on?.(listener.event, listener.handler)
  }

  function unbindListeners(instance: AMap.Marker) {
    for (const listener of listeners)
      (instance as any).off?.(listener.event, listener.handler)
  }

  watch(() => toValue(mapRef), (mapInstance) => {
    if (!mapInstance) {
      marker.value?.setMap(null as any)
      return
    }

    if (marker.value)
      marker.value.setMap(mapInstance)
    else
      ensureMarker(mapInstance)
  }, { immediate: true })

  const initialMap = toValue(mapRef)
  if (initialMap)
    ensureMarker(initialMap as AMap.Map)

  watch(() => optionsRef.value.position, value => setPosition(value), { deep: true })
  watch(() => optionsRef.value.icon, value => setIcon(value as any))
  watch(() => optionsRef.value.label, value => setLabel(value as any))
  watch(() => optionsRef.value.draggable, value => setDraggable(value))
  watch(() => optionsRef.value.zIndex, value => setZIndex(value))
  watch(() => optionsRef.value.extData, value => setExtData(value))
  watch(() => optionsRef.value.offset, value => setOffset(value as any), { deep: true })
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
    const AMap = loader.get()
    const value = AMap ? toLngLat(AMap, position) : position
    instance.setPosition(value as any)
  }

  function setIcon(icon: AMap.Icon | string | undefined) {
    if (!icon)
      return
    marker.value?.setIcon(icon as any)
  }

  function setLabel(label: AMap.MarkerLabelOptions | string | undefined) {
    if (!label)
      return
    marker.value?.setLabel(label as any)
  }

  function setExtData(extData: any) {
    marker.value?.setExtData(extData)
  }

  function setDraggable(draggable: boolean | undefined) {
    if (draggable == null)
      return
    marker.value?.setDraggable(draggable)
  }

  function setZIndex(zIndex: number | undefined) {
    if (zIndex == null)
      return
    marker.value?.setzIndex(zIndex)
  }

  function setOffset(offset: AMap.Pixel | [number, number] | undefined) {
    if (!offset)
      return
    const instance = marker.value
    if (!instance)
      return
    const AMap = loader.get()
    const value = AMap ? toPixel(AMap, offset) : offset
    instance.setOffset(value as any)
  }

  function show() {
    marker.value?.show()
  }

  function hide() {
    marker.value?.hide()
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
    const instance = marker.value as any
    if (instance) {
      unbindListeners(instance)
      instance.setMap?.(null)
      instance.destroy?.()
    }
    marker.value = null
  }

  return {
    marker,
    setPosition,
    setIcon,
    setLabel,
    setExtData,
    setDraggable,
    setZIndex,
    setOffset,
    show,
    hide,
    on,
    off,
    destroy,
  }
}
