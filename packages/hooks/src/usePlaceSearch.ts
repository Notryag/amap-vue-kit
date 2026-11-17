import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { loader, toBounds, toLngLat } from '@amap-vue/shared'
import { computed, shallowRef, toValue, watch } from 'vue'
import { tryOnBeforeUnmount } from './lifecycle'
import { useServiceInstance } from './service-instance'

type PlaceSearchOptions = AMap.PlaceSearch.Options
type PlaceSearchResult = AMap.PlaceSearch.SearchResult

export interface UsePlaceSearchOptions extends Omit<Partial<PlaceSearchOptions>, 'map'> {
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UsePlaceSearchReturn {
  placeSearch: ShallowRef<AMap.PlaceSearch | null>
  search: (keyword: string) => Promise<PlaceSearchResult | null>
  searchNearBy: (
    keyword: string,
    center: AMap.LngLat | [number, number],
    radius: number,
  ) => Promise<PlaceSearchResult | null>
  searchInBounds: (
    keyword: string,
    bounds: AMap.Bounds | [AMap.LngLat | [number, number], AMap.LngLat | [number, number]],
  ) => Promise<PlaceSearchResult | null>
  getDetails: (poiId: string) => Promise<PlaceSearchResult | null>
  setOptions: (options: Partial<PlaceSearchOptions>) => void
  setCity: (city: string) => void
  setType: (type: string) => void
  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
  setMap: (map: AMap.Map | null | undefined) => void
  clear: () => void
  destroy: () => void
}

export function usePlaceSearch(
  options: MaybeRefOrGetter<UsePlaceSearchOptions | undefined> = {},
): UsePlaceSearchReturn {
  const placeSearch = shallowRef<AMap.PlaceSearch | null>(null)
  const optionsRef = computed<UsePlaceSearchOptions>(() => ({
    ...(toValue(options) as UsePlaceSearchOptions | undefined ?? {}),
  }))

  const { ensure: ensurePlaceSearch, invalidate } = useServiceInstance(
    placeSearch,
    'AMap.PlaceSearch',
    () => optionsRef.value.loadOptions ? toValue(optionsRef.value.loadOptions) : undefined,
    (AMapInstance) => {
      const { loadOptions: _loadOptions, map: mapMaybe, ...rest } = optionsRef.value
      const map = mapMaybe !== undefined ? toValue(mapMaybe) ?? undefined : undefined
      return new AMapInstance.PlaceSearch({ ...rest, map })
    },
  )

  function applyOptions(instance: AMap.PlaceSearch, next: Partial<PlaceSearchOptions>) {
    if ('city' in next && next.city != null)
      instance.setCity?.(next.city)
    if ('type' in next && next.type != null)
      instance.setType?.(next.type)
    if ('pageIndex' in next && next.pageIndex != null)
      instance.setPageIndex?.(next.pageIndex)
    if ('pageSize' in next && next.pageSize != null)
      instance.setPageSize?.(next.pageSize)

    const clone = { ...next }
    delete clone.city
    delete clone.type
    delete clone.pageIndex
    delete clone.pageSize
    delete (clone as Partial<PlaceSearchOptions>).map

    if (Object.keys(clone).length)
      (instance as any).setOptions?.(clone)
  }

  watch(optionsRef, (value) => {
    if (!placeSearch.value)
      return
    const { loadOptions: _loadOptions, map: mapMaybe, ...rest } = value
    if (mapMaybe !== undefined)
      (placeSearch.value as any).setMap?.(toValue(mapMaybe) ?? null)
    applyOptions(placeSearch.value, rest)
  }, { deep: true })

  tryOnBeforeUnmount(() => {
    destroy()
  })

  async function search(keyword: string): Promise<PlaceSearchResult | null> {
    const query = keyword?.trim()
    if (!query)
      return null
    const instance = await ensurePlaceSearch()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.search(query, (status: AMap.PlaceSearch.SearchStatus, result: string | PlaceSearchResult) => {
        if ((status === 'complete' || status === 'no_data') && typeof result !== 'string')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  async function searchNearBy(
    keyword: string,
    center: AMap.LngLat | [number, number],
    radius: number,
  ): Promise<PlaceSearchResult | null> {
    const query = keyword?.trim()
    if (!query)
      return null
    const instance = await ensurePlaceSearch()
    if (!instance)
      return null
    const mapInstance = loader.get()
    const location = mapInstance ? toLngLat(mapInstance, center) ?? center : center
    return new Promise((resolve) => {
      instance.searchNearBy(query, location as any, radius, (status: AMap.PlaceSearch.SearchStatus, result: string | PlaceSearchResult) => {
        if ((status === 'complete' || status === 'no_data') && typeof result !== 'string')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  async function searchInBounds(
    keyword: string,
    bounds: AMap.Bounds | [AMap.LngLat | [number, number], AMap.LngLat | [number, number]],
  ): Promise<PlaceSearchResult | null> {
    const query = keyword?.trim()
    if (!query)
      return null
    const instance = await ensurePlaceSearch()
    if (!instance)
      return null
    const mapInstance = loader.get()
    const area = mapInstance ? toBounds(mapInstance, bounds) ?? bounds : bounds
    return new Promise((resolve) => {
      instance.searchInBounds(query, area as any, (status: AMap.PlaceSearch.SearchStatus, result: string | PlaceSearchResult) => {
        if ((status === 'complete' || status === 'no_data') && typeof result !== 'string')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  async function getDetails(poiId: string): Promise<PlaceSearchResult | null> {
    const id = poiId?.trim()
    if (!id)
      return null
    const instance = await ensurePlaceSearch()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.getDetails(id, (status: AMap.PlaceSearch.SearchStatus, result: string | PlaceSearchResult) => {
        if ((status === 'complete' || status === 'no_data') && typeof result !== 'string')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  function setOptions(options: Partial<PlaceSearchOptions>) {
    if (!options)
      return
    const instance = placeSearch.value
    if (!instance)
      return
    applyOptions(instance, options)
  }

  function setCity(city: string) {
    placeSearch.value?.setCity?.(city)
  }

  function setType(type: string) {
    placeSearch.value?.setType?.(type)
  }

  function setPageIndex(pageIndex: number) {
    placeSearch.value?.setPageIndex?.(pageIndex)
  }

  function setPageSize(pageSize: number) {
    placeSearch.value?.setPageSize?.(pageSize)
  }

  function setMap(map: AMap.Map | null | undefined) {
    const instance = placeSearch.value as any
    instance?.setMap?.(map ?? null)
  }

  function clear() {
    placeSearch.value?.clear?.()
  }

  function destroy() {
    invalidate()
    placeSearch.value?.clear?.()
    const instance = placeSearch.value as any
    instance?.setMap?.(null)
    placeSearch.value = null
  }

  return {
    placeSearch,
    search,
    searchNearBy,
    searchInBounds,
    getDetails,
    setOptions,
    setCity,
    setType,
    setPageIndex,
    setPageSize,
    setMap,
    clear,
    destroy,
  }
}
