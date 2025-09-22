import { flushPromises as flushPendingPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, onBeforeUnmount, ref } from 'vue'

import { useEditorBezierCurve, useEditorPolygon, useEditorPolyline } from '../src/useEditor'

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

describe('useEditorPolyline', () => {
  it('creates a polyline editor and reacts to target changes', async () => {
    const { map, cleanup } = createMap()
    const path = [
      [116.38, 39.9],
      [116.4, 39.92],
      [116.42, 39.91],
    ]
    const polyline = new AMap.Polyline({ path })
    polyline.setMap(map)

    let hookReturn: ReturnType<typeof useEditorPolyline> | undefined

    const TestComponent = defineComponent({
      setup() {
        const mapRef = ref<AMap.Map | null>(map)
        const target = ref<AMap.Polyline | null>(polyline)
        hookReturn = useEditorPolyline(mapRef, () => ({
          target: target.value,
          active: true,
        }))

        onBeforeUnmount(() => {
          target.value?.destroy?.()
        })

        return () => null
      },
    })

    const wrapper = mount(TestComponent)

    const editor = await waitForInstance(() => hookReturn!.editor.value)
    expect(editor).toBeInstanceOf((AMap as any).PolylineEditor)
    expect(editor.getTarget()).not.toBeNull()
    expect(editor.getTarget()?.options.path).toEqual(polyline.options.path)

    hookReturn!.close()
    expect(hookReturn!.editor.value?.active).toBe(false)
    hookReturn!.open()
    expect(hookReturn!.editor.value?.active).toBe(true)

    hookReturn!.setTarget(null)
    expect(hookReturn!.editor.value?.getTarget()).toBeNull()

    hookReturn!.destroy()
    expect(hookReturn!.editor.value).toBeNull()

    wrapper.unmount()
    cleanup()
  })
})
describe('useEditorBezierCurve', () => {
  it('instantiates the Bezier curve editor', async () => {
    const { map, cleanup } = createMap()
    const curve = new (AMap as any).BezierCurve({
      path: [
        [
          [116.35, 39.9],
          [116.36, 39.94],
          [116.38, 39.95],
          [116.4, 39.93],
        ],
      ],
    })
    curve.setMap(map)

    let hookReturn: ReturnType<typeof useEditorBezierCurve> | undefined

    const TestComponent = defineComponent({
      setup() {
        const mapRef = ref<AMap.Map | null>(map)
        hookReturn = useEditorBezierCurve(mapRef, () => ({
          target: curve,
          active: true,
        }))

        onBeforeUnmount(() => {
          curve.destroy?.()
        })

        return () => null
      },
    })

    const wrapper = mount(TestComponent)

    const editor = await waitForInstance(() => hookReturn!.editor.value)
    expect(editor).toBeInstanceOf((AMap as any).BezierCurveEditor)
    expect(editor.getTarget()).toBe(curve)

    hookReturn!.close()
    expect(hookReturn!.editor.value?.active).toBe(false)
    hookReturn!.destroy()
    expect(hookReturn!.editor.value).toBeNull()

    wrapper.unmount()
    cleanup()
  })
})

describe('useEditorPolygon', () => {
  it('initialises polygon editor with overlay references', async () => {
    const { map, cleanup } = createMap()
    const polygon = new AMap.Polygon({
      path: [
        [116.37, 39.9],
        [116.41, 39.9],
        [116.4, 39.93],
      ],
    })
    polygon.setMap(map)

    let hookReturn: ReturnType<typeof useEditorPolygon> | undefined

    const TestComponent = defineComponent({
      setup() {
        const mapRef = ref<AMap.Map | null>(map)
        const active = ref(true)
        hookReturn = useEditorPolygon(mapRef, () => ({
          target: polygon,
          active: active.value,
        }))

        onBeforeUnmount(() => {
          polygon.destroy?.()
        })

        return () => null
      },
    })

    const wrapper = mount(TestComponent)

    const editor = await waitForInstance(() => hookReturn!.editor.value)
    expect(editor).toBeInstanceOf((AMap as any).PolygonEditor)
    expect(editor.getTarget()).toBe(polygon)

    hookReturn!.setTarget(null)
    expect(hookReturn!.editor.value?.getTarget()).toBeNull()

    hookReturn!.destroy()
    expect(hookReturn!.editor.value).toBeNull()

    wrapper.unmount()
    cleanup()
  })
})
