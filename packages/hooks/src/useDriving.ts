import type { LngLatLike, LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toLngLat, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export type DrivingEndpoint = LngLatLike | string

type DrivingOptions = AMap.Driving.Options
type DrivingResult = AMap.Driving.SearchResult

export interface UseDrivingOptions extends Omit<Partial<DrivingOptions>, 'map'> {
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseDrivingReturn {
  driving: ShallowRef<AMap.Driving | null>
  search: (
    origin: DrivingEndpoint,
    destination: DrivingEndpoint,
    options?: Record<string, any>,
  ) => Promise<DrivingResult | null>
  setOptions: (options: Partial<DrivingOptions>) => void
  setMap: (map: AMap.Map | null | undefined) => void
  clear: () => void
  destroy: () => void
}

export function useDriving(options: MaybeRefOrGetter<UseDrivingOptions | undefined> = {}): UseDrivingReturn {
  const driving = shallowRef<AMap.Driving | null>(null)
  const optionsRef = computed<UseDrivingOptions>(() => ({
    ...(toValue(options) as UseDrivingOptions | undefined ?? {}),
  }))

  let amap: typeof AMap | null = null
  let creating = false

  async function ensureDriving() {
    if (!isClient)
      return null
    if (driving.value)
      return driving.value
    if (creating)
      return driving.value

    creating = true
    try {
      const { loadOptions: loadOptionsMaybe, map: mapMaybe, ...rest } = optionsRef.value
      const loaderOptions = loadOptionsMaybe ? toValue(loadOptionsMaybe) : undefined
      const mapInstance = mapMaybe !== undefined ? toValue(mapMaybe) ?? null : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.Driving'] })
      amap = AMapInstance
      const instance = new (AMapInstance as any).Driving({
        ...rest,
        map: mapInstance ?? undefined,
      })
      driving.value = instance
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

  function normalizeEndpoint(AMapInstance: typeof AMap, value: DrivingEndpoint) {
    if (typeof value === 'string')
      return value
    return toLngLat(AMapInstance, value) ?? value
  }

  watch(optionsRef, (value) => {
    if (!driving.value)
      return
    const { loadOptions: _loadOptions, map: mapMaybe, ...rest } = value
    if (mapMaybe !== undefined)
      (driving.value as any).setMap?.(toValue(mapMaybe) ?? null)
    (driving.value as any).setOptions?.(rest)
  }, { deep: true })

  onBeforeUnmount(() => {
    destroy()
  })

  async function search(
    origin: DrivingEndpoint,
    destination: DrivingEndpoint,
    searchOptions?: Record<string, any>,
  ): Promise<DrivingResult | null> {
    const instance = await ensureDriving()
    if (!instance)
      return null
    const AMapInstance = amap ?? await loader.load()
    amap = AMapInstance
    const originValue = normalizeEndpoint(AMapInstance, origin)
    const destinationValue = normalizeEndpoint(AMapInstance, destination)
    return new Promise((resolve) => {
      const callback = (status: AMap.Driving.SearchStatus, result: string | DrivingResult) => {
        if (status === 'complete' && typeof result !== 'string')
          resolve(result)
        else
          resolve(null)
      }
      if (searchOptions)
        instance.search(originValue as any, destinationValue as any, searchOptions, callback)
      else
        instance.search(originValue as any, destinationValue as any, callback)
    })
  }

  function setOptions(next: Partial<DrivingOptions>) {
    if (!next)
      return
    const instance = driving.value as any
    instance?.setOptions?.(next)
  }

  function setMap(map: AMap.Map | null | undefined) {
    const instance = driving.value as any
    instance?.setMap?.(map ?? null)
  }

  function clear() {
    driving.value?.clear?.()
  }

  function destroy() {
    clear()
    const instance = driving.value as any
    instance?.setMap?.(null)
    driving.value = null
  }

  return {
    driving,
    search,
    setOptions,
    setMap,
    clear,
    destroy,
  }
}
