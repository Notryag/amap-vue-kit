import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseHeatMapOptions extends Partial<AMap.HeatMapOptions> {
  visible?: boolean
  data?: AMap.HeatMapDataPoint[]
  max?: number
}

export interface UseHeatMapReturn extends OverlayLifecycle<AMap.HeatMap> {
  show: () => void
  hide: () => void
  setOptions: (options: Partial<AMap.HeatMapOptions>) => void
  setDataSet: (dataSet: AMap.HeatMapDataSet) => void
  addDataPoint: (point: AMap.HeatMapDataPoint) => void
}

interface HeatMapState {
  data?: AMap.HeatMapDataPoint[]
  max?: number
  visible?: boolean
}

function hasOwn(target: object, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(target, key)
}

function buildDataSet(data: AMap.HeatMapDataPoint[] | undefined, max: number | undefined): AMap.HeatMapDataSet | null {
  if (data == null && max == null)
    return null
  const dataset: AMap.HeatMapDataSet = { data: data ?? [] }
  if (max != null)
    dataset.max = max
  return dataset
}

function applyHeatMapOptions(
  instance: AMap.HeatMap,
  options: UseHeatMapOptions,
  state: HeatMapState,
) {
  const { visible, data, max, ...rest } = options
  const hasData = hasOwn(options, 'data')
  const hasMax = hasOwn(options, 'max')

  if (Object.keys(rest).length)
    (instance as any).setOptions?.(rest)

  if (hasData)
    state.data = data
  if (hasMax)
    state.max = max

  if (hasData || (hasMax && state.data !== undefined)) {
    const dataset = buildDataSet(state.data, hasMax ? max : state.max)
    if (dataset)
      (instance as any).setDataSet?.(dataset)
  }

  if (visible != null) {
    state.visible = visible
    if (visible)
      (instance as any).show?.()
    else
      (instance as any).hide?.()
  }
}

export function useHeatMap(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseHeatMapOptions>,
): UseHeatMapReturn {
  const optionsRef = computed<UseHeatMapOptions>(() => ({
    ...(toValue(options) as UseHeatMapOptions | undefined ?? {}),
  }))

  const state: HeatMapState = {}
  const initialOptions = optionsRef.value
  if (hasOwn(initialOptions, 'data'))
    state.data = initialOptions.data
  if (hasOwn(initialOptions, 'max'))
    state.max = initialOptions.max
  if (hasOwn(initialOptions, 'visible'))
    state.visible = initialOptions.visible

  const overlay = useOverlay(
    mapRef,
    optionsRef,
    ({ AMap, map, options: heatMapOptions }) => {
      const { visible, data, max, ...rest } = heatMapOptions

      if (hasOwn(heatMapOptions, 'data'))
        state.data = data
      if (hasOwn(heatMapOptions, 'max'))
        state.max = max
      if (hasOwn(heatMapOptions, 'visible'))
        state.visible = visible

      const instance = new (AMap as any).HeatMap(map, rest)
      const dataset = buildDataSet(state.data, state.max)
      if (dataset)
        (instance as any).setDataSet?.(dataset)
      if (state.visible === false)
        instance.hide?.()
      return instance
    },
    (instance, nextOptions) => {
      applyHeatMapOptions(instance, nextOptions, state)
    },
    () => ({ plugins: ['AMap.HeatMap'] }),
  )

  function show() {
    state.visible = true
    overlay.overlay.value?.show?.()
  }

  function hide() {
    state.visible = false
    overlay.overlay.value?.hide?.()
  }

  function setOptions(options: Partial<AMap.HeatMapOptions>) {
    if (!options)
      return
    overlay.overlay.value?.setOptions?.(options)
  }

  function setDataSet(dataSet: AMap.HeatMapDataSet) {
    if (!dataSet || !Array.isArray(dataSet.data))
      return
    state.data = dataSet.data
    if (hasOwn(dataSet, 'max'))
      state.max = dataSet.max
    const instance = overlay.overlay.value
    if (!instance)
      return
    const dataset = buildDataSet(state.data, state.max)
    if (dataset)
      (instance as any).setDataSet?.(dataset)
  }

  function addDataPoint(point: AMap.HeatMapDataPoint) {
    if (!point)
      return
    const instance = overlay.overlay.value as any
    if (!instance)
      return
    const { lng, lat, count } = point
    if (lng == null || lat == null || count == null)
      return
    instance.addDataPoint?.(lng, lat, count)
    const current = Array.isArray(state.data) ? state.data.slice() : []
    current.push(point)
    state.data = current
  }

  return {
    ...overlay,
    show,
    hide,
    setOptions,
    setDataSet,
    addDataPoint,
  }
}
