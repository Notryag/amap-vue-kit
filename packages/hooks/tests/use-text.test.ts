import type { Ref } from 'vue'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useText } from '../src/useText'

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

describe('useText', () => {
  it('creates and updates a text overlay', async () => {
    const harness = mountHookWithMap((mapRef, options) => useText(() => mapRef.value, options), {
      position: [116.397, 39.908] as [number, number],
      text: 'Hello',
      style: { color: 'red' },
      visible: true,
      offset: [0, -20] as [number, number],
    })

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('Text overlay was not created')

    expect(instance).toBeInstanceOf(AMap.Text)
    expect(instance.options.text).toBe('Hello')
    expect(instance.options.style).toMatchObject({ color: 'red' })
    expect(instance.options.offset).toBeInstanceOf(AMap.Pixel)
    expect((instance.options.offset as AMap.Pixel).getX()).toBe(0)
    expect((instance.options.offset as AMap.Pixel).getY()).toBe(-20)

    harness.options.value = {
      ...harness.options.value,
      text: 'Updated',
      style: { color: 'blue' },
      visible: false,
    }
    await flushReactivity()

    expect(instance.options.text).toBe('Updated')
    expect(instance.options.style).toMatchObject({ color: 'blue' })
    expect(instance.options.visible).toBe(false)

    harness.hook.setText('Manual')
    expect(instance.options.text).toBe('Manual')

    harness.hook.setStyle({ color: 'green' })
    expect(instance.options.style).toMatchObject({ color: 'green' })

    harness.hook.setOffset([12, -12])
    expect(instance.options.offset).toBeInstanceOf(AMap.Pixel)
    expect((instance.options.offset as AMap.Pixel).getX()).toBe(12)
    expect((instance.options.offset as AMap.Pixel).getY()).toBe(-12)

    harness.hook.show()
    expect(instance.options.visible).toBe(true)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()

    harness.cleanup()
  })
})
