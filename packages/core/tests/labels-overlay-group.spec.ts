import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AmapLabelMarker from '../src/components/AmapLabelMarker.vue'
import AmapLabelsLayer from '../src/components/AmapLabelsLayer.vue'
import AmapMap from '../src/components/AmapMap.vue'
import AmapOverlayGroup from '../src/components/AmapOverlayGroup.vue'

async function waitForMap() {
  await flushPromises()
  await flushPromises()
}

describe('labels layer', () => {
  it('creates labels layer and manages markers', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapLabelsLayer, AmapLabelMarker },
      data: () => ({
        visible: true,
        opacity: 0.8,
        items: [
          { key: 'a', position: [116, 39], text: { content: 'A' } },
          { key: 'b', position: [117, 40], text: { content: 'B' } },
        ],
      }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12">
          <AmapLabelsLayer :visible="visible" :opacity="opacity" :zooms="[3, 20]">
            <AmapLabelMarker
              v-for="item in items"
              :key="item.key"
              :position="item.position"
              :text="item.text"
            />
          </AmapLabelsLayer>
        </AmapMap>
      `,
    })

    await waitForMap()

    const layerComponent = wrapper.findComponent(AmapLabelsLayer)
    const layer = (layerComponent.vm as any).layer
    expect(layer).toBeTruthy()
    expect(layer.options.visible).toBe(true)
    expect(layer.options.opacity).toBe(0.8)
    expect(layer.options.zooms).toEqual([3, 20])
    expect(layer.markers.size).toBe(2)

    const markers = Array.from(layer.markers.values())
    expect(markers[0].options.text.content).toBe('A')

    wrapper.vm.visible = false
    await waitForMap()
    expect(layer.options.visible).toBe(false)

    wrapper.vm.opacity = 0.4
    await waitForMap()
    expect(layer.options.opacity).toBe(0.4)

    wrapper.vm.items = [
      { key: 'a', position: [116, 39], text: { content: 'Updated' } },
    ]
    await waitForMap()
    expect(layer.markers.size).toBe(1)
    const [updatedMarker] = Array.from(layer.markers.values())
    expect(updatedMarker.options.text.content).toBe('Updated')
  })
})

describe('overlay group', () => {
  it('adds and removes overlays efficiently', async () => {
    const createOverlays = () => [
      new (window as any).AMap.Marker({ position: [0, 0] }),
      new (window as any).AMap.Marker({ position: [1, 1] }),
    ]

    const wrapper = mount({
      components: { AmapMap, AmapOverlayGroup },
      data: () => ({
        overlays: createOverlays(),
        visible: true,
      }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="11">
          <AmapOverlayGroup :overlays="overlays" :visible="visible" ref="groupRef" />
        </AmapMap>
      `,
    })

    await waitForMap()

    const groupComponent = wrapper.findComponent(AmapOverlayGroup)
    const group = (groupComponent.vm as any).group
    expect(group).toBeTruthy()
    expect(group.visible).toBe(true)
    expect(group.getOverlays().length).toBe(2)

    const extraOverlay = new (window as any).AMap.Marker({ position: [2, 2] })
    ;(groupComponent.vm as any).addOverlay(extraOverlay)
    expect(group.getOverlays().length).toBe(3)

    wrapper.vm.visible = false
    await waitForMap()
    expect(group.visible).toBe(false)

    wrapper.vm.overlays = createOverlays()
    await waitForMap()
    expect(group.getOverlays().length).toBe(2)

    ;(groupComponent.vm as any).clearOverlays()
    expect(group.getOverlays().length).toBe(0)
  })
})
