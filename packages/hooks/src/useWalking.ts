import type { LngLatLike, LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toLngLat, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export type WalkingEndpoint = LngLatLike | string

export interface UseWalkingOptions extends Partial<AMap.WalkingOptions> {
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseWalkingReturn {
  walking: ShallowRef<AMap.Walking | null>
  search: (origin: WalkingEndpoint, destination: WalkingEndpoint) => Promise<AMap.WalkingResult | null>
  setOptions: (options: Partial<AMap.WalkingOptions>) => void
  setMap: (map: AMap.Map | null | undefined) => void
  clear: () => void
  destroy: () => void
}

export function useWalking(options: MaybeRefOrGetter<UseWalkingOptions | undefined> = {}): UseWalkingReturn {
  const walking = shallowRef<AMap.Walking | null>(null)
  const optionsRef = computed<UseWalkingOptions>(() => ({
    ...(toValue(options) as UseWalkingOptions | undefined ?? {}),
  }))

  let amap: typeof AMap | null = null
  let creating = false

  async function ensureWalking() {
    if (!isClient)
      return null
    if (walking.value)
      return walking.value
    if (creating)
      return walking.value

    creating = true
    try {
      const { loadOptions: loadOptionsMaybe, map: mapMaybe, ...rest } = optionsRef.value
      const loaderOptions = loadOptionsMaybe ? toValue(loadOptionsMaybe) : undefined
      const mapInstance = mapMaybe !== undefined ? toValue(mapMaybe) ?? null : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.Walking'] })
      amap = AMapInstance
      const instance = new (AMapInstance as any).Walking({
        ...rest,
        map: mapInstance ?? undefined,
      })
      walking.value = instance
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

  function normalizeEndpoint(AMapInstance: typeof AMap, value: WalkingEndpoint) {
    if (typeof value === 'string')
      return value
    return toLngLat(AMapInstance, value) ?? value
  }

  watch(optionsRef, (value) => {
    if (!walking.value)
      return
    const { loadOptions: _loadOptions, map: mapMaybe, ...rest } = value
    if (mapMaybe !== undefined)
      walking.value.setMap?.(toValue(mapMaybe) ?? null)
    walking.value.setOptions?.(rest)
  }, { deep: true })

  onBeforeUnmount(() => {
    destroy()
  })

  async function search(origin: WalkingEndpoint, destination: WalkingEndpoint): Promise<AMap.WalkingResult | null> {
    const instance = await ensureWalking()
    if (!instance)
      return null
    const AMapInstance = amap ?? await loader.load()
    amap = AMapInstance
    const originValue = normalizeEndpoint(AMapInstance, origin)
    const destinationValue = normalizeEndpoint(AMapInstance, destination)
    return new Promise((resolve) => {
      instance.search(originValue as any, destinationValue as any, (status: string, result: AMap.WalkingResult) => {
        if (status === 'complete')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  function setOptions(next: Partial<AMap.WalkingOptions>) {
    if (!next)
      return
    walking.value?.setOptions?.(next)
  }

  function setMap(map: AMap.Map | null | undefined) {
    walking.value?.setMap?.(map ?? null)
  }

  function clear() {
    walking.value?.clear?.()
  }

  function destroy() {
    clear()
    walking.value?.setMap?.(null)
    walking.value = null
  }

  return {
    walking,
    search,
    setOptions,
    setMap,
    clear,
    destroy,
  }
}
