import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { isClient, loader, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface OverlayLifecycle<TOverlay> {
  overlay: ShallowRef<TOverlay | null>
  destroy: () => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
}

export type OverlayFactory<TOverlay, TOptions> = (context: { AMap: typeof AMap, map: AMap.Map, options: TOptions }) => TOverlay
export type OverlayUpdater<TOverlay, TOptions> = (overlay: TOverlay, options: TOptions) => void

export function useOverlay<TOverlay extends { setMap: (map: AMap.Map | null) => void }, TOptions extends Record<string, any>>(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<TOptions>,
  factory: OverlayFactory<TOverlay, TOptions>,
  updater?: OverlayUpdater<TOverlay, TOptions>,
): OverlayLifecycle<TOverlay> {
  const overlay = shallowRef<TOverlay | null>(null)
  const listeners = new Set<{ event: string, handler: (event: any) => void }>()
  const optionsRef = computed<TOptions>(() => ({
    ...(toValue(options) as TOptions | undefined ?? {}),
  }) as TOptions)

  async function ensureOverlay(mapInstance: AMap.Map | null | undefined) {
    if (!isClient || overlay.value || !mapInstance)
      return

    try {
      const AMap = await loader.load()
      const instance = factory({ AMap, map: mapInstance, options: optionsRef.value })
      overlay.value = instance
      bindListeners(instance)
      updater?.(instance, optionsRef.value)
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
    }
  }

  function bindListeners(instance: TOverlay) {
    for (const listener of listeners)
      (instance as any).on?.(listener.event, listener.handler)
  }

  function unbindListeners(instance: TOverlay) {
    for (const listener of listeners)
      (instance as any).off?.(listener.event, listener.handler)
  }

  watch(() => toValue(mapRef), (mapInstance) => {
    if (!mapInstance) {
      overlay.value?.setMap(null)
      return
    }

    if (overlay.value)
      overlay.value.setMap(mapInstance)
    else
      ensureOverlay(mapInstance)
  }, { immediate: true })

  if (updater) {
    watch(optionsRef, (value) => {
      if (overlay.value)
        updater(overlay.value, value)
    }, { deep: true })
  }

  onBeforeUnmount(() => {
    destroy()
  })

  function on(event: string, handler: (event: any) => void) {
    const record = { event, handler }
    listeners.add(record)
    if (overlay.value)
      (overlay.value as any).on?.(event, handler)
  }

  function off(event: string, handler: (event: any) => void) {
    for (const listener of Array.from(listeners)) {
      if (listener.event === event && listener.handler === handler) {
        if (overlay.value)
          (overlay.value as any).off?.(event, handler)
        listeners.delete(listener)
      }
    }
  }

  function destroy() {
    const instance = overlay.value as any
    if (instance) {
      unbindListeners(instance)
      instance.setMap?.(null)
      instance.destroy?.()
    }
    overlay.value = null
  }

  return {
    overlay,
    destroy,
    on,
    off,
  }
}
