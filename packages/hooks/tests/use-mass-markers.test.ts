import type { Ref } from 'vue'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useMassMarkers, type UseMassMarkersOptions } from '../src/useMassMarkers'

interface HookHarness<Options> {
  hook: ReturnType<typeof useMassMarkers>
  options: Ref<Options>
  cleanup: () => void
}

function createContainer() {
  const container = document.createElement('div')
  container.style.width = '320px'
  container.style.height = '240px'
  document.body.appendChild(container)
  return container
}

function createMap() {
  const container = createContainer()
  const map = new AMap.Map(container)
  return {
    map,
    cleanup() {
      container.remove()
    },
  }
}

async function flushReactivity() {
  await flushPendingPromises()
  await nextTick()
}

async function waitForInstance<T>(getter: () => T | null | undefined, attempts = 5): Promise<T> {
  for (let index = 0; index < attempts; index++) {
    const value = getter()
    if (value)
      return value
    await flushReactivity()
  }

  const value = getter()
  if (!value)
    throw new Error('Timed out waiting for instance to be created')
  return value
}

function mountMassMarkers(initialOptions: UseMassMarkersOptions): HookHarness<UseMassMarkersOptions> {
  const { map, cleanup: disposeMap } = createMap()
  const context: Partial<HookHarness<UseMassMarkersOptions>> = {}

  const TestComponent = defineComponent({
    setup() {
      const mapRef = ref<AMap.Map | null>(map)
      const optionsRef = ref(initialOptions) as Ref<UseMassMarkersOptions>
      const hook = useMassMarkers(() => mapRef.value, optionsRef)

      Object.assign(context, {
        hook,
        options: optionsRef,
      })

      return () => null
    },
  })

  const wrapper = mount(TestComponent)

  return {
    hook: context.hook!,
    options: context.options!,
    cleanup() {
      wrapper.unmount()
      disposeMap()
    },
  }
}

describe('useMassMarkers', () => {
  it('responds to option updates', async () => {
    const initialOptions = {
      data: [{ lnglat: [116.397, 39.908] as [number, number], style: 0 }],
      style: {
        url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
        anchor: [6, 6] as [number, number],
        size: [12, 12] as [number, number],
        rotation: 0,
      },
      options: {
        opacity: 0.8,
        zIndex: 110,
        zooms: [3, 18] as [number, number],
      },
      visible: true,
    }

    const harness = mountMassMarkers(initialOptions)
    const instance = await waitForInstance(() => harness.hook.mass.value)

    expect(instance.getOpacity()).toBe(0.8)
    expect(instance.getzIndex()).toBe(110)
    expect(instance.getZooms()).toEqual([3, 18])

    harness.options.value = {
      ...harness.options.value,
      options: {
        opacity: 0.35,
        zIndex: 250,
        zooms: [4, 16] as [number, number],
      },
    }

    await flushReactivity()

    expect(instance.getOpacity()).toBe(0.35)
    expect(instance.getzIndex()).toBe(250)
    expect(instance.getZooms()).toEqual([4, 16])

    harness.cleanup()
  })
})
