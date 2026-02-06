import type { LngLatLike, LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toLngLat, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export type RidingEndpoint = LngLatLike | string

export interface UseRidingOptions extends Partial<AMap.RidingOptions> {
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseRidingReturn {
  riding: ShallowRef<AMap.Riding | null>
  search: (origin: RidingEndpoint, destination: RidingEndpoint) => Promise<AMap.RidingResult | null>
  setOptions: (options: Partial<AMap.RidingOptions>) => void
  setMap: (map: AMap.Map | null | undefined) => void
  clear: () => void
  destroy: () => void
}

export function useRiding(options: MaybeRefOrGetter<UseRidingOptions | undefined> = {}): UseRidingReturn {
  const riding = shallowRef<AMap.Riding | null>(null)
  const optionsRef = computed<UseRidingOptions>(() => ({
    ...(toValue(options) as UseRidingOptions | undefined ?? {}),
  }))

  let amap: typeof AMap | null = null
  let creating = false

  async function ensureRiding() {
    if (!isClient)
      return null
    if (riding.value)
      return riding.value
    if (creating)
      return riding.value

    creating = true
    try {
      const { loadOptions: loadOptionsMaybe, map: mapMaybe, ...rest } = optionsRef.value
      const loaderOptions = loadOptionsMaybe ? toValue(loadOptionsMaybe) : undefined
      const mapInstance = mapMaybe !== undefined ? toValue(mapMaybe) ?? null : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.Riding'] })
      amap = AMapInstance
      const instance = new (AMapInstance as any).Riding({
        ...rest,
        map: mapInstance ?? undefined,
      })
      riding.value = instance
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

  function normalizeEndpoint(AMapInstance: typeof AMap, value: RidingEndpoint) {
    if (typeof value === 'string')
      return value
    return toLngLat(AMapInstance, value) ?? value
  }

  watch(optionsRef, (value) => {
    if (!riding.value)
      return
    const { loadOptions: _loadOptions, map: mapMaybe, ...rest } = value
    if (mapMaybe !== undefined)
      riding.value.setMap?.(toValue(mapMaybe) ?? null)
    riding.value.setOptions?.(rest)
  }, { deep: true })

  onBeforeUnmount(() => {
    destroy()
  })

  async function search(origin: RidingEndpoint, destination: RidingEndpoint): Promise<AMap.RidingResult | null> {
    const instance = await ensureRiding()
    if (!instance)
      return null
    const AMapInstance = amap ?? await loader.load()
    amap = AMapInstance
    const originValue = normalizeEndpoint(AMapInstance, origin)
    const destinationValue = normalizeEndpoint(AMapInstance, destination)
    return new Promise((resolve) => {
      instance.search(originValue as any, destinationValue as any, (status: string, result: AMap.RidingResult) => {
        if (status === 'complete')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  function setOptions(next: Partial<AMap.RidingOptions>) {
    if (!next)
      return
    riding.value?.setOptions?.(next)
  }

  function setMap(map: AMap.Map | null | undefined) {
    riding.value?.setMap?.(map ?? null)
  }

  function clear() {
    riding.value?.clear?.()
  }

  function destroy() {
    clear()
    riding.value?.setMap?.(null)
    riding.value = null
  }

  return {
    riding,
    search,
    setOptions,
    setMap,
    clear,
    destroy,
  }
}
