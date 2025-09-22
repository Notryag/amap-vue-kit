import type { Ref } from 'vue'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useCircleMarker } from '../src/useCircleMarker'

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

describe('useCircleMarker', () => {
  it('creates and updates a circle marker', async () => {
    const harness = mountHookWithMap((mapRef, options) => useCircleMarker(() => mapRef.value, options), {
      center: [116.397, 39.908] as [number, number],
      radius: 12,
      options: { fillColor: 'rgba(22, 119, 255, 0.4)' },
      visible: true,
    })

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('Circle marker was not created')

    expect(instance).toBeInstanceOf(AMap.CircleMarker)
    expect(instance.options.radius).toBe(12)
    expect(instance.options.fillColor).toBe('rgba(22, 119, 255, 0.4)')

    harness.options.value = {
      ...harness.options.value,
      radius: 20,
      options: { fillColor: 'rgba(250, 84, 28, 0.4)' },
      visible: false,
    }
    await flushReactivity()

    expect(instance.options.radius).toBe(20)
    expect(instance.options.fillColor).toBe('rgba(250, 84, 28, 0.4)')
    expect(instance.options.visible).toBe(false)

    harness.hook.setRadius(8)
    expect(instance.options.radius).toBe(8)

    harness.hook.show()
    expect(instance.options.visible).toBe(true)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()

    harness.cleanup()
  })
})
