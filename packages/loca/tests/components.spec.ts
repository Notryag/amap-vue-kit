import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import AmapLocaProvider from '../src/components/AmapLocaProvider.vue'
import AmapLocaPointLayer from '../src/components/AmapLocaPointLayer.vue'
import AmapLocaHeatmapLayer from '../src/components/AmapLocaHeatmapLayer.vue'
import AmapLocaPolygonLayer from '../src/components/AmapLocaPolygonLayer.vue'
import type { LocaNamespace } from '../src/types'

class MockContainer {
  public render = vi.fn()
  public destroy = vi.fn()
  constructor(public options: Record<string, any>) {}
  getMap() {
    return this.options.map
  }
}

class MockLayer {
  public data: any = null
  public style: any = null
  public options: any = null
  public container: any = null
  public render = vi.fn()
  public remove = vi.fn()
  public destroy = vi.fn()
  public on = vi.fn()
  public off = vi.fn()

  constructor(options: Record<string, any> = {}) {
    this.options = options
  }

  setData(data: any, transforms: Record<string, any>) {
    if (transforms?.value && transforms?.lnglat) {
      this.data = data.map((item: any) => ({
        point: transforms.lnglat(item),
        value: transforms.value(item),
      }))
    }
    else if (transforms?.lnglat) {
      this.data = data.map((item: any) => transforms.lnglat(item))
    }
    else if (transforms?.path) {
      this.data = data.map((item: any) => transforms.path(item))
    }
    else {
      this.data = data
    }
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

  addTo(container: any) {
    this.container = container
  }
}

let createdLayers: MockLayer[]
let mockLoca: LocaNamespace

beforeEach(() => {
  createdLayers = []
  class PointLayer extends MockLayer {
    constructor(options: Record<string, any> = {}) {
      super(options)
      createdLayers.push(this)
    }
  }
  mockLoca = {
    Container: MockContainer as any,
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

describe('Amap Loca components', () => {
  it('binds point layer data reactively', async () => {
    const Root = defineComponent({
      components: { AmapLocaProvider, AmapLocaPointLayer },
      setup() {
        const map = {}
        const points = ref([{ lng: 120, lat: 30 }])
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

    expect(createdLayers[0].data).toEqual([[120, 30]])

    wrapper.vm.points = [{ lng: 121, lat: 31 }]
    await nextTick()

    expect(createdLayers[0].data).toEqual([[121, 31]])

    wrapper.unmount()
  })

  it('passes options to heatmap layer', async () => {
    const Root = defineComponent({
      components: { AmapLocaProvider, AmapLocaHeatmapLayer },
      setup() {
        const map = {}
        const data = ref([{ lng: 120, lat: 30, value: 10 }])
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
          <AmapLocaPolygonLayer :source="source" :events="events" :style="style" />
        </AmapLocaProvider>
      `,
    })

    mount(Root)
    await nextTick()

    expect(createdLayers[0].on).toHaveBeenCalledWith('click', onClick)
  })
})
