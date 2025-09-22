import type { BezierCurvePath } from '@amap-vue/shared'
import type { Ref } from 'vue'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useBezierCurve } from '../src/useBezierCurve'

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

const basePath: BezierCurvePath = [
  [
    [116.35, 39.9],
    [116.36, 39.93],
    [116.39, 39.95],
    [116.42, 39.96],
  ],
]

describe('useBezierCurve', () => {
  it('creates and updates a bezier curve', async () => {
    const harness = mountHookWithMap((mapRef, options) => useBezierCurve(() => mapRef.value, options), {
      path: basePath,
      strokeColor: '#13c2c2',
      visible: true,
    })

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('BezierCurve instance was not created')

    expect(instance).toBeInstanceOf((AMap as any).BezierCurve)

    const newPath: BezierCurvePath = [
      [
        [116.4, 39.9],
        [116.42, 39.92],
        [116.44, 39.94],
        [116.46, 39.95],
      ],
    ]

    harness.options.value = {
      ...harness.options.value,
      path: newPath,
      visible: false,
    }
    await flushReactivity()

    expect((instance as any).options.path).toBeDefined()
    expect((instance as any).options.visible).toBe(false)

    harness.hook.setPath(basePath)
    harness.hook.show()
    expect((instance as any).options.visible).toBe(true)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()

    harness.cleanup()
  })
})
