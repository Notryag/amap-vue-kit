import type { LocaNamespace } from '../src/types'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import AmapLocaHeatmapLayer from '../src/components/AmapLocaHeatmapLayer.vue'
import AmapLocaPointLayer from '../src/components/AmapLocaPointLayer.vue'
import AmapLocaPolygonLayer from '../src/components/AmapLocaPolygonLayer.vue'
import AmapLocaProvider from '../src/components/AmapLocaProvider.vue'

class MockContainer {
  public render = vi.fn()
  public destroy = vi.fn()
  public add = vi.fn()
  public remove = vi.fn()
  constructor(public options: Record<string, any>) {}
  getMap() {
    return this.options.map
  }
}

class MockLayer {
  public source: any = null
  public style: any = null
  public options: any = null
  public render = vi.fn()
  public destroy = vi.fn()
  public on = vi.fn()
  public off = vi.fn()

  constructor(options: Record<string, any> = {}) {
    this.options = options
  }

  setSource(source: any) {
    this.source = source
  }

  setStyle(style: Record<string, any>) {
    this.style = style
  }

  setOptions(options: Record<string, any>) {
    this.options = {
      ...this.options,
      ...options,
    }
  }
}

let createdLayers: MockLayer[]
let createdContainers: MockContainer[]
let mockLoca: LocaNamespace

beforeEach(() => {
  createdLayers = []
  createdContainers = []
  class Container extends MockContainer {
    constructor(options: Record<string, any>) {
      super(options)
      createdContainers.push(this)
    }
  }
  class PointLayer extends MockLayer {
    constructor(options: Record<string, any> = {}) {
      super(options)
      createdLayers.push(this)
    }
  }
  mockLoca = {
    Container: Container as any,
    GeoJSONSource: class {
      constructor(public readonly options: { data: Record<string, any> }) {}

      get data() {
        return this.options.data
      }
    },
    PointLayer: PointLayer as any,
    HeatmapLayer: PointLayer as any,
    PolygonLayer: PointLayer as any,
    PulseLineLayer: PointLayer as any,
  }
  ;(globalThis as any).Loca = mockLoca
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    cb(0)
    return 1
  }) as any
  globalThis.cancelAnimationFrame = (() => {}) as any
})

describe('amap loca components', () => {
  it('removes and destroys child layers before destroying the container', async () => {
    const Root = defineComponent({
      components: { AmapLocaProvider, AmapLocaPointLayer },
      setup: () => ({
        map: {},
        points: [
          { lng: 120, lat: 30 },
        ],
      }),
      template: `
        <AmapLocaProvider :map="map">
          <AmapLocaPointLayer :data="points" />
        </AmapLocaProvider>
      `,
    })

    const wrapper = mount(Root)
    await nextTick()
    const [container] = createdContainers
    const [layer] = createdLayers
    expect(container.add).toHaveBeenCalledWith(layer)

    wrapper.unmount()

    expect(container.remove).toHaveBeenCalledExactlyOnceWith(layer)
    expect(layer.destroy).toHaveBeenCalledTimes(1)
    expect(container.destroy).toHaveBeenCalledTimes(1)
    expect(container.remove).toHaveBeenCalledBefore(layer.destroy)
    expect(layer.destroy).toHaveBeenCalledBefore(container.destroy)
  })

  it('binds point layer data reactively', async () => {
    const Root = defineComponent({
      components: { AmapLocaProvider, AmapLocaPointLayer },
      setup() {
        const map = {}
        const points = ref([
          { lng: 120, lat: 30 },
        ])
        return { map, points }
      },
      template: `
        <AmapLocaProvider :map="map">
          <AmapLocaPointLayer :data="points" />
        </AmapLocaProvider>
      `,
    })

    const wrapper = mount(Root)
    await nextTick()

    expect(createdLayers[0].source.data.features[0].geometry.coordinates).toEqual([120, 30])

    wrapper.vm.points = [
      { lng: 121, lat: 31 },
    ]
    await nextTick()

    expect(createdLayers[0].source.data.features[0].geometry.coordinates).toEqual([121, 31])

    wrapper.unmount()
  })

  it('passes options to heatmap layer', async () => {
    const Root = defineComponent({
      components: { AmapLocaProvider, AmapLocaHeatmapLayer },
      setup() {
        const map = {}
        const data = ref([
          { lng: 120, lat: 30, value: 10 },
        ])
        const options = ref({ radius: 20 })
        return { map, data, options }
      },
      template: `
        <AmapLocaProvider :map="map">
          <AmapLocaHeatmapLayer :data="data" :options="options" />
        </AmapLocaProvider>
      `,
    })

    mount(Root)
    await nextTick()

    expect(createdLayers[0].options.radius).toBe(20)
  })

  it('registers polygon layer events', async () => {
    const onClick = vi.fn()
    const Root = defineComponent({
      components: { AmapLocaProvider, AmapLocaPolygonLayer },
      setup() {
        const map = {}
        const source = ref({})
        const events = ref({ click: onClick })
        const style = ref({ color: '#f00' })
        return { map, source, events, style }
      },
      template: `
        <AmapLocaProvider :map="map">
          <AmapLocaPolygonLayer :source="source" :events="events" :layer-style="style" />
        </AmapLocaProvider>
      `,
    })

    mount(Root)
    await nextTick()

    expect(createdLayers[0].on).toHaveBeenCalledWith('click', onClick)
  })
})
