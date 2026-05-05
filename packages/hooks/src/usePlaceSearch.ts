import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toBounds, toLngLat, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

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

  let creating = false

  async function ensurePlaceSearch() {
    if (!isClient)
      return null
    if (placeSearch.value)
      return placeSearch.value
    if (creating)
      return placeSearch.value

    creating = true
    try {
      const { loadOptions: loadOptionsMaybe, map: mapMaybe, ...rest } = optionsRef.value
      const loaderOptions = loadOptionsMaybe ? toValue(loadOptionsMaybe) : undefined
      const mapInstance = mapMaybe !== undefined ? toValue(mapMaybe) ?? null : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.PlaceSearch'] })
      const instance = new (AMapInstance as any).PlaceSearch({
        ...rest,
        map: mapInstance ?? undefined,
      })
      placeSearch.value = instance
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

  onBeforeUnmount(() => {
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
