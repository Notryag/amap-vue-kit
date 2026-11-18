import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { computed, shallowRef, toValue, watch } from 'vue'
import { tryOnBeforeUnmount } from './lifecycle'
import { useServiceInstance } from './service-instance'

type GeolocationOptions = AMap.Geolocation.Options
type GeolocationResult = AMap.Geolocation.GeolocationResult
type GeolocationWatchId = number

export interface UseGeolocationOptions extends Partial<GeolocationOptions> {
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseGeolocationReturn {
  geolocation: ShallowRef<AMap.Geolocation | null>
  getCurrentPosition: () => Promise<GeolocationResult | null>
  watchPosition: (handler: (result: GeolocationResult) => void) => Promise<GeolocationWatchId | null>
  clearWatch: (watchId?: GeolocationWatchId) => void
  getCityInfo: () => Promise<AMap.Geolocation.CityResult | null>
  setOptions: (options: Partial<GeolocationOptions>) => void
  destroy: () => void
}

export function useGeolocation(options: MaybeRefOrGetter<UseGeolocationOptions | undefined> = {}): UseGeolocationReturn {
  const geolocation = shallowRef<AMap.Geolocation | null>(null)
  const activeWatchers = new Set<GeolocationWatchId>()
  const optionsRef = computed<UseGeolocationOptions>(() => ({
    ...(toValue(options) as UseGeolocationOptions | undefined ?? {}),
  }))

  const { ensure: ensureGeolocation, invalidate } = useServiceInstance(
    geolocation,
    'AMap.Geolocation',
    () => optionsRef.value.loadOptions
      ? toValue(optionsRef.value.loadOptions)
      : undefined,
    (AMapInstance) => {
      const { loadOptions: _loadOptions, ...rest } = optionsRef.value
      return new AMapInstance.Geolocation(rest)
    },
  )

  watch(optionsRef, (value) => {
    const { loadOptions: _loadOptions, ...rest } = value
    if (geolocation.value)
      (geolocation.value as any).setOptions?.(rest)
  }, { deep: true })

  tryOnBeforeUnmount(() => {
    destroy()
  })

  async function getCurrentPosition(): Promise<GeolocationResult | null> {
    const instance = await ensureGeolocation()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.getCurrentPosition((status: AMap.Geolocation.SearchStatus, result: GeolocationResult | AMap.Geolocation.ErrorStatus) => {
        if (status === 'complete')
          resolve(result as GeolocationResult)
        else
          resolve(null)
      })
    })
  }

  async function watchPosition(handler: (result: GeolocationResult) => void): Promise<GeolocationWatchId | null> {
    const instance = await ensureGeolocation()
    if (!instance)
      return null
    const watchId = (instance as any).watchPosition((status: string, result: GeolocationResult) => {
      if (status === 'complete')
        handler(result)
    })
    if (typeof watchId === 'number')
      activeWatchers.add(watchId)
    return typeof watchId === 'number'
      ? watchId
      : null
  }

  function clearWatch(watchId?: GeolocationWatchId) {
    if (!geolocation.value)
      return
    if (typeof watchId === 'number') {
      geolocation.value.clearWatch(watchId as any)
      activeWatchers.delete(watchId)
      return
    }
    activeWatchers.forEach(id => geolocation.value?.clearWatch(id as any))
    activeWatchers.clear()
  }

  async function getCityInfo(): Promise<AMap.Geolocation.CityResult | null> {
    const instance = await ensureGeolocation()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.getCityInfo((status: AMap.Geolocation.SearchStatus, result: AMap.Geolocation.CityResult | AMap.Geolocation.ErrorStatus) => {
        if (status === 'complete')
          resolve(result as AMap.Geolocation.CityResult)
        else
          resolve(null)
      })
    })
  }

  function setOptions(next: Partial<GeolocationOptions>) {
    if (!next)
      return
    (geolocation.value as any)?.setOptions?.(next)
  }

  function destroy() {
    invalidate()
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
