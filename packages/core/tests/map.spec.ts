import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AmapMap from '../src/components/AmapMap.vue'
import AmapMarker from '../src/components/AmapMarker.vue'
import AmapInfoWindow from '../src/components/AmapInfoWindow.vue'

async function waitForMap() {
  await flushPromises()
  await flushPromises()
}

describe('AmapMap', () => {
  it('creates map instance and reacts to prop changes', async () => {
    const wrapper = mount(AmapMap, {
      props: {
        center: [120, 30],
        zoom: 10,
        pitch: 30
      }
    })

    await waitForMap()

    const readyEvents = wrapper.emitted('ready')
    expect(readyEvents).toBeTruthy()
    const map = (wrapper.vm as any).map.value
    expect(map).toBeTruthy()
    expect(map.options.center).toEqual([120, 30])

    await wrapper.setProps({ zoom: 12 })
    await waitForMap()
    expect(map.options.zoom).toBe(12)

    await wrapper.setProps({ center: [121, 31] })
    await waitForMap()
    expect(map.options.center).toEqual([121, 31])
  })
})

describe('AmapMarker', () => {
  it('syncs marker position and emits events', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapMarker },
      data: () => ({ position: [100, 20] as [number, number] }),
      template: `
        <AmapMap :center="[100, 20]" :zoom="12">
          <AmapMarker :position="position" @click="onClick" />
        </AmapMap>
      `,
      methods: {
        onClick() {}
      }
    })

    await waitForMap()

    const markerComponent = wrapper.findComponent(AmapMarker)
    const marker = (markerComponent.vm as any).marker.value
    expect(marker).toBeTruthy()
    expect(marker.options.position).toEqual([100, 20])

    wrapper.vm.position = [101, 21]
    await waitForMap()
    expect(marker.options.position).toEqual([101, 21])

    marker.emit('click', { type: 'click' })
    await waitForMap()
    expect(markerComponent.emitted('click')?.[0][0]).toEqual({ type: 'click' })
  })
})

describe('AmapInfoWindow', () => {
  it('opens and closes based on props', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapInfoWindow },
      data: () => ({ open: true }),
      template: `
        <AmapMap :center="[0, 0]" :zoom="12">
          <AmapInfoWindow :position="[0, 0]" :is-open="open">
            <span>Hello</span>
          </AmapInfoWindow>
        </AmapMap>
      `
    })

    await waitForMap()

    const infoWindowComponent = wrapper.findComponent(AmapInfoWindow)
    const infoWindow = (infoWindowComponent.vm as any).infoWindow.value
    expect(infoWindow?.opened).toBe(true)

    wrapper.vm.open = false
    await waitForMap()
    expect(infoWindow?.opened).toBe(false)
  })
})
