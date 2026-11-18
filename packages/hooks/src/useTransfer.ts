import type { LngLatLike, LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import { toLngLat } from '@amap-vue/shared'
import { shallowRef, toValue, watch } from 'vue'
import { tryOnBeforeUnmount } from './lifecycle'
import { useServiceInstance } from './service-instance'

export type TransferEndpoint = LngLatLike | string | AMap.TransferKeyword

export interface UseTransferOptions extends AMap.TransferOptions {
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

function normalizeEndpoint(amap: typeof AMap, endpoint: TransferEndpoint) {
  if (typeof endpoint === 'string') {
    return endpoint.trim()
      ? {
          keyword: endpoint.trim(),
        }
      : null
  }
  if ('keyword' in endpoint) {
    return endpoint.keyword.trim()
      ? {
          ...endpoint,
          keyword: endpoint.keyword.trim(),
        }
      : null
  }
  return toLngLat(amap, endpoint)
}

/** Query the official public transit plugin without attaching its default overlays. */
export function useTransfer(options: MaybeRefOrGetter<UseTransferOptions | undefined> = {}) {
  const transfer = shallowRef<AMap.Transfer | null>(null)
  let amap: typeof AMap | undefined
  let generation = 0

  function getOptions(): AMap.TransferOptions {
    const { loadOptions: _loadOptions, ...settings } = toValue(options) ?? {}
    return settings
  }

  const { ensure, invalidate } = useServiceInstance(transfer, 'AMap.Transfer', () => toValue(toValue(options)?.loadOptions), (sdk) => {
    amap = sdk
    return new sdk.Transfer(getOptions())
  })

  /** Use coordinates for both endpoints, or keywords for both endpoints. */
  async function search(origin: TransferEndpoint, destination: TransferEndpoint) {
    const current = generation
    const instance = await ensure()
    if (!instance || !amap || current !== generation)
      return null

    const start = normalizeEndpoint(amap, origin)
    const end = normalizeEndpoint(amap, destination)
    if (!start || !end)
      return null

    return new Promise<AMap.TransferResult | null>((resolve) => {
      const complete: AMap.TransferCallback = (status, result) => {
        resolve(current === generation && status === 'complete' && typeof result !== 'string'
          ? result
          : null)
      }

      if ('keyword' in start && 'keyword' in end)
        instance.search([start, end], complete)
      else if (!('keyword' in start) && !('keyword' in end))
        instance.search(start, end, complete)
      else
        resolve(null)
    })
  }

  function clear() {
    generation++
    transfer.value?.clear()
  }

  function destroy() {
    clear()
    invalidate()
    transfer.value = null
    amap = undefined
  }

  watch([
    () => toValue(options)?.city,
    () => toValue(options)?.cityd,
    () => toValue(options)?.policy,
    () => toValue(options)?.nightflag,
  ], destroy, { flush: 'sync' })
  tryOnBeforeUnmount(destroy)
  return { transfer, search, clear, destroy }
}
