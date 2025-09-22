import type { Ref } from 'vue'

import type { MarkerClusterPoint } from '../src/useMarkerClusterer'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useMarkerClusterer } from '../src/useMarkerClusterer'

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

interface HookHarness<Options, HookReturn> {
  hook: HookReturn
  map: AMap.Map
  mapRef: Ref<AMap.Map | null>
  options: Ref<Options>
  cleanup: () => void
}

function mountHookWithMap<Options, HookReturn>(
  factory: (mapRef: Ref<AMap.Map | null>, options: Ref<Options>) => HookReturn,
  initialOptions: Options,
): HookHarness<Options, HookReturn> {
  const { map, cleanup: disposeMap } = createMap()
  const context: Partial<HookHarness<Options, HookReturn>> = {}

  const TestComponent = defineComponent({
    setup() {
      const mapRef = ref<AMap.Map | null>(map)
      const optionsRef = ref(initialOptions) as Ref<Options>
      const hook = factory(mapRef, optionsRef)

      Object.assign(context, {
        hook,
        map,
        mapRef,
        options: optionsRef,
      })

      return () => null
    },
  })

  const wrapper = mount(TestComponent)

  return {
    hook: context.hook!,
    map,
    mapRef: context.mapRef!,
    options: context.options!,
    cleanup() {
      wrapper.unmount()
      disposeMap()
    },
  }
}

function createPoints(count: number): MarkerClusterPoint[] {
  return Array.from({ length: count }, (_, index) => ({
    position: [116.3 + Math.random() * 0.4, 39.8 + Math.random() * 0.4] as [number, number],
    extData: { id: index },
  }))
}

describe('useMarkerClusterer', () => {
  it('creates and updates marker clusters from point data', async () => {
    const harness = mountHookWithMap((mapRef, options) => useMarkerClusterer(() => mapRef.value, options), {
      points: createPoints(50),
      gridSize: 80,
      visible: true,
    })

    const instance = await waitForInstance(() => harness.hook.cluster.value)
    if (!instance)
      throw new Error('MarkerCluster instance was not created')

    expect(instance).toBeInstanceOf(AMap.MarkerCluster)
    expect((instance as any).markers.length).toBeGreaterThan(0)

    harness.options.value = {
      ...harness.options.value,
      points: createPoints(30),
      visible: false,
    }
    await flushReactivity()

    expect((instance as any).markers.length).toBeGreaterThan(0)
    expect((instance as any).map).toBeNull()

    harness.hook.show()
    expect((instance as any).map?.container).toBe(harness.map.container)

    harness.hook.destroy()
    expect(harness.hook.cluster.value).toBeNull()

    harness.cleanup()
  })
})
