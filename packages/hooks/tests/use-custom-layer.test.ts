import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, shallowRef } from 'vue'
import { useCustomLayer } from '../src/useCustomLayer'

afterEach(() => vi.restoreAllMocks())

describe('useCustomLayer', () => {
  it('draws against the attached map and stops drawing after detach or destroy', async () => {
    class CustomLayer extends AMap.TileLayer {
      render = () => {}
      setZooms = vi.fn()

      constructor(canvas: HTMLCanvasElement, options?: AMap.CustomLayerOptions) {
        super(options)
        expect(canvas).toBeInstanceOf(HTMLCanvasElement)
      }

      setMap(map: AMap.Map | null) {
        super.setMap(map)
        if (map)
          this.render()
      }
    }

    vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, CustomLayer })
    const map = shallowRef<AMap.Map | null>(new AMap.Map(document.createElement('div')))
    const draw = vi.fn()
    const nextDraw = vi.fn()
    const render = shallowRef(draw)
    const visible = ref(true)
    let api!: ReturnType<typeof useCustomLayer>
    const wrapper = mount(defineComponent({
      setup() {
        api = useCustomLayer(map, () => ({ render: render.value, visible: visible.value }))
        return () => null
      },
    }))

    await vi.waitFor(() => expect(draw).toHaveBeenCalledTimes(1))
    const layer = api.overlay.value!
    const setMap = vi.spyOn(layer, 'setMap')
    const destroy = vi.spyOn(layer, 'destroy')
    const canvas = draw.mock.calls[0][0].canvas
    expect(draw).toHaveBeenCalledWith({ canvas, map: map.value })

    render.value = nextDraw
    await nextTick()
    expect(nextDraw).toHaveBeenCalledExactlyOnceWith({ canvas, map: map.value })
    visible.value = false
    await nextTick()
    api.redraw()
    expect(nextDraw).toHaveBeenCalledTimes(1)
    visible.value = true
    await nextTick()
    expect(nextDraw).toHaveBeenCalledTimes(2)

    map.value = null
    await nextTick()
    layer.render()
    expect(nextDraw).toHaveBeenCalledTimes(2)
    map.value = new AMap.Map(document.createElement('div'))
    await nextTick()
    expect(nextDraw).toHaveBeenLastCalledWith({ canvas, map: map.value })

    wrapper.unmount()
    expect(setMap).toHaveBeenLastCalledWith(null)
    expect(destroy).toHaveBeenCalledTimes(1)
    expect(setMap).toHaveBeenCalledBefore(destroy)
    layer.render()
    expect(nextDraw).toHaveBeenCalledTimes(3)
  })
})
