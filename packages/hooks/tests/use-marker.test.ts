import type { Ref } from 'vue'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useMarker } from '../src/useMarker'

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

describe('useMarker', () => {
  it('supports custom content, anchor and visibility toggles', async () => {
    const harness = mountHookWithMap((mapRef, options) => useMarker(() => mapRef.value, options), {
      position: [116.397, 39.908] as [number, number],
      content: 'Hello',
      anchor: 'center' as AMap.MarkerAnchor,
      offset: [12, -8] as [number, number],
      visible: true,
    })

    const instance = await waitForInstance(() => harness.hook.marker.value)
    if (!instance)
      throw new Error('Marker instance was not created')

    expect(instance).toBeInstanceOf(AMap.Marker)
    expect(instance.options.content).toBe('Hello')
    expect(instance.options.anchor).toBe('center')
    expect(instance.options.offset).toBeInstanceOf(AMap.Pixel)
    expect((instance.options.offset as AMap.Pixel).getX()).toBe(12)
    expect((instance.options.offset as AMap.Pixel).getY()).toBe(-8)

    harness.options.value = {
      ...harness.options.value,
      content: 'Updated',
      anchor: 'bottom-center',
      offset: [0, -24],
      visible: false,
    }
    await flushReactivity()

    expect(instance.options.content).toBe('Updated')
    expect(instance.options.anchor).toBe('bottom-center')
    expect(instance.options.visible).toBe(false)
    expect(instance.options.offset).toBeInstanceOf(AMap.Pixel)
    expect((instance.options.offset as AMap.Pixel).getX()).toBe(0)
    expect((instance.options.offset as AMap.Pixel).getY()).toBe(-24)

    const html = document.createElement('div')
    html.textContent = 'Slot content'
    harness.hook.setContent(html)
    expect(instance.options.content).toBe(html)

    harness.hook.setAnchor('top-left')
    expect(instance.options.anchor).toBe('top-left')

    harness.hook.setIsCustom(true)
    expect(instance.options.isCustom).toBe(true)

    harness.hook.show()
    expect(instance.options.visible).toBe(true)

    harness.hook.destroy()
    expect(harness.hook.marker.value).toBeNull()

    harness.cleanup()
  })
})
