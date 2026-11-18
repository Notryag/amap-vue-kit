import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import AmapBuildings from '../src/components/AmapBuildings.vue'
import AmapMap from '../src/components/AmapMap.vue'

afterEach(() => vi.restoreAllMocks())

describe('amapBuildings', () => {
  it('applies styles and visibility, then removes the layer before the map is destroyed', async () => {
    const maps: AMap.Map[] = []
    const mapOptions: (AMap.MapOptions | undefined)[] = []
    const layers: Buildings[] = []

    class Map extends AMap.Map {
      constructor(container: string | HTMLElement, options?: AMap.MapOptions) {
        super(container, options)
        maps.push(this)
        mapOptions.push(options)
      }
    }

    class Buildings extends AMap.TileLayer {
      setStyle = vi.fn()
      setZooms = vi.fn()
      getOptions = vi.fn()
      getZooms = vi.fn()
      getOpacity = vi.fn()
      getzIndex = vi.fn()

      constructor(options?: AMap.BuildingsOptions) {
        super(options)
        layers.push(this)
      }
    }

    vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, Map, Buildings })
    const blue = '#1d4ed8'
    const style = ref<AMap.BuildingsStyle>({
      areas: [
        {
          path: [
            [116.46, 39.908],
            [116.471, 39.908],
            [116.471, 39.919],
            [116.46, 39.908],
          ],
          color2: blue,
        },
      ],
    })
    const visible = ref(true)
    const ready = vi.fn()
    const wrapper = mount(defineComponent({
      setup: () => () => h(AmapMap, { viewMode: '3D', showBuildingBlock: false }, () => h(AmapBuildings, {
        layerStyle: style.value,
        visible: visible.value,
        onReady: ready,
      })),
    }))

    await vi.waitFor(() => expect(ready).toHaveBeenCalledTimes(1))
    expect(mapOptions[0]).toMatchObject({ viewMode: '3D', showBuildingBlock: false })
    const [layer] = layers
    const [map] = maps
    expect(layer.setStyle).toHaveBeenCalledExactlyOnceWith(style.value)
    const hide = vi.spyOn(layer, 'hide')
    const remove = vi.spyOn(map, 'remove')
    const destroyLayer = vi.spyOn(layer, 'destroy')
    const destroyMap = vi.spyOn(map, 'destroy')

    style.value.areas![0].color2 = '#c2410c'
    await nextTick()
    expect(layer.setStyle).toHaveBeenCalledTimes(2)
    expect(layer.setStyle).toHaveBeenLastCalledWith(style.value)
    visible.value = false
    await nextTick()
    expect(hide).toHaveBeenCalledTimes(1)
    expect(layer.setStyle).toHaveBeenCalledTimes(2)

    wrapper.unmount()
    expect(remove).toHaveBeenCalledExactlyOnceWith(layer)
    expect(destroyLayer).toHaveBeenCalledBefore(destroyMap)
  })
})
