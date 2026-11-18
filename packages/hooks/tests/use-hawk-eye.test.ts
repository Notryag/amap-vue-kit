import { loader } from '@amap-vue/shared'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import { useHawkEye, useMapType } from '../src/useControl'

afterEach(() => vi.restoreAllMocks())

function createMap() {
  return new AMap.Map(document.createElement('div'))
}

describe('useHawkEye', () => {
  it('preserves MapType instances on visibility updates with an unchanged layer array', async () => {
    const options = reactive({
      visible: true,
      layers: [
        new AMap.TileLayer(),
      ],
    })
    const api = useMapType(createMap(), options)
    await flushPromises()
    const first = api.control.value
    options.visible = false
    await flushPromises()
    expect(api.control.value).toBe(first)
    options.layers.push(new AMap.TileLayer())
    await flushPromises()
    expect(api.control.value).not.toBe(first)
    api.destroy()
  })
  it('loads the plugin and controls visibility and expansion independently', async () => {
    const load = vi.spyOn(loader, 'load')
    const map = createMap()
    const options = reactive({ visible: false, isOpen: true })
    const api = useHawkEye(map, options)
    await flushPromises()
    const control = api.control.value as any
    expect(load).toHaveBeenCalledWith({
      plugins: ['AMap.HawkEye'],
    })
    expect(control.map).toBe(map)
    expect(control.visible).toBe(false)
    expect(control.isOpen).toBe(true)
    options.visible = true
    options.isOpen = false
    await nextTick()
    expect(api.control.value).toBe(control)
    expect(control.visible).toBe(true)
    expect(control.isOpen).toBe(false)
    api.open()
    expect(control.isOpen).toBe(true)
    api.close()
    expect(control.isOpen).toBe(false)
    api.destroy()
    expect(control.map).toBeNull()
    expect((map as any).controls.size).toBe(0)
  })

  it('recreates constructor-only options, including in-place offset updates', async () => {
    const options = reactive({
      width: '160px',
      offset: [10, 10] as [number, number],
    })
    const api = useHawkEye(createMap(), options)
    await flushPromises()
    const first = api.control.value as any
    options.offset[0] = 20
    await flushPromises()
    expect(api.control.value).not.toBe(first)
    expect(first.map).toBeNull()
    expect((api.control.value as any).options.offset).toEqual([20, 10])
    api.setOptions({ width: '220px', isOpen: true })
    await flushPromises()
    expect((api.control.value as any).options.width).toBe('220px')
    expect((api.control.value as any).isOpen).toBe(true)
    api.destroy()
  })

  it('moves the existing control to a replacement map', async () => {
    const first = createMap()
    const map = shallowRef(first)
    const api = useHawkEye(map)
    await flushPromises()
    const control = api.control.value as any
    map.value = createMap()
    await nextTick()
    expect(api.control.value).toBe(control)
    expect(control.map).toBe(map.value)
    expect((first as any).controls.size).toBe(0)
    api.destroy()
  })

  it.each([
    'switch',
    'remove',
    'destroy',
    'unmount',
  ])('ignores stale initialization on %s', async (action) => {
    let resolve!: (amap: typeof AMap) => void
    vi.spyOn(loader, 'load').mockReturnValue(new Promise((done) => {
      resolve = done
    }))
    const construct = vi.fn()
    const Original = AMap.HawkEye
    vi.spyOn(AMap, 'HawkEye').mockImplementation((options) => {
      construct()
      return new Original(options)
    })
    const initial = createMap()
    const map = shallowRef<AMap.Map | null>(initial)
    let api!: ReturnType<typeof useHawkEye>
    const wrapper = mount(defineComponent({
      setup() {
        api = useHawkEye(map)
        return () => null
      },
    }))
    if (action === 'switch')
      map.value = createMap()
    else if (action === 'remove')
      map.value = null
    else if (action === 'destroy')
      api.destroy()
    else
      wrapper.unmount()
    await nextTick()
    resolve(AMap)
    await flushPromises()
    expect(construct).toHaveBeenCalledTimes(action === 'switch'
      ? 1
      : 0)
    if (action === 'switch')
      expect((api.control.value as any).map).toBe(map.value)
    else
      expect(api.control.value).toBeNull()
    expect((initial as any).controls.size).toBe(0)
    if (action !== 'unmount')
      wrapper.unmount()
  })
})
