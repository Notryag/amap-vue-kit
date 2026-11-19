import type { UseIndoorMapOptions, UseIndoorMapReturn } from '../src/useIndoorMap'
import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, shallowRef } from 'vue'
import { useIndoorMap } from '../src/useIndoorMap'

class IndoorMap extends AMap.TileLayer implements AMap.IndoorMap {
  currentMap: AMap.Map | null = null
  selection: AMap.IndoorBuilding | null = null
  showFloorBar = vi.fn()
  hideFloorBar = vi.fn()
  showLabels = vi.fn()
  hideLabels = vi.fn()
  showIndoorMap = vi.fn()
  showFloor = vi.fn()
  destroy = vi.fn()

  setMap(map: AMap.Map) {
    this.currentMap = map
  }

  getMap() {
    return this.currentMap
  }

  getSelectedBuilding() {
    return this.selection
  }

  getSelectedBuildingId() {
    return this.selection?.id
  }
}

afterEach(() => vi.restoreAllMocks())

describe('useIndoorMap', () => {
  it('loads the plugin on demand, syncs building metadata and switches floors', async () => {
    const load = vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, IndoorMap })
    const map = shallowRef<AMap.Map | null>(null)
    const options = ref<UseIndoorMapOptions>({ hideFloorBar: true })
    const api = useIndoorMap(map, options)
    expect(load).not.toHaveBeenCalled()

    map.value = new AMap.Map(document.createElement('div'))
    await vi.waitFor(() => expect(api.overlay.value).toBeInstanceOf(IndoorMap))
    expect(load).toHaveBeenCalledExactlyOnceWith({
      plugins: ['AMap.IndoorMap'],
    })
    const layer = api.overlay.value as IndoorMap
    const emit = layer as unknown as { emit: (event: string) => void }
    expect(layer.getMap()).toBe(map.value)
    api.showIndoorMap('building-1', 1)
    expect(layer.showIndoorMap).toHaveBeenCalledExactlyOnceWith('building-1', 1, undefined)

    layer.selection = {
      id: 'building-1',
      name: 'Mall',
      floor: 1,
      floor_details: {
        floor_indexs: [-1, 1, 2],
        floor_names: ['B1', 'F1', 'F2'],
      },
    }
    emit.emit('floor_complete')
    expect(api.building.value?.floor).toBe(1)
    api.showFloor(-1)
    expect(layer.showFloor).toHaveBeenCalledExactlyOnceWith(-1)
    layer.selection.floor = -1
    emit.emit('floor_complete')
    expect(api.building.value?.floor).toBe(-1)

    layer.selection.id = 'building-2'
    api.showFloor(2)
    expect(layer.showIndoorMap).toHaveBeenLastCalledWith('building-2', 2, undefined)
    options.value.visible = false
    await nextTick()
    const show = vi.spyOn(layer, 'show')
    options.value.visible = true
    await nextTick()
    expect(show).toHaveBeenCalledTimes(1)
    expect(layer.hideFloorBar).toHaveBeenCalledTimes(1)
    api.destroy()
  })

  it('detaches the old layer and removes listeners on map replacement and unmount', async () => {
    vi.spyOn(loader, 'load').mockResolvedValue({ ...AMap, IndoorMap })
    const first = new AMap.Map(document.createElement('div'))
    const second = new AMap.Map(document.createElement('div'))
    const removeFirst = vi.spyOn(first, 'remove')
    const removeSecond = vi.spyOn(second, 'remove')
    const offFirst = vi.spyOn(first, 'off')
    const offSecond = vi.spyOn(second, 'off')
    const map = shallowRef(first)
    let api!: UseIndoorMapReturn
    const wrapper = mount(defineComponent({
      setup() {
        api = useIndoorMap(map)
        return () => null
      },
    }))
    await vi.waitFor(() => expect(api.overlay.value).toBeInstanceOf(IndoorMap))
    const oldLayer = api.overlay.value as IndoorMap
    const offOldLayer = vi.spyOn(oldLayer, 'off')
    map.value = second
    await vi.waitFor(() => expect(api.overlay.value?.getMap()).toBe(second))
    expect(removeFirst).toHaveBeenCalledExactlyOnceWith(oldLayer)
    expect(offFirst).toHaveBeenCalledWith('moveend', expect.any(Function))
    expect(offOldLayer).toHaveBeenCalledWith('floor_complete', expect.any(Function))
    expect(oldLayer.destroy).toHaveBeenCalledTimes(1)

    const newLayer = api.overlay.value as IndoorMap
    wrapper.unmount()
    expect(removeSecond).toHaveBeenCalledExactlyOnceWith(newLayer)
    expect(offSecond).toHaveBeenCalledWith('moveend', expect.any(Function))
    expect(newLayer.destroy).toHaveBeenCalledTimes(1)
    expect(api.building.value).toBeNull()
  })
})
