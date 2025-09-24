import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface UseGeolocationOptions extends Partial<AMap.GeolocationOptions> {
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseGeolocationReturn {
  geolocation: ShallowRef<AMap.Geolocation | null>
  getCurrentPosition: () => Promise<AMap.GeolocationResult | null>
  watchPosition: (handler: (result: AMap.GeolocationResult) => void) => Promise<number | null>
  clearWatch: (watchId?: number) => void
  getCityInfo: () => Promise<AMap.GeolocationCityInfo | null>
  setOptions: (options: Partial<AMap.GeolocationOptions>) => void
  destroy: () => void
}

export function useGeolocation(options: MaybeRefOrGetter<UseGeolocationOptions | undefined> = {}): UseGeolocationReturn {
  const geolocation = shallowRef<AMap.Geolocation | null>(null)
  const activeWatchers = new Set<number>()
  const optionsRef = computed<UseGeolocationOptions>(() => ({
    ...(toValue(options) as UseGeolocationOptions | undefined ?? {}),
  }))

  let creating = false

  async function ensureGeolocation() {
    if (!isClient)
      return null
    if (geolocation.value)
      return geolocation.value
    if (creating)
      return geolocation.value
    creating = true
    try {
      const loaderOptions = optionsRef.value.loadOptions ? toValue(optionsRef.value.loadOptions) : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.Geolocation'] })
      const instance = new (AMapInstance as any).Geolocation(optionsRef.value)
      geolocation.value = instance
      return instance
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
      return null
    }
    finally {
      creating = false
    }
  }

  watch(optionsRef, (value) => {
    const { loadOptions: _loadOptions, ...rest } = value
    if (geolocation.value)
      geolocation.value.setOptions?.(rest)
  }, { deep: true })

  onBeforeUnmount(() => {
    destroy()
  })

  async function getCurrentPosition(): Promise<AMap.GeolocationResult | null> {
    const instance = await ensureGeolocation()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.getCurrentPosition((status: string, result: AMap.GeolocationResult) => {
        if (status === 'complete')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  async function watchPosition(handler: (result: AMap.GeolocationResult) => void): Promise<number | null> {
    const instance = await ensureGeolocation()
    if (!instance)
      return null
    const watchId = instance.watchPosition((status: string, result: AMap.GeolocationResult) => {
      if (status === 'complete')
        handler(result)
    })
    if (typeof watchId === 'number')
      activeWatchers.add(watchId)
    return typeof watchId === 'number' ? watchId : null
  }

  function clearWatch(watchId?: number) {
    if (!geolocation.value)
      return
    if (typeof watchId === 'number') {
      geolocation.value.clearWatch(watchId)
      activeWatchers.delete(watchId)
      return
    }
    activeWatchers.forEach(id => geolocation.value?.clearWatch(id))
    activeWatchers.clear()
  }

  async function getCityInfo(): Promise<AMap.GeolocationCityInfo | null> {
    const instance = await ensureGeolocation()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.getCityInfo((status: string, result: AMap.GeolocationCityInfo) => {
        if (status === 'complete')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  function setOptions(next: Partial<AMap.GeolocationOptions>) {
    if (!next)
      return
    geolocation.value?.setOptions?.(next)
  }

  function destroy() {
    clearWatch()
    geolocation.value = null
  }

  return {
    geolocation,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    getCityInfo,
    setOptions,
    destroy,
  }
}
