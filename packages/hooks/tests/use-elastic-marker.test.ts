import type { Ref } from 'vue'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useElasticMarker } from '../src/useElasticMarker'

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

describe('useElasticMarker', () => {
  it('creates and updates an elastic marker', async () => {
    const styles: AMap.ElasticMarkerStyles = {
      0: { icon: { img: 'icon.png', size: [20, 20], anchor: [10, 20] } },
      1: { icon: { img: 'icon-large.png', size: [30, 30], anchor: [15, 30] } },
    }

    const harness = mountHookWithMap((mapRef, options) => useElasticMarker(() => mapRef.value, options), {
      position: [116.397, 39.908] as [number, number],
      styles,
      zoomStyleMapping: { 10: 0, 13: 1 },
      visible: true,
    })

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('Elastic marker was not created')

    expect((instance as any).options.position).toBeDefined()
    expect((instance as any).options.styles).toEqual(styles)

    harness.options.value = {
      ...harness.options.value,
      zoomStyleMapping: { 10: 0, 14: 1 },
      visible: false,
    }
    await flushReactivity()

    expect((instance as any).options.zoomStyleMapping).toEqual({ 10: 0, 14: 1 })
    expect((instance as any).options.visible).toBe(false)

    harness.hook.setStyles({
      0: { icon: { img: 'other.png', size: [24, 24], anchor: [12, 24] } },
    })
    expect((instance as any).options.styles).toEqual({
      0: { icon: { img: 'other.png', size: [24, 24], anchor: [12, 24] } },
    })

    harness.hook.setZoomStyleMapping({ 11: 0 })
    expect((instance as any).options.zoomStyleMapping).toEqual({ 11: 0 })

    harness.hook.hide()
    expect((instance as any).options.visible).toBe(false)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()

    harness.cleanup()
  })
})
