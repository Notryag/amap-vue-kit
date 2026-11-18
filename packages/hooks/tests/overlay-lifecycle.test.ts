import { loader } from '@amap-vue/shared'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import { useOverlay } from '../src/useOverlay'

afterEach(() => vi.restoreAllMocks())

function harness() {
  let resolve!: (amap: typeof AMap) => void
  vi.spyOn(loader, 'load').mockReturnValue(new Promise((done) => {
    resolve = done
  }))
  const map = shallowRef<AMap.Map | null>({} as AMap.Map)
  const factory = vi.fn((_context: { map: AMap.Map }) => ({
    setMap: vi.fn(),
    destroy: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }))
  let api!: ReturnType<typeof useOverlay<ReturnType<typeof factory>, Record<string, never>>>
  const wrapper = mount(defineComponent({
    setup() {
      api = useOverlay(map, {}, factory)
      return () => null
    },
  }))
  return { api, map, factory, wrapper, resolve }
}

describe('overlay asynchronous lifecycle', () => {
  it('creates on the latest map when it changes during loading', async () => {
    const test = harness()
    const latest = {} as AMap.Map
    test.map.value = latest
    await nextTick()
    test.resolve(AMap)
    await flushPromises()
    expect(test.factory).toHaveBeenCalledTimes(1)
    expect(test.factory.mock.calls[0]?.[0].map).toBe(latest)
    test.wrapper.unmount()
  })

  it('does not create when the map is removed during loading', async () => {
    const test = harness()
    test.map.value = null
    await nextTick()
    test.resolve(AMap)
    await flushPromises()
    expect(test.factory).not.toHaveBeenCalled()
    expect(test.api.overlay.value).toBeNull()
    test.wrapper.unmount()
  })

  it.each(['destroy', 'unmount'])('does not create after %s during loading', async (action) => {
    const test = harness()
    if (action === 'destroy')
      test.api.destroy()
    else
      test.wrapper.unmount()
    test.resolve(AMap)
    await flushPromises()
    expect(test.factory).not.toHaveBeenCalled()
    expect(test.api.overlay.value).toBeNull()
    if (action === 'destroy')
      test.wrapper.unmount()
  })
})
