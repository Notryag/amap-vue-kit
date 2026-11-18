import { loader } from '@amap-vue/shared'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useDistrictSearch } from '../src/useDistrictSearch'

type Callback = Parameters<AMap.DistrictSearch['search']>[1]

function mockPlugin() {
  const requests: { keyword: string, options: AMap.DistrictSearch.Options, respond: Callback }[] = []
  class DistrictSearch {
    constructor(private options: AMap.DistrictSearch.Options) {}

    search(keyword: string, respond: Callback) {
      requests.push({ keyword, options: this.options, respond })
    }
  }

  const load = vi.spyOn(loader, 'load').mockResolvedValue({
    ...AMap,
    DistrictSearch: DistrictSearch as unknown as typeof AMap.DistrictSearch,
  })
  return { load, requests }
}

afterEach(() => vi.restoreAllMocks())

describe('useDistrictSearch', () => {
  it('keeps options isolated across concurrent searches and returns boundaries and children', async () => {
    const { load, requests } = mockPlugin()
    const defaults = ref<AMap.DistrictSearch.Options>({ level: 'province', subdistrict: 1 })
    const { search } = useDistrictSearch(defaults)
    expect(load).not.toHaveBeenCalled()
    const first = search(' 110000 ', { extensions: 'all' })
    defaults.value = { subdistrict: 0 }
    const second = search('110101', { level: 'district', extensions: 'base' })

    await vi.waitFor(() => expect(requests).toHaveLength(2))
    expect(load).toHaveBeenCalledExactlyOnceWith({
      plugins: ['AMap.DistrictSearch'],
    })
    expect(requests[0]).toMatchObject({
      keyword: '110000',
      options: { level: 'province', subdistrict: 1, extensions: 'all' },
    })
    expect(requests[1]).toMatchObject({
      keyword: '110101',
      options: { level: 'district', subdistrict: 0, extensions: 'base' },
    })

    const result: AMap.DistrictSearch.Result = {
      info: 'OK',
      districtList: [
        {
          name: '北京市',
          adcode: '110000',
          level: 'province',
          boundaries: [
            [
              new AMap.LngLat(116.4, 39.9),
            ],
          ],
          districtList: [
            { name: '东城区', adcode: '110101', level: 'district' },
          ],
        },
      ],
    }
    requests[1].respond('no_data', 'NO_DATA')
    requests[0].respond('complete', result)
    await expect(first).resolves.toBe(result)
    await expect(second).resolves.toBeNull()
  })

  it('skips blank input and discards responses after destroy', async () => {
    const { load, requests } = mockPlugin()
    const { search, destroy } = useDistrictSearch()
    await expect(search(' ')).resolves.toBeNull()
    expect(load).not.toHaveBeenCalled()
    const pending = search()
    await vi.waitFor(() => expect(requests).toHaveLength(1))
    expect(requests[0].keyword).toBe('全国')
    destroy()
    requests[0].respond('complete', { info: 'OK', districtList: [] })
    await expect(pending).resolves.toBeNull()
  })
})
