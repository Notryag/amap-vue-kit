import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, shallowRef } from 'vue'
import { useWMSLayer } from '../src/useWMSLayer'

afterEach(() => vi.restoreAllMocks())

describe('useWMSLayer', () => {
  it('updates the URL and GetMap params in place and removes the layer on unmount', async () => {
    class WMS extends AMap.TileLayer {
      constructor(private settings: AMap.TileLayer.WMSOptions) {
        super(settings)
      }

      getUrl() {
        return this.settings.url
      }

      getParams() {
        return this.settings.params
      }

      setUrl(url: string) {
        this.settings.url = url
      }

      setParams(params: AMap.TileLayer.WMSParams) {
        this.settings.params = { ...params, REQUEST: 'GetMap' }
      }

      setZooms(zooms: [number, number]) {
        this.settings.zooms = zooms
      }
    }

    vi.spyOn(loader, 'load').mockResolvedValue({
      ...AMap,
      TileLayer: Object.assign(class extends AMap.TileLayer {}, { WMS }),
    })
    const map = shallowRef(new AMap.Map(document.createElement('div')))
    const add = vi.spyOn(map.value, 'add')
    const remove = vi.spyOn(map.value, 'remove')
    const options = ref<AMap.TileLayer.WMSOptions>({
      url: 'https://example.com/wms',
      params: { LAYERS: 'relief', VERSION: '1.3.0' },
    })
    let api!: ReturnType<typeof useWMSLayer>
    const wrapper = mount(defineComponent({
      setup() {
        api = useWMSLayer(map, options)
        return () => null
      },
    }))

    await vi.waitFor(() => expect(api.overlay.value).toBeInstanceOf(WMS))
    const layer = api.overlay.value!
    expect(add).toHaveBeenCalledExactlyOnceWith(layer)
    expect(layer.getParams()).toEqual({ LAYERS: 'relief', VERSION: '1.3.0' })
    const hide = vi.spyOn(layer, 'hide')
    const setOpacity = vi.spyOn(layer, 'setOpacity')
    const reload = vi.spyOn(layer, 'reload')

    options.value.url = 'https://example.com/alt-wms'
    options.value.params.LAYERS = 'imagery'
    options.value.opacity = 0
    options.value.visible = false
    await nextTick()

    expect(api.overlay.value).toBe(layer)
    expect(layer.getUrl()).toBe('https://example.com/alt-wms')
    expect(layer.getParams().LAYERS).toBe('imagery')
    expect(options.value.params).not.toHaveProperty('REQUEST')
    expect(setOpacity).toHaveBeenCalledExactlyOnceWith(0)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(reload).toHaveBeenCalledTimes(1)
    api.reload()
    expect(reload).toHaveBeenCalledTimes(2)

    wrapper.unmount()
    expect(remove).toHaveBeenCalledExactlyOnceWith(layer)
    expect(api.overlay.value).toBeNull()
  })
})
