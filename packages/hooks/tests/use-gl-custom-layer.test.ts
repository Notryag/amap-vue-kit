import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import { useGLCustomLayer } from '../src/useGLCustomLayer'

afterEach(() => vi.restoreAllMocks())

describe('useGLCustomLayer', () => {
  it('reinitializes for a new map and releases each context before layer removal', async () => {
    const gl = {} as AMap.GLContext
    const dispose = vi.fn()
    const render = vi.fn()
    const init = vi.fn(() => dispose)
    const remove = vi.fn()
    class GLCustomLayer extends AMap.TileLayer {
      constructor(readonly settings: AMap.GLCustomLayerOptions) {
        super(settings)
      }

      readonly getMap = vi.fn()
      readonly setZooms = vi.fn()
    }

    class Map extends AMap.Map {
      private layer?: GLCustomLayer
      add(layer: GLCustomLayer) {
        this.layer = layer
        layer.settings.init?.(gl)
      }

      render() {
        this.layer?.settings.render?.(gl, 'frame')
      }

      remove(layer: GLCustomLayer) {
        remove(layer)
        this.layer = undefined
      }
    }

    vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, GLCustomLayer })
    const first = new Map(document.createElement('div'))
    const second = new Map(document.createElement('div'))
    const map = shallowRef<AMap.Map | null>(first)
    let api!: ReturnType<typeof useGLCustomLayer>
    const wrapper = mount(defineComponent({
      setup() {
        api = useGLCustomLayer(map, { init, render })
        return () => null
      },
    }))

    await vi.waitFor(() => expect(init).toHaveBeenCalledExactlyOnceWith({ gl, map: first }))
    const originalLayer = api.overlay.value as GLCustomLayer
    api.redraw()
    expect(render).toHaveBeenCalledExactlyOnceWith({ gl, map: first, state: 'frame' })

    map.value = second
    await nextTick()
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(2))
    expect(init).toHaveBeenLastCalledWith({ gl, map: second })
    expect(dispose).toHaveBeenCalledExactlyOnceWith()
    expect(dispose).toHaveBeenCalledBefore(remove)
    expect(api.overlay.value).not.toBe(originalLayer)
    originalLayer.settings.render?.(gl, 'stale')
    expect(render).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    expect(dispose).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalledTimes(2)
    expect(api.overlay.value).toBeNull()
  })
})
