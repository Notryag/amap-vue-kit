import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AmapControlBar from '../src/components/AmapControlBar.vue'
import AmapImageLayer from '../src/components/AmapImageLayer.vue'
import AmapMap from '../src/components/AmapMap.vue'
import AmapMapType from '../src/components/AmapMapType.vue'
import AmapRoadNetLayer from '../src/components/AmapRoadNetLayer.vue'
import AmapSatelliteLayer from '../src/components/AmapSatelliteLayer.vue'
import AmapTileLayer from '../src/components/AmapTileLayer.vue'
import AmapToolBar from '../src/components/AmapToolBar.vue'
import AmapTrafficLayer from '../src/components/AmapTrafficLayer.vue'

async function waitForMap() {
  await flushPromises()
  await flushPromises()
}

describe('layers', () => {
  it('creates tile layer and updates visibility/opacity', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapTileLayer },
      data: () => ({ visible: true, opacity: 0.5 }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12">
          <AmapTileLayer :visible="visible" :opacity="opacity" />
        </AmapMap>
      `,
    })

    await waitForMap()

    const layerComponent = wrapper.findComponent(AmapTileLayer)
    const layer = (layerComponent.vm as any).layer
    expect(layer).toBeTruthy()
    expect(layer.options.visible).toBe(true)
    expect(layer.options.opacity).toBe(0.5)

    wrapper.vm.visible = false
    await waitForMap()
    expect(layer.options.visible).toBe(false)

    wrapper.vm.opacity = 0.8
    await waitForMap()
    expect(layer.options.opacity).toBe(0.8)
  })

  it('applies traffic layer options', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapTrafficLayer },
      data: () => ({ autoRefresh: true, interval: 5 }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12">
          <AmapTrafficLayer :auto-refresh="autoRefresh" :interval="interval" />
        </AmapMap>
      `,
    })

    await waitForMap()

    const layerComponent = wrapper.findComponent(AmapTrafficLayer)
    const layer = (layerComponent.vm as any).layer
    expect(layer).toBeTruthy()
    expect(layer.options.autoRefresh).toBe(true)
    expect(layer.options.interval).toBe(5)

    wrapper.vm.autoRefresh = false
    wrapper.vm.interval = 10
    await waitForMap()
    expect(layer.options.autoRefresh).toBe(false)
    expect(layer.options.interval).toBe(10)
  })

  it('creates image layer and updates url and bounds', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapImageLayer },
      data: () => ({
        url: 'https://example.com/image.png',
        bounds: [[116, 39], [117, 40]] as [[number, number], [number, number]],
        visible: true,
        opacity: 0.6,
      }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12">
          <AmapImageLayer
            :url="url"
            :bounds="bounds"
            :visible="visible"
            :opacity="opacity"
          />
        </AmapMap>
      `,
    })

    await waitForMap()

    const layerComponent = wrapper.findComponent(AmapImageLayer)
    const layer = (layerComponent.vm as any).layer
    expect(layer).toBeTruthy()
    expect(layer.options.url).toBe('https://example.com/image.png')
    expect(layer.options.bounds).toBeTruthy()
    expect(layer.options.opacity).toBe(0.6)

    wrapper.vm.url = 'https://example.com/updated.png'
    wrapper.vm.bounds = [[118, 38], [119, 39]]
    wrapper.vm.visible = false
    wrapper.vm.opacity = 0.8

    await waitForMap()

    expect(layer.options.url).toBe('https://example.com/updated.png')
    const bounds = layer.options.bounds
    expect(bounds.getSouthWest().getLng()).toBe(118)
    expect(bounds.getNorthEast().getLat()).toBe(39)
    expect(layer.options.visible).toBe(false)
    expect(layer.options.opacity).toBe(0.8)
  })

  it('removes official tile layers when components unmount', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapRoadNetLayer, AmapSatelliteLayer },
      data: () => ({ active: 'satellite', map: null as AMap.Map | null }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12" @ready="map = $event">
          <AmapSatelliteLayer v-if="active === 'satellite'" />
          <AmapRoadNetLayer v-if="active === 'roadNet'" />
        </AmapMap>
      `,
    })

    await waitForMap()

    const map = wrapper.vm.map as any
    expect(map.getLayers()).toHaveLength(1)
    expect(map.getLayers()[0].constructor.name).toBe('SatelliteTileLayer')

    wrapper.vm.active = 'roadNet'
    await waitForMap()

    expect(map.getLayers()).toHaveLength(1)
    expect(map.getLayers()[0].constructor.name).toBe('RoadNetTileLayer')

    wrapper.vm.active = 'none'
    await waitForMap()

    expect(map.getLayers()).toHaveLength(0)
  })
})

describe('controls', () => {
  it('adds toolbar control and toggles visibility', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapToolBar },
      data: () => ({ visible: true }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12">
          <AmapToolBar :visible="visible" position="LT" />
        </AmapMap>
      `,
    })

    await waitForMap()

    const controlComponent = wrapper.findComponent(AmapToolBar)
    const control = (controlComponent.vm as any).control
    expect(control).toBeTruthy()
    expect(control.options.visible).toBe(true)

    wrapper.vm.visible = false
    await waitForMap()
    expect(control.options.visible).toBe(false)
  })

  it('configures control bar options', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapControlBar },
      data: () => ({ showZoom: true, showButton: true }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12">
          <AmapControlBar :show-zoom-bar="showZoom" :show-control-button="showButton" />
        </AmapMap>
      `,
    })

    await waitForMap()

    const controlComponent = wrapper.findComponent(AmapControlBar)
    const control = (controlComponent.vm as any).control
    expect(control).toBeTruthy()
    expect(control.options.showZoomBar).toBe(true)
    expect(control.options.showControlButton).toBe(true)

    wrapper.vm.showZoom = false
    wrapper.vm.showButton = false
    await waitForMap()
    expect(control.options.showZoomBar).toBe(false)
    expect(control.options.showControlButton).toBe(false)
  })

  it('recreates map type control when default type changes', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapMapType },
      data: () => ({ defaultType: 0, showMapType: true, map: null as AMap.Map | null }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12" @ready="map = $event">
          <AmapMapType v-if="showMapType" :default-type="defaultType" />
        </AmapMap>
      `,
    })

    await waitForMap()

    const controlComponent = wrapper.findComponent(AmapMapType)
    const firstControl = (controlComponent.vm as any).control
    const map = wrapper.vm.map as any
    expect(firstControl).toBeTruthy()
    expect(firstControl.options.defaultType).toBe(0)
    expect(map.getLayers()).toHaveLength(4)

    wrapper.vm.defaultType = 1
    await waitForMap()

    const secondControl = (wrapper.findComponent(AmapMapType).vm as any).control
    expect(secondControl).toBeTruthy()
    expect(secondControl).not.toBe(firstControl)
    expect(secondControl.options.defaultType).toBe(1)
    expect(firstControl.map).toBeNull()
    expect(map.getLayers()).toHaveLength(4)

    wrapper.vm.showMapType = false
    await waitForMap()

    expect(map.getLayers()).toHaveLength(0)
  })
})
