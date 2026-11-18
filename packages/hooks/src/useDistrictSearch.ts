import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import { shallowRef, toValue } from 'vue'
import { tryOnBeforeUnmount } from './lifecycle'
import { useServiceInstance } from './service-instance'

export interface UseDistrictSearchOptions extends AMap.DistrictSearch.Options {
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseDistrictSearchReturn {
  /** Search by name, city code or adcode. Defaults to 全国. */
  search: (keyword?: string, options?: AMap.DistrictSearch.Options) => Promise<AMap.DistrictSearch.Result | null>
  /** Invalidate pending searches and release the cached service factory. */
  destroy: () => void
}

/** Query administrative divisions independently of a map instance. */
export function useDistrictSearch(
  options: MaybeRefOrGetter<UseDistrictSearchOptions | undefined> = {},
): UseDistrictSearchReturn {
  const factory = shallowRef<((options: AMap.DistrictSearch.Options) => AMap.DistrictSearch) | null>(null)
  const { ensure, invalidate } = useServiceInstance(
    factory,
    'AMap.DistrictSearch',
    () => toValue(toValue(options)?.loadOptions),
    amap => options => new amap.DistrictSearch(options),
  )
  let generation = 0

  async function search(keyword = '全国', overrides?: AMap.DistrictSearch.Options) {
    const query = keyword.trim()
    if (!query)
      return null

    const current = generation
    const { loadOptions: _loadOptions, ...defaults } = toValue(options) ?? {}
    const create = await ensure()
    if (!create || current !== generation)
      return null

    return new Promise<AMap.DistrictSearch.Result | null>((resolve) => {
      const service = create({
        ...defaults,
        ...overrides,
      })
      service.search(query, (status, result) => {
        resolve(current === generation && status === 'complete' && typeof result !== 'string'
          ? result
          : null)
      })
    })
  }

  function destroy() {
    generation++
    invalidate()
    factory.value = null
  }

  tryOnBeforeUnmount(destroy)
  return { search, destroy }
}
