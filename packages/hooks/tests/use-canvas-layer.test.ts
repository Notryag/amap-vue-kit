import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, shallowRef } from 'vue'
import { useCanvasLayer } from '../src/useCanvasLayer'

afterEach(() => vi.restoreAllMocks())

describe('useCanvasLayer', () => {
  it('waits for a canvas, updates its extent and source, then detaches and destroys the layer', async () => {
    class CanvasLayer extends AMap.TileLayer {
      setCanvas = vi.fn()
      setBounds = vi.fn()
      setZooms = vi.fn()
      getElement = vi.fn()
      getBounds = vi.fn()
      reFresh = vi.fn()

      constructor(options: AMap.CanvasLayerOptions) {
        super(options)
        this.setCanvas(options.canvas)
        this.setBounds(options.bounds)
      }
    }

    const load = vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, CanvasLayer })
    const map = new AMap.Map(document.createElement('div'))
    const add = vi.spyOn(map, 'add')
    const remove = vi.spyOn(map, 'remove')
    const canvas = shallowRef<HTMLCanvasElement | null>(null)
    const bounds = ref<[number, number, number, number]>([116.38, 39.90, 116.415, 39.923])
    let api!: ReturnType<typeof useCanvasLayer>
    const wrapper = mount(defineComponent({
      setup() {
        api = useCanvasLayer(map, () => ({ canvas: canvas.value, bounds: bounds.value }))
        return () => null
      },
    }))

    expect(load).not.toHaveBeenCalled()
    canvas.value = document.createElement('canvas')
    await vi.waitFor(() => expect(api.overlay.value).toBeInstanceOf(CanvasLayer))
    const layer = api.overlay.value as CanvasLayer
    expect(add).toHaveBeenCalledExactlyOnceWith(layer)
    expect(layer.setBounds).toHaveBeenCalledWith(expect.any(AMap.Bounds))

    const nextCanvas = document.createElement('canvas')
    canvas.value = nextCanvas
    bounds.value[0] = 116.37
    await nextTick()
    expect(layer.setCanvas).toHaveBeenLastCalledWith(nextCanvas)
    const extent = layer.setBounds.mock.calls.at(-1)?.[0] as AMap.Bounds
    expect(extent.getSouthWest().getLng()).toBe(116.37)
    api.refresh()
    expect(layer.reFresh).toHaveBeenCalledTimes(1)

    canvas.value = null
    await nextTick()
    expect(remove).toHaveBeenCalledExactlyOnceWith(layer)
    api.refresh()
    expect(layer.reFresh).toHaveBeenCalledTimes(1)
    canvas.value = nextCanvas
    await nextTick()
    expect(add).toHaveBeenCalledTimes(2)

    const destroy = vi.spyOn(layer, 'destroy')
    wrapper.unmount()
    expect(remove).toHaveBeenCalledTimes(2)
    expect(destroy).toHaveBeenCalledTimes(1)
    expect(api.overlay.value).toBeNull()
  })
})
