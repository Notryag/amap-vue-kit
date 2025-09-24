import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toLngLat, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface UseGeocoderOptions extends Partial<AMap.GeocoderOptions> {
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseGeocoderReturn {
  geocoder: ShallowRef<AMap.Geocoder | null>
  getLocation: (address: string, city?: string) => Promise<AMap.GeocoderResult | null>
  getAddress: (position: AMap.LngLat | [number, number]) => Promise<AMap.GeocoderResult | null>
  setOptions: (options: Partial<AMap.GeocoderOptions>) => void
  destroy: () => void
}

export function useGeocoder(options: MaybeRefOrGetter<UseGeocoderOptions | undefined> = {}): UseGeocoderReturn {
  const geocoder = shallowRef<AMap.Geocoder | null>(null)
  const optionsRef = computed<UseGeocoderOptions>(() => ({
    ...(toValue(options) as UseGeocoderOptions | undefined ?? {}),
  }))

  let amap: typeof AMap | null = null
  let creating = false

  async function ensureGeocoder() {
    if (!isClient)
      return null
    if (geocoder.value)
      return geocoder.value
    if (creating)
      return geocoder.value
    creating = true
    try {
      const loaderOptions = optionsRef.value.loadOptions ? toValue(optionsRef.value.loadOptions) : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.Geocoder'] })
      amap = AMapInstance
      const instance = new (AMapInstance as any).Geocoder(optionsRef.value)
      geocoder.value = instance
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
    if (geocoder.value)
      geocoder.value.setOptions?.(rest)
  }, { deep: true })

  onBeforeUnmount(() => {
    destroy()
  })

  async function resolveLngLat(position: AMap.LngLat | [number, number]) {
    const AMapInstance = amap ?? await loader.load()
    amap = AMapInstance
    const resolved = toLngLat(AMapInstance, position)
    if (resolved)
      return resolved
    if (Array.isArray(position))
      return new AMapInstance.LngLat(position[0], position[1])
    return position
  }

  async function getLocation(address: string, city?: string): Promise<AMap.GeocoderResult | null> {
    if (!address)
      return null
    const instance = await ensureGeocoder()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.getLocation(address, (status: string, result: AMap.GeocoderResult) => {
        if (status === 'complete')
          resolve(result)
        else
          resolve(null)
      }, city)
    })
  }

  async function getAddress(position: AMap.LngLat | [number, number]): Promise<AMap.GeocoderResult | null> {
    const instance = await ensureGeocoder()
    if (!instance)
      return null
    const lngLat = await resolveLngLat(position)
    return new Promise((resolve) => {
      instance.getAddress(lngLat, (status: string, result: AMap.GeocoderResult) => {
        if (status === 'complete')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  function setOptions(next: Partial<AMap.GeocoderOptions>) {
    if (!next)
      return
    geocoder.value?.setOptions?.(next)
  }

  function destroy() {
    geocoder.value = null
  }

  return {
    geocoder,
    getLocation,
    getAddress,
    setOptions,
    destroy,
  }
}
