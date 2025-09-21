import type { LngLatLike, PixelLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toLngLat, toPixel, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface UseInfoWindowOptions extends Partial<AMap.InfoWindowOptions> {
  position?: LngLatLike
  open?: boolean
  offset?: PixelLike
  content?: string | HTMLElement | null
}

export interface UseInfoWindowReturn {
  infoWindow: ShallowRef<AMap.InfoWindow | null>
  open: () => void
  close: () => void
  setPosition: (position: LngLatLike | undefined) => void
  setOffset: (offset: PixelLike | undefined) => void
  setAnchor: (anchor: AMap.InfoWindowAnchor | undefined) => void
  setIsCustom: (isCustom: boolean | undefined) => void
  setContent: (content: string | HTMLElement | null | undefined) => void
  setOptions: (options: Partial<AMap.InfoWindowOptions>) => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
  destroy: () => void
}

export function useInfoWindow(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseInfoWindowOptions> = {},
): UseInfoWindowReturn {
  const infoWindow = shallowRef<AMap.InfoWindow | null>(null)
  const currentMap = shallowRef<AMap.Map | null>(null)
  const listeners = new Set<{ event: string, handler: (event: any) => void }>()
  const optionsRef = computed<UseInfoWindowOptions>(() => ({
    ...(toValue(options) as UseInfoWindowOptions | undefined ?? {}),
  }))

  let pendingOpen = false
  let lastPosition: LngLatLike | undefined

  function bindListeners(instance: AMap.InfoWindow) {
    for (const listener of listeners)
      (instance as any).on?.(listener.event, listener.handler)
  }

  function unbindListeners(instance: AMap.InfoWindow) {
    for (const listener of listeners)
      (instance as any).off?.(listener.event, listener.handler)
  }

  async function ensureInfoWindow(mapInstance: AMap.Map | null | undefined) {
    if (!isClient || infoWindow.value || !mapInstance)
      return

    try {
      const opts = optionsRef.value
      const { position, open, content, offset, ...rest } = opts
      const AMap = loader.get() ?? await loader.load()
      const instance = new AMap.InfoWindow({
        ...rest,
        content: content ?? rest.content,
        offset: offset ? toPixel(AMap, offset) ?? undefined : rest.offset,
      })
      infoWindow.value = instance
      bindListeners(instance)

      if (position)
        setPosition(position)
      if (offset)
        setOffset(offset)
      if (typeof rest.anchor !== 'undefined')
        setAnchor(rest.anchor as AMap.InfoWindowAnchor | undefined)
      if (typeof rest.isCustom !== 'undefined')
        setIsCustom(rest.isCustom as boolean | undefined)
      if (content != null)
        setContent(content)
      if (open != null)
        pendingOpen = open

      if (pendingOpen)
        openWindow()
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
    }
  }

  watch(() => toValue(mapRef), (mapInstance) => {
    currentMap.value = mapInstance ?? null

    if (!mapInstance) {
      infoWindow.value?.close()
      return
    }

    if (!infoWindow.value)
      ensureInfoWindow(mapInstance)
    else if (pendingOpen)
      openWindow()
  }, { immediate: true })

  const initialMap = toValue(mapRef)
  if (initialMap)
    ensureInfoWindow(initialMap as AMap.Map)

  watch(() => optionsRef.value.position, position => setPosition(position), { deep: true, immediate: true })

  watch(() => optionsRef.value.offset, (offset) => {
    if (offset != null)
      setOffset(offset)
  }, { deep: true, immediate: true })

  watch(() => optionsRef.value.anchor as AMap.InfoWindowAnchor | undefined, (anchor) => {
    if (anchor != null)
      setAnchor(anchor)
  }, { immediate: true })

  watch(() => optionsRef.value.isCustom as boolean | undefined, (isCustom) => {
    if (typeof isCustom === 'boolean')
      setIsCustom(isCustom)
  }, { immediate: true })

  watch(() => optionsRef.value.content, (content) => {
    if (content != null)
      setContent(content)
  }, { immediate: true })

  watch(() => optionsRef.value.open, (open) => {
    if (open == null)
      return
    pendingOpen = open
    if (open)
      openWindow()
    else
      closeWindow()
  }, { immediate: true })

  watch(optionsRef, (value) => {
    const instance = infoWindow.value as any
    if (!instance || typeof instance.setOptions !== 'function')
      return
    const { position, open, content, offset, anchor, isCustom, ...rest } = value
    if (Object.keys(rest).length)
      instance.setOptions(rest)
  }, { deep: true })

  onBeforeUnmount(() => {
    destroy()
  })

  function setPosition(position: LngLatLike | undefined) {
    lastPosition = position
    const instance = infoWindow.value as any
    if (!instance) {
      if (!position)
        closeWindow()
      return
    }

    if (!position) {
      instance.close?.()
      return
    }

    const AMap = loader.get()
    const resolved = AMap ? toLngLat(AMap, position) ?? position : position
    instance.setPosition?.(resolved as any)
    if (pendingOpen)
      openWindow()
  }

  function setOffset(offset: PixelLike | undefined) {
    const instance = infoWindow.value as any
    if (!instance || offset == null)
      return
    const AMap = loader.get()
    const resolved = AMap ? toPixel(AMap, offset) ?? offset : offset
    instance.setOffset?.(resolved as any)
  }

  function setAnchor(anchor: AMap.InfoWindowAnchor | undefined) {
    const instance = infoWindow.value as any
    if (!instance || anchor == null)
      return
    if (typeof instance.setAnchor === 'function')
      instance.setAnchor(anchor)
    else if (typeof instance.setOptions === 'function')
      instance.setOptions({ anchor })
  }

  function setIsCustom(isCustom: boolean | undefined) {
    const instance = infoWindow.value as any
    if (!instance || typeof isCustom !== 'boolean')
      return
    if (typeof instance.setIsCustom === 'function')
      instance.setIsCustom(isCustom)
    else if (typeof instance.setOptions === 'function')
      instance.setOptions({ isCustom })
  }

  function setContent(content: string | HTMLElement | null | undefined) {
    const instance = infoWindow.value as any
    if (!instance || content == null)
      return
    instance.setContent?.(content)
  }

  function setOptions(options: Partial<AMap.InfoWindowOptions>) {
    const instance = infoWindow.value as any
    if (!instance || typeof instance.setOptions !== 'function')
      return
    instance.setOptions(options)
  }

  function openWindow() {
    const instance = infoWindow.value as any
    const map = currentMap.value
    if (!instance || !map)
      return

    const position = lastPosition
    if (!position)
      return

    const AMap = loader.get()
    const resolved = AMap ? toLngLat(AMap, position) ?? position : position
    instance.open?.(map, resolved as any)
  }

  function closeWindow() {
    infoWindow.value?.close?.()
  }

  function open() {
    pendingOpen = true
    openWindow()
  }

  function close() {
    pendingOpen = false
    closeWindow()
  }

  function on(event: string, handler: (event: any) => void) {
    const record = { event, handler }
    listeners.add(record)
    if (infoWindow.value)
      (infoWindow.value as any).on?.(event, handler)
  }

  function off(event: string, handler: (event: any) => void) {
    for (const listener of Array.from(listeners)) {
      if (listener.event === event && listener.handler === handler) {
        if (infoWindow.value)
          (infoWindow.value as any).off?.(event, handler)
        listeners.delete(listener)
      }
    }
  }

  function destroy() {
    const instance = infoWindow.value as any
    if (instance) {
      unbindListeners(instance)
      instance.close?.()
      instance.destroy?.()
    }
    infoWindow.value = null
    pendingOpen = false
    lastPosition = undefined
    currentMap.value = null
  }

  return {
    infoWindow,
    open,
    close,
    setPosition,
    setOffset,
    setAnchor,
    setIsCustom,
    setContent,
    setOptions,
    on,
    off,
    destroy,
  }
}
