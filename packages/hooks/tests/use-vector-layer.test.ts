import type { UseVectorLayerOptions, VectorOverlay } from '../src/useVectorLayer'
import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, shallowRef } from 'vue'
import { useVectorLayer } from '../src/useVectorLayer'

class VectorLayer extends AMap.TileLayer implements AMap.VectorLayer {
  members = new Set<VectorOverlay>()
  add = vi.fn((vectors: VectorOverlay | VectorOverlay[]) => [vectors].flat().forEach(vector => this.members.add(vector)))
  remove = vi.fn((vectors: VectorOverlay | VectorOverlay[]) => [vectors].flat().forEach(vector => this.members.delete(vector)))
  clear = vi.fn(() => this.members.clear())
  destroy = vi.fn()
  hide = vi.fn()
  show = vi.fn()
  setzIndex = vi.fn()
  getzIndex = vi.fn(() => 110)
  setOptions = vi.fn()
  query = vi.fn(() => [...this.members][0])
  getBounds = vi.fn(() => undefined)

  has(vector: VectorOverlay) {
    return this.members.has(vector)
  }
}

afterEach(() => vi.restoreAllMocks())

describe('useVectorLayer', () => {
  it('applies only changed vectors by native identity and keeps separately added members', async () => {
    vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, VectorLayer })
    const map = new AMap.Map(document.createElement('div'))
    const a = new AMap.Circle()
    const b = new AMap.Circle()
    const c = new AMap.Circle()
    const options = ref<UseVectorLayerOptions>({
      overlays: [a, a],
    })
    const api = useVectorLayer(map, options)
    await vi.waitFor(() => expect(api.has(a)).toBe(true))
    const layer = api.overlay.value as VectorLayer
    expect(layer.add).toHaveBeenCalledExactlyOnceWith([a])

    api.add(c)
    options.value.overlays = [a, b]
    await nextTick()
    expect(layer.add).toHaveBeenLastCalledWith([b])
    expect(layer.remove).not.toHaveBeenCalled()
    options.value.overlays = [b]
    options.value.visible = false
    options.value.zIndex = 120
    await nextTick()
    expect(layer.remove).toHaveBeenCalledExactlyOnceWith([a])
    expect(layer.hide).toHaveBeenCalledTimes(1)
    expect(layer.setzIndex).toHaveBeenCalledExactlyOnceWith(120)
    expect(api.has(c)).toBe(true)
    expect(api.query([116, 39])).toBe(c)
    api.clear()
    expect(api.has(b)).toBe(false)
    api.destroy()
  })

  it('reapplies declarative vectors when the map is replaced and detaches on unmount', async () => {
    vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, VectorLayer })
    const first = new AMap.Map(document.createElement('div'))
    const second = new AMap.Map(document.createElement('div'))
    const removeFirst = vi.spyOn(first, 'remove')
    const removeSecond = vi.spyOn(second, 'remove')
    const map = shallowRef(first)
    const vector = new AMap.Circle()
    let api!: ReturnType<typeof useVectorLayer>
    const wrapper = mount(defineComponent({
      setup() {
        api = useVectorLayer(map, {
          overlays: [vector],
        })
        return () => null
      },
    }))
    await vi.waitFor(() => expect(api.has(vector)).toBe(true))
    const oldLayer = api.overlay.value as VectorLayer
    map.value = second
    await vi.waitFor(() => {
      expect(api.overlay.value).not.toBe(oldLayer)
      expect(api.has(vector)).toBe(true)
    })
    expect(removeFirst).toHaveBeenCalledExactlyOnceWith(oldLayer)
    expect(oldLayer.clear).toHaveBeenCalledTimes(1)
    expect(oldLayer.destroy).toHaveBeenCalledTimes(1)
    const newLayer = api.overlay.value as VectorLayer
    wrapper.unmount()
    expect(removeSecond).toHaveBeenCalledExactlyOnceWith(newLayer)
    expect(newLayer.destroy).toHaveBeenCalledTimes(1)
    expect(api.overlay.value).toBeNull()
  })
})
