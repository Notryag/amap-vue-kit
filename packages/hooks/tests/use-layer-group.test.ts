import type { LayerGroupMember, UseLayerGroupOptions, UseLayerGroupReturn } from '../src/useLayerGroup'
import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, shallowRef } from 'vue'
import { useLayerGroup } from '../src/useLayerGroup'

class LayerGroup implements AMap.LayerGroup {
  private map: AMap.Map | null = null
  private layers: LayerGroupMember[] = []
  clearLayers = vi.fn()

  constructor(layers: LayerGroupMember[]) {
    this.layers = layers
  }

  setMap(map: AMap.Map) {
    this.map = map
    return this
  }

  getLayers() {
    return this.layers
  }

  hasLayer(layer: LayerGroupMember) {
    return this.layers.includes(layer)
  }

  addLayer(layer: LayerGroupMember) {
    this.layers.push(layer)
    layer.setMap(this.map)
  }

  addLayers(layers: LayerGroupMember[]) {
    layers.forEach(layer => this.addLayer(layer))
  }

  removeLayer(layer: LayerGroupMember) {
    const index = this.layers.indexOf(layer)
    if (index !== -1)
      this.layers.splice(index, 1)
    layer.setMap(null)
    return layer
  }

  removeLayers(layers: LayerGroupMember[]) {
    layers.forEach(layer => this.removeLayer(layer))
  }

  show() {
    this.layers.forEach(layer => layer.show())
    return this
  }

  hide() {
    this.layers.forEach(layer => layer.hide())
    return this
  }

  setOptions = vi.fn(() => this)
  on = vi.fn(() => this)
  reload = vi.fn(() => this)
}

function createLayer() {
  return {
    setMap: vi.fn<LayerGroupMember['setMap']>(),
    hide: vi.fn(),
    show: vi.fn(),
    on: vi.fn<AMap.Evented['on']>(),
    off: vi.fn<AMap.Evented['off']>(),
  }
}

afterEach(() => vi.restoreAllMocks())

describe('useLayerGroup', () => {
  it('syncs members by instance identity and applies group visibility to new members', async () => {
    vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, LayerGroup })
    const map = new AMap.Map(document.createElement('div'))
    const first = createLayer()
    const second = createLayer()
    const unrelated = createLayer()
    const options = ref<UseLayerGroupOptions>({
      layers: [first, first],
      visible: false,
    })
    const group = useLayerGroup(map, options)
    await vi.waitFor(() => expect(group.hasLayer(first)).toBe(true))
    expect(first.setMap).toHaveBeenCalledExactlyOnceWith(map)
    expect(first.hide).toHaveBeenCalledTimes(1)

    options.value.layers = [first, second]
    await nextTick()
    expect(first.setMap).toHaveBeenCalledTimes(1)
    expect(second.setMap).toHaveBeenCalledExactlyOnceWith(map)
    expect(second.hide).toHaveBeenCalledTimes(1)
    options.value.visible = true
    await nextTick()
    expect(first.show).toHaveBeenCalledTimes(1)
    expect(second.show).toHaveBeenCalledTimes(1)
    group.removeLayers([unrelated])
    expect(unrelated.setMap).not.toHaveBeenCalled()
    expect(group.getLayers()).toEqual([first, second])
    group.getLayers().pop()
    expect(group.hasLayer(second)).toBe(true)
    group.clearLayers()
    expect(group.getLayers()).toEqual([])
    expect(first.setMap).toHaveBeenLastCalledWith(null)
    expect(second.setMap).toHaveBeenLastCalledWith(null)
    group.destroy()
  })

  it('binds events to current members and unbinds events on replacement and unmount', async () => {
    vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, LayerGroup })
    const firstMap = new AMap.Map(document.createElement('div'))
    const secondMap = new AMap.Map(document.createElement('div'))
    const map = shallowRef(firstMap)
    const first = createLayer()
    const second = createLayer()
    const complete = vi.fn()
    const click = vi.fn()
    let group!: UseLayerGroupReturn
    const wrapper = mount(defineComponent({
      setup() {
        group = useLayerGroup(map, {
          layers: [first],
        })
        group.on('complete', complete)
        group.on('complete', complete)
        return () => null
      },
    }))
    await vi.waitFor(() => expect(group.hasLayer(first)).toBe(true))
    expect(first.on).toHaveBeenCalledExactlyOnceWith('complete', complete)
    group.on('click', click)
    group.addLayers([second])
    expect(second.on).toHaveBeenCalledWith('click', click)
    group.off('click', click)
    expect(first.off).toHaveBeenCalledWith('click', click)
    expect(second.off).toHaveBeenCalledWith('click', click)

    map.value = secondMap
    await vi.waitFor(() => expect(first.setMap.mock.lastCall?.[0]).toBe(secondMap))
    expect(first.off).toHaveBeenCalledWith('complete', complete)
    expect(second.off).toHaveBeenCalledWith('complete', complete)
    expect(second.setMap).toHaveBeenLastCalledWith(null)
    expect(first.on.mock.calls.filter(([event]) => event === 'complete')).toHaveLength(2)
    wrapper.unmount()
    expect(first.setMap).toHaveBeenLastCalledWith(null)
    expect(first.off).toHaveBeenCalledTimes(3)
  })
})
