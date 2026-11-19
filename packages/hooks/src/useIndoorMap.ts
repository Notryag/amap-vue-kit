import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { OverlayLifecycle } from './useOverlay'
import { warn } from '@amap-vue/shared'
import { shallowRef, toValue, watch } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseIndoorMapOptions extends AMap.IndoorMapOptions {
  /** Show or hide the layer. Defaults to true. */
  visible?: boolean
}

export type IndoorBuilding = AMap.IndoorBuilding

export interface UseIndoorMapReturn extends OverlayLifecycle<AMap.IndoorMap> {
  /** Building metadata reported by the layer, including its selected floor. */
  building: Readonly<ShallowRef<IndoorBuilding | null>>
  /** Opens a building by its indoor POI ID. Call after the layer is ready. */
  showIndoorMap: (indoorId: string, floor?: number, shopId?: string) => void
  /** Switches the selected building to this floor. Negative integers are basement floors. */
  showFloor: (floor: number) => void
}

/** Creates and manages a standalone AMap indoor layer. */
export function useIndoorMap(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseIndoorMapOptions> = {},
): UseIndoorMapReturn {
  const building = shallowRef<IndoorBuilding | null>(null)
  let openedId: string | undefined
  const api = useOverlay(
    map,
    options,
    ({ AMap, options: { visible: _visible, ...settings } }) => new AMap.IndoorMap(settings),
    undefined,
    {
      plugins: ['AMap.IndoorMap'],
    },
    {
      recreateOnMapChange: true,
      attach(map, layer) {
        layer.setMap(map)
        map.on('moveend', syncBuilding)
        if (toValue(options).visible === false)
          layer.hide()
      },
      // The SDK's IndoorMap.setMap() reads from its argument and rejects null.
      detach(map, layer) {
        map.off('moveend', syncBuilding)
        map.remove(layer)
        openedId = undefined
        building.value = null
      },
    },
  )
  const { overlay, on } = api
  function syncBuilding() {
    const selected = overlay.value?.getSelectedBuilding()
    // Copy the metadata so changes are observable even if the SDK reuses the object.
    building.value = selected
      ? { ...selected }
      : null
  }

  on('complete', syncBuilding)
  on('floor_complete', syncBuilding)
  watch(overlay, syncBuilding)

  watch([
    () => toValue(options).visible,
    () => toValue(options).hideFloorBar,
  ], ([visible, hidden], [previousVisible]) => {
    const layer = overlay.value
    if (!layer)
      return
    if (visible === false) {
      layer.hide()
      return
    }
    if (previousVisible === false)
      layer.show()
    if (hidden)
      layer.hideFloorBar()
    else
      layer.showFloorBar()
  })
  watch(() => toValue(options).opacity, value => overlay.value?.setOpacity(value ?? 1))
  watch(() => toValue(options).zIndex, (value) => {
    if (value !== undefined)
      overlay.value?.setzIndex(value)
  })

  function showIndoorMap(indoorId: string, floor?: number, shopId?: string) {
    if (!indoorId.trim() || (floor !== undefined && !Number.isInteger(floor))) {
      warn('useIndoorMap.showIndoorMap() requires a POI ID and an optional integer floor.')
      return
    }
    const layer = overlay.value
    if (!layer)
      return
    openedId = indoorId.trim()
    layer.showIndoorMap(openedId, floor, shopId)
  }

  function showFloor(floor: number) {
    if (!Number.isInteger(floor)) {
      warn('useIndoorMap.showFloor() requires an integer floor.')
      return
    }
    const layer = overlay.value
    if (!layer)
      return
    const selectedId = layer.getSelectedBuildingId()
    if (selectedId && selectedId !== openedId)
      showIndoorMap(selectedId, floor)
    else
      layer.showFloor(floor)
    syncBuilding()
  }

  return {
    ...api,
    building,
    showIndoorMap,
    showFloor,
  }
}
