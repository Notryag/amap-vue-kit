import { loader } from '@amap-vue/shared'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import AmapHeatMap from '../src/components/AmapHeatMap.vue'
import AmapInfoWindow from '../src/components/AmapInfoWindow.vue'
import AmapMap from '../src/components/AmapMap.vue'
import AmapMarker from '../src/components/AmapMarker.vue'

async function waitForMap() {
  await flushPromises()
  await flushPromises()
}

describe('amapMap', () => {
  it('detaches child heat maps before destroying the parent map', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapHeatMap },
      template: '<AmapMap><AmapHeatMap /></AmapMap>',
    })
    await waitForMap()
    const heatMap = (wrapper.findComponent(AmapHeatMap).vm as any).heatMap
    expect(heatMap).toBeTruthy()
    const map = heatMap.map
    const detach = vi.spyOn(heatMap, 'setMap').mockImplementation((target) => {
      expect(map.destroyed).toBe(false)
      expect(target).toBeNull()
    })
    wrapper.unmount()
    expect(detach).toHaveBeenCalledTimes(1)
    expect(map.destroyed).toBe(true)
    detach.mockRestore()
  })

  it('does not create a map when SDK loading finishes after unmount', async () => {
    let resolve!: (sdk: typeof AMap) => void
    const load = vi.spyOn(loader, 'load').mockReturnValue(new Promise((done) => {
      resolve = done
    }))
    const createMap = vi.fn()
    try {
      const wrapper = mount(AmapMap)
      await flushPromises()
      wrapper.unmount()
      resolve({ ...AMap, Map: createMap } as unknown as typeof AMap)
      await waitForMap()
      expect(createMap).not.toHaveBeenCalled()
    }
    finally {
      load.mockRestore()
    }
  })

  it('creates map instance and reacts to prop changes', async () => {
    const wrapper = mount(AmapMap, {
      props: {
        center: [120, 30],
        zoom: 10,
        pitch: 30,
      },
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

    await wrapper.setProps({
      center: [121, 31],
    })
    await waitForMap()
    expect(map.options.center).toEqual([121, 31])
  })
})

describe('amapMarker', () => {
  it('syncs marker position and emits events', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapMarker },
      data: () => ({
        position: [100, 20] as [number, number],
      }),
      template: `
        <AmapMap :center="[100, 20]" :zoom="12">
          <AmapMarker :position="position" @click="onClick" />
        </AmapMap>
      `,
      methods: {
        onClick() {},
      },
    })

    await waitForMap()

    const markerComponent = wrapper.findComponent(AmapMarker)
    const marker = (markerComponent.vm as any).marker
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

describe('amapInfoWindow', () => {
  it('keeps slot content reactive after the SDK adopts its container', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapInfoWindow },
      data: () => ({ count: 1, visible: true }),
      template: `
        <AmapMap>
          <AmapInfoWindow v-if="visible" :position="[0, 0]" is-open>
            <span>{{ count }}</span>
          </AmapInfoWindow>
        </AmapMap>
      `,
    })
    await waitForMap()
    const infoWindow = (wrapper.findComponent(AmapInfoWindow).vm as any).infoWindow
    const map = infoWindow.map
    const content = infoWindow.content as HTMLElement
    const sdkHost = document.createElement('div')
    map.container.appendChild(sdkHost)
    sdkHost.appendChild(content)
    const internalDestroy = vi.fn()
    infoWindow.destroy = internalDestroy

    wrapper.vm.count = 2
    await waitForMap()
    expect(content.textContent).toBe('2')
    wrapper.vm.visible = false
    await waitForMap()
    expect(content.textContent).toBe('')
    expect(infoWindow.opened).toBe(false)
    expect(internalDestroy).not.toHaveBeenCalled()
    expect(map.destroyed).toBe(false)
    wrapper.unmount()
    expect(map.destroyed).toBe(true)
  })

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
      `,
    })

    await waitForMap()

    const infoWindowComponent = wrapper.findComponent(AmapInfoWindow)
    const infoWindow = (infoWindowComponent.vm as any).infoWindow
    expect(infoWindow?.opened).toBe(true)

    wrapper.vm.open = false
    await waitForMap()
    expect(infoWindow?.opened).toBe(false)
  })
})
