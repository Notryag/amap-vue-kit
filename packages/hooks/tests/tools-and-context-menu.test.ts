import type { Ref } from 'vue'

import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useContextMenu } from '../src/useContextMenu'
import { useMouseTool } from '../src/useMouseTool'
import { useRangingTool } from '../src/useRangingTool'

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

interface HookHarness<HookReturn> {
  hook: HookReturn
  map: AMap.Map
  mapRef: Ref<AMap.Map | null>
  cleanup: () => void
}

function mountHookWithMap<HookReturn>(
  factory: (mapRef: Ref<AMap.Map | null>) => HookReturn,
): HookHarness<HookReturn> {
  const { map, cleanup: disposeMap } = createMap()
  const context: Partial<HookHarness<HookReturn>> = {}

  const TestComponent = defineComponent({
    setup() {
      const mapRef = ref<AMap.Map | null>(map)
      const hook = factory(mapRef)

      Object.assign(context, {
        hook,
        map,
        mapRef,
      })

      return () => null
    },
  })

  const wrapper = mount(TestComponent)

  return {
    hook: context.hook!,
    map,
    mapRef: context.mapRef!,
    cleanup() {
      wrapper.unmount()
      disposeMap()
    },
  }
}

describe('useRangingTool', () => {
  it('starts, forwards results, and clears the instance when the map changes', async () => {
    const onEnd = vi.fn()
    const harness = mountHookWithMap(map => useRangingTool(map, {
      options: { startLabelText: 'From here' },
      onEnd,
    }))
    const tool = await waitForInstance(() => harness.hook.tool.value)
    const turnOn = vi.spyOn(tool, 'turnOn')
    const turnOff = vi.spyOn(tool, 'turnOff')

    await expect(harness.hook.start()).resolves.toBe(true)
    await expect(harness.hook.start()).resolves.toBe(true)
    expect(turnOn).toHaveBeenCalledTimes(1)
    expect(harness.hook.active.value).toBe(true)

    const result = {
      distance: 416,
      points: [
        new AMap.LngLat(120, 30),
        new AMap.LngLat(120.004, 30),
      ],
    }
    const complete = () => (tool as unknown as { emit: (event: string, payload: unknown) => void }).emit('end', result)
    complete()
    expect(onEnd).toHaveBeenCalledExactlyOnceWith(result)

    harness.hook.stop()
    expect(turnOff).toHaveBeenLastCalledWith(false)
    expect(harness.hook.active.value).toBe(false)

    harness.mapRef.value = null
    expect(turnOff).toHaveBeenLastCalledWith(true)
    expect(harness.hook.tool.value).toBeNull()
    complete()
    expect(onEnd).toHaveBeenCalledTimes(1)

    const replacement = createMap()
    harness.mapRef.value = replacement.map
    const nextTool = await waitForInstance(() => harness.hook.tool.value)
    expect(nextTool).not.toBe(tool)
    const clearReplacement = vi.spyOn(nextTool, 'turnOff')
    harness.cleanup()
    replacement.cleanup()
    expect(clearReplacement).toHaveBeenCalledExactlyOnceWith(true)
  })

  it('cancels a pending start on stop and a pending initialization on unmount', async () => {
    const stopped = mountHookWithMap(map => useRangingTool(map))
    const stoppedStart = stopped.hook.start()
    stopped.hook.stop()
    await expect(stoppedStart).resolves.toBe(false)
    expect(stopped.hook.active.value).toBe(false)
    stopped.cleanup()

    const disposed = mountHookWithMap(map => useRangingTool(map))
    const disposedStart = disposed.hook.start()
    disposed.cleanup()
    await expect(disposedStart).resolves.toBe(false)
    expect(disposed.hook.tool.value).toBeNull()
  })
})

describe('useMouseTool', () => {
  it('draws overlays using the mouse tool', async () => {
    const harness = mountHookWithMap(mapRef => useMouseTool(mapRef))

    const instance = await waitForInstance(() => harness.hook.tool.value)
    expect(instance).toBeInstanceOf((AMap as any).MouseTool)

    const circle = await harness.hook.drawCircle({
      radius: 500,
      center: [116.38, 39.9],
    })
    expect(circle).toBeInstanceOf(AMap.Circle)
    expect(circle?.map?.container).toBe(harness.map.container)

    const rectangle = await harness.hook.drawRectangle({
      bounds: [
        [116.36, 39.9],
        [116.4, 39.94],
      ],
    })
    expect(rectangle).toBeInstanceOf((AMap as any).Rectangle)
    expect(rectangle?.map?.container).toBe(harness.map.container)

    const polygon = await harness.hook.drawPolygon({
      path: [
        [116.35, 39.9],
        [116.38, 39.92],
        [116.36, 39.94],
      ],
    })
    expect(polygon).toBeInstanceOf(AMap.Polygon)

    const ellipse = await harness.hook.drawEllipse({
      center: [116.39, 39.91],
      radius: [800, 400],
    })
    expect(ellipse).toBeInstanceOf((AMap as any).Ellipse)

    harness.hook.close()
    harness.hook.destroy()
    expect(harness.hook.tool.value).toBeNull()
    harness.cleanup()
  })
})
describe('useContextMenu', () => {
  it('manages context menu lifecycle', async () => {
    const select = vi.fn()
    const harness = mountHookWithMap(mapRef => useContextMenu(mapRef, () => ({
      items: [
        { text: 'Zoom in', handler: select },
      ],
    })))

    const menu = await waitForInstance(() => harness.hook.menu.value)
    expect(menu).toBeInstanceOf((AMap as any).ContextMenu)
    expect(menu.items).toHaveLength(1)

    const extra = { text: 'Zoom out', handler: select }
    harness.hook.addItem(extra)
    expect(menu.items).toHaveLength(2)

    await harness.hook.open([116.38, 39.9])
    expect(menu.opened).toBe(true)

    harness.hook.removeItem(extra)
    expect(menu.items).toHaveLength(1)

    harness.hook.close()
    expect(menu.opened).toBe(false)

    harness.hook.destroy()
    expect(harness.hook.menu.value).toBeNull()
    harness.cleanup()
  })
})
