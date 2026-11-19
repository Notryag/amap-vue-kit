import type { FlexibleCreateTile } from '../src/useFlexibleLayer'
import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import { useFlexibleLayer } from '../src/useFlexibleLayer'

afterEach(() => vi.restoreAllMocks())

describe('useFlexibleLayer', () => {
  it('rechecks tile callbacks after reload and ignores late completions on detach', async () => {
    class Flexible extends AMap.TileLayer {
      setZooms = vi.fn()

      constructor(readonly settings: AMap.TileLayer.FlexibleOptions) {
        super(settings)
      }
    }

    vi.spyOn(loader, 'load').mockResolvedValue({
      ...AMap,
      TileLayer: Object.assign(class extends AMap.TileLayer {}, AMap.TileLayer, { Flexible }),
    })
    const map = new AMap.Map(document.createElement('div'))
    const canvas = document.createElement('canvas')
    const generate = vi.fn<FlexibleCreateTile>()
    const createTile = shallowRef(generate)
    let api!: ReturnType<typeof useFlexibleLayer>
    const wrapper = mount(defineComponent({
      setup() {
        api = useFlexibleLayer(map, () => ({ createTile: createTile.value }))
        return () => null
      },
    }))

    await vi.waitFor(() => expect(api.overlay.value).toBeInstanceOf(Flexible))
    const layer = api.overlay.value as Flexible
    const attached = vi.spyOn(layer, 'setMap')
    const reload = vi.spyOn(layer, 'reload')
    const success = vi.fn()
    const fail = vi.fn()
    layer.settings.createTile(5, 6, 7, success, fail)
    const [x, y, z, complete] = generate.mock.calls[0]
    expect([x, y, z]).toEqual([5, 6, 7])
    api.reload()
    complete(canvas)
    expect(success).not.toHaveBeenCalled()
    expect(reload).toHaveBeenCalledTimes(1)

    const next = vi.fn<FlexibleCreateTile>()
    next.mockImplementationOnce((_x, _y, _z, complete, fail) => {
      complete(canvas)
      fail()
      complete(canvas)
    })
    createTile.value = next
    await nextTick()
    expect(reload).toHaveBeenCalledTimes(2)
    layer.settings.createTile(8, 9, 10, success, fail)
    expect(success).toHaveBeenCalledExactlyOnceWith(canvas)
    expect(fail).not.toHaveBeenCalled()

    next.mockRejectedValueOnce(new Error('Tile unavailable'))
    layer.settings.createTile(8, 9, 10, success, fail)
    await vi.waitFor(() => expect(fail).toHaveBeenCalledTimes(1))
    layer.settings.createTile(8, 9, 10, success, fail)
    wrapper.unmount()
    next.mock.calls.at(-1)![3](canvas)
    expect(attached).toHaveBeenLastCalledWith(null)
    expect(api.overlay.value).toBeNull()
    expect(success).toHaveBeenCalledTimes(1)
  })
})
