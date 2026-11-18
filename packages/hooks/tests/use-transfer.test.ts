import { loader } from '@amap-vue/shared'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useTransfer } from '../src/useTransfer'

function mockPlugin() {
  const search = vi.fn<(...args: unknown[]) => void>()
  const clear = vi.fn()
  const options: AMap.TransferOptions[] = []

  class Transfer {
    constructor(settings: AMap.TransferOptions) {
      options.push(settings)
    }

    search = search
    clear = clear
  }

  const load = vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, Transfer })
  return { load, search, clear, options }
}

afterEach(() => vi.restoreAllMocks())

describe('useTransfer', () => {
  it('uses the appropriate SDK overload for coordinates and keywords', async () => {
    const mock = mockPlugin()
    const result: AMap.TransferResult = { info: 'OK', plans: [] }
    mock.search.mockImplementation((...args) => (args.at(-1) as AMap.TransferCallback)('complete', result))
    const api = useTransfer({ city: '北京市' })

    await expect(api.search([116.32, 39.90], [116.42, 39.90])).resolves.toBe(result)
    expect(mock.search).toHaveBeenNthCalledWith(1, new AMap.LngLat(116.32, 39.90), new AMap.LngLat(116.42, 39.90), expect.any(Function))
    await expect(api.search(' 北京西站 ', { keyword: '北京站', city: '010' })).resolves.toBe(result)
    expect(mock.search).toHaveBeenNthCalledWith(2, [
      { keyword: '北京西站' },
      { keyword: '北京站', city: '010' },
    ], expect.any(Function))
    await expect(api.search('北京西站', [116.42, 39.90])).resolves.toBeNull()
    expect(mock.search).toHaveBeenCalledTimes(2)
    expect(mock.load).toHaveBeenCalledExactlyOnceWith({
      plugins: ['AMap.Transfer'],
    })
  })

  it('ignores pending results after clear or a change of city', async () => {
    const mock = mockPlugin()
    const options = ref({ city: '北京市' })
    const api = useTransfer(options)

    const first = api.search('北京西站', '北京站')
    await vi.waitFor(() => expect(mock.search).toHaveBeenCalledTimes(1))
    api.clear()
    const result: AMap.TransferResult = { info: 'OK', plans: [] }
    ;(mock.search.mock.calls[0][1] as AMap.TransferCallback)('complete', result)
    await expect(first).resolves.toBeNull()

    options.value.city = '上海市'
    const second = api.search('上海站', '虹桥站')
    await vi.waitFor(() => expect(mock.search).toHaveBeenCalledTimes(2))
    ;(mock.search.mock.calls[1][1] as AMap.TransferCallback)('no_data', 'NO_DATA')
    await expect(second).resolves.toBeNull()
    expect(mock.options).toMatchObject([
      { city: '北京市' },
      { city: '上海市' },
    ])
    expect(mock.clear).toHaveBeenCalledTimes(2)
    api.destroy()
    expect(api.transfer.value).toBeNull()
  })
})
