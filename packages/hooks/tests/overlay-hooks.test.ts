import type { Ref } from 'vue'

import type { UseCircleOptions } from '../src/useCircle'
import type { UseEllipseOptions } from '../src/useEllipse'
import type { UseInfoWindowOptions } from '../src/useInfoWindow'
import type { UsePolygonOptions } from '../src/usePolygon'
import type { UsePolylineOptions } from '../src/usePolyline'
import type { UseRectangleOptions } from '../src/useRectangle'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useCircle } from '../src/useCircle'
import { useEllipse } from '../src/useEllipse'
import { useInfoWindow } from '../src/useInfoWindow'
import { usePolygon } from '../src/usePolygon'
import { usePolyline } from '../src/usePolyline'
import { useRectangle } from '../src/useRectangle'

function createContainer() {
  const container = document.createElement('div')
  container.style.width = '400px'
  container.style.height = '300px'
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

describe('useInfoWindow', () => {
  it('creates and updates an info window instance', async () => {
    const harness = mountHookWithMap<UseInfoWindowOptions, ReturnType<typeof useInfoWindow>>(
      (mapRef, options) => useInfoWindow(mapRef, options),
      {
        position: [116.391, 39.907],
        open: true,
        content: 'Hello',
        offset: [12, 24],
        anchor: 'bottom-center',
      },
    )

    const instance = await waitForInstance(() => harness.hook.infoWindow.value)
    if (!instance)
      throw new Error('InfoWindow instance was not created')

    expect(instance).toBeInstanceOf(AMap.InfoWindow)
    expect(instance.map?.container).toBe(harness.map.container)
    expect(instance.opened).toBe(true)
    expect(instance.position).toBeInstanceOf(AMap.LngLat)
    expect(instance.content).toBe('Hello')
    expect(instance.offset).toBeInstanceOf(AMap.Pixel)

    harness.options.value = {
      ...harness.options.value,
      open: false,
      content: 'Updated',
      offset: [30, 40],
    }
    await flushReactivity()
    expect(instance.opened).toBe(false)
    expect(instance.content).toBe('Updated')
    expect(instance.offset).toBeInstanceOf(AMap.Pixel)

    harness.hook.setContent('Manual')
    expect(instance.content).toBe('Manual')

    harness.hook.setPosition([120, 30])
    expect(instance.position).toBeInstanceOf(AMap.LngLat)

    harness.hook.open()
    expect(instance.opened).toBe(true)

    harness.mapRef.value = null
    await flushReactivity()
    expect(instance.map).toBeNull()
    expect(instance.opened).toBe(false)

    harness.mapRef.value = harness.map
    await flushReactivity()
    expect(instance.map?.container).toBe(harness.map.container)

    harness.hook.destroy()
    expect(harness.hook.infoWindow.value).toBeNull()
    harness.cleanup()
  })
})

describe('usePolyline', () => {
  it('manages a polyline overlay lifecycle', async () => {
    const path: UsePolylineOptions['path'] = [
      [116.38, 39.9],
      [116.4, 39.92],
    ]

    const harness = mountHookWithMap<UsePolylineOptions, ReturnType<typeof usePolyline>>(
      (mapRef, options) => usePolyline(mapRef, options),
      {
        path,
        strokeWeight: 4,
      },
    )

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('Polyline instance was not created')

    expect(instance).toBeInstanceOf(AMap.Polyline)
    expect(instance.map?.container).toBe(harness.map.container)
    expect(instance.options.path).toHaveLength(2)
    expect(instance.options.path?.[0]).toBeInstanceOf(AMap.LngLat)

    harness.options.value = {
      ...harness.options.value,
      visible: false,
      path: [
        [117.1, 40.1],
        [117.3, 40.3],
      ],
    }
    await flushReactivity()
    expect(instance.options.visible).toBe(false)
    expect(instance.options.path?.[0]).toBeInstanceOf(AMap.LngLat)

    harness.hook.setExtData({ id: 'polyline' })
    expect(instance.options.extData).toEqual({ id: 'polyline' })

    harness.hook.hide()
    expect(instance.options.visible).toBe(false)
    harness.hook.show()
    expect(instance.options.visible).toBe(true)

    harness.hook.setPath([
      [118.1, 41.1],
      [118.2, 41.2],
    ])
    expect(instance.options.path?.[0]).toBeInstanceOf(AMap.LngLat)

    harness.mapRef.value = null
    await flushReactivity()
    expect(instance.map).toBeNull()

    harness.mapRef.value = harness.map
    await flushReactivity()
    expect(instance.map?.container).toBe(harness.map.container)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()
    expect(instance.map).toBeNull()
    harness.cleanup()
  })
})

describe('usePolygon', () => {
  it('creates and updates polygon paths', async () => {
    const harness = mountHookWithMap<UsePolygonOptions, ReturnType<typeof usePolygon>>(
      (mapRef, options) => usePolygon(mapRef, options),
      {
        path: [
          [116.38, 39.9],
          [116.4, 39.92],
          [116.42, 39.95],
        ],
      },
    )

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('Polygon instance was not created')

    expect(instance).toBeInstanceOf(AMap.Polygon)
    expect(instance.map?.container).toBe(harness.map.container)
    expect(Array.isArray(instance.options.path)).toBe(true)
    expect((instance.options.path as any[])[0]).toBeInstanceOf(AMap.LngLat)

    harness.options.value = {
      ...harness.options.value,
      path: [
        [
          [117.1, 40.1],
          [117.2, 40.1],
          [117.2, 40.2],
        ],
        [
          [118.1, 41.1],
          [118.2, 41.1],
          [118.2, 41.2],
        ],
      ],
      visible: false,
    }
    await flushReactivity()

    expect(instance.options.visible).toBe(false)
    const nextPath = instance.options.path as any[]
    expect(Array.isArray(nextPath[0])).toBe(true)
    expect(nextPath[0][0]).toBeInstanceOf(AMap.LngLat)

    harness.hook.setExtData({ id: 'polygon' })
    expect(instance.options.extData).toEqual({ id: 'polygon' })

    harness.hook.hide()
    expect(instance.options.visible).toBe(false)
    harness.hook.show()
    expect(instance.options.visible).toBe(true)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()
    expect(instance.map).toBeNull()
    harness.cleanup()
  })
})

describe('useCircle', () => {
  it('tracks circle updates and visibility', async () => {
    const harness = mountHookWithMap<UseCircleOptions, ReturnType<typeof useCircle>>(
      (mapRef, options) => useCircle(mapRef, options),
      {
        center: [116.38, 39.9],
        radius: 500,
        visible: false,
      },
    )

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('Circle instance was not created')

    expect(instance).toBeInstanceOf(AMap.Circle)
    expect(instance.map?.container).toBe(harness.map.container)
    expect(instance.options.center).toBeInstanceOf(AMap.LngLat)
    expect(instance.options.radius).toBe(500)
    expect(instance.options.visible).toBe(false)

    harness.options.value = {
      ...harness.options.value,
      radius: 800,
      visible: true,
    }
    await flushReactivity()
    expect(instance.options.radius).toBe(800)
    expect(instance.options.visible).toBe(true)

    harness.hook.setCenter([120.1, 30.2])
    expect(instance.options.center).toBeInstanceOf(AMap.LngLat)

    harness.hook.setRadius(1000)
    expect(instance.options.radius).toBe(1000)

    harness.hook.setOptions({ strokeWeight: 6 })
    expect(instance.options.strokeWeight).toBe(6)

    harness.hook.setExtData({ id: 'circle' })
    expect(instance.options.extData).toEqual({ id: 'circle' })

    harness.hook.hide()
    expect(instance.options.visible).toBe(false)
    harness.hook.show()
    expect(instance.options.visible).toBe(true)

    harness.mapRef.value = null
    await flushReactivity()
    expect(instance.map).toBeNull()

    harness.mapRef.value = harness.map
    await flushReactivity()
    expect(instance.map?.container).toBe(harness.map.container)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()
    expect(instance.map).toBeNull()
    harness.cleanup()
  })
})

describe('useRectangle', () => {
  it('manages rectangle bounds and visibility', async () => {
    const harness = mountHookWithMap<UseRectangleOptions, ReturnType<typeof useRectangle>>(
      (mapRef, options) => useRectangle(mapRef, options),
      {
        bounds: [
          [116.38, 39.9],
          [116.42, 39.94],
        ],
        visible: true,
      },
    )

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('Rectangle instance was not created')

    expect(instance).toBeInstanceOf((AMap as any).Rectangle)
    expect(instance.map?.container).toBe(harness.map.container)
    expect(instance.options.bounds).toBeDefined()

    harness.options.value = {
      ...harness.options.value,
      bounds: [
        [117.1, 40.1],
        [117.3, 40.3],
      ],
      visible: false,
    }
    await flushReactivity()

    expect(instance.options.visible).toBe(false)
    expect(instance.options.bounds).toBeDefined()

    harness.hook.setBounds([
      [118.1, 41.1],
      [118.4, 41.4],
    ])
    expect(instance.options.bounds).toBeDefined()

    harness.hook.setOptions({ strokeWeight: 2 })
    expect(instance.options.strokeWeight).toBe(2)

    harness.hook.setExtData({ id: 'rectangle' })
    expect(instance.options.extData).toEqual({ id: 'rectangle' })

    harness.hook.hide()
    expect(instance.options.visible).toBe(false)
    harness.hook.show()
    expect(instance.options.visible).toBe(true)

    harness.mapRef.value = null
    await flushReactivity()
    expect(instance.map).toBeNull()

    harness.mapRef.value = harness.map
    await flushReactivity()
    expect(instance.map?.container).toBe(harness.map.container)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()
    expect(instance.map).toBeNull()
    harness.cleanup()
  })
})

describe('useEllipse', () => {
  it('handles ellipse radius and center updates', async () => {
    const harness = mountHookWithMap<UseEllipseOptions, ReturnType<typeof useEllipse>>(
      (mapRef, options) => useEllipse(mapRef, options),
      {
        center: [116.39, 39.91],
        radius: [1000, 600],
        visible: true,
      },
    )

    const instance = await waitForInstance(() => harness.hook.overlay.value)
    if (!instance)
      throw new Error('Ellipse instance was not created')

    expect(instance).toBeInstanceOf((AMap as any).Ellipse)
    expect(instance.map?.container).toBe(harness.map.container)
    expect(instance.options.center).toBeInstanceOf(AMap.LngLat)
    expect(Array.isArray(instance.options.radius)).toBe(true)

    harness.options.value = {
      ...harness.options.value,
      radius: [1500, 800],
      visible: false,
    }
    await flushReactivity()
    expect(instance.options.radius).toEqual([1500, 800])
    expect(instance.options.visible).toBe(false)

    harness.hook.setCenter([118.1, 31.2])
    expect(instance.options.center).toBeInstanceOf(AMap.LngLat)

    harness.hook.setRadius([1800, 900])
    expect(instance.options.radius).toEqual([1800, 900])

    harness.hook.setOptions({ strokeColor: '#f5222d' })
    expect(instance.options.strokeColor).toBe('#f5222d')

    harness.hook.setExtData({ id: 'ellipse' })
    expect(instance.options.extData).toEqual({ id: 'ellipse' })

    harness.hook.hide()
    expect(instance.options.visible).toBe(false)
    harness.hook.show()
    expect(instance.options.visible).toBe(true)

    harness.hook.destroy()
    expect(harness.hook.overlay.value).toBeNull()
    expect(instance.map).toBeNull()
    harness.cleanup()
  })
})
