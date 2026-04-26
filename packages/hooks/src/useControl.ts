import type { PixelLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toPixel, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface ControlLike {
  addTo?: (map: AMap.Map) => void
  remove?: () => void
  removeFrom?: () => void
  show?: () => void
  hide?: () => void
  setMap?: (map: AMap.Map | null) => void
  setOffset?: (offset: AMap.Pixel) => void
  setPosition?: (position: any) => void
  setOptions?: (options: Record<string, any>) => void
  destroy?: () => void
}

export interface UseControlOptions extends Record<string, any> {
  visible?: boolean
  position?: any
  offset?: PixelLike
}

export interface UseControlReturn<TControl extends ControlLike> {
  control: ShallowRef<TControl | null>
  show: () => void
  hide: () => void
  setPosition: (position: any) => void
  setOffset: (offset: PixelLike | undefined) => void
  setOptions: (options: Record<string, any>) => void
  destroy: () => void
}

interface CreateControlHookOptions<TOptions extends UseControlOptions> {
  plugin?: string
  cleanupAddedLayers?: boolean
  shouldRecreate?: (previous: TOptions, next: TOptions) => boolean
}

function applyControlOptions(control: ControlLike, options: UseControlOptions) {
  const { visible, position, offset, map: _ignoredMap, ...rest } = options

  if (position !== undefined && typeof control.setPosition === 'function')
    control.setPosition(position)

  if (offset !== undefined && typeof control.setOffset === 'function') {
    const AMapInstance = loader.get()
    const resolved = AMapInstance ? toPixel(AMapInstance, offset) : offset
    control.setOffset(resolved as any)
  }

  if (visible != null) {
    if (visible)
      control.show?.()
    else
      control.hide?.()
  }

  if (Object.keys(rest).length)
    control.setOptions?.(rest)
}

function createControlHook<TControl extends ControlLike, TOptions extends UseControlOptions>(
  factory: (context: { AMap: typeof AMap, options: TOptions }) => TControl,
  config: string | CreateControlHookOptions<TOptions> = {},
) {
  const hookOptions = typeof config === 'string' ? { plugin: config } : config

  return function useSpecificControl(
    mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
    options: MaybeRefOrGetter<TOptions>,
  ): UseControlReturn<TControl> {
    const control = shallowRef(null) as ShallowRef<TControl | null>
    const optionsRef = computed<TOptions>(() => ({
      ...(toValue(options) as TOptions | undefined ?? {}),
    }) as TOptions)
    let attachedMap: AMap.Map | null = null
    let trackedAddedLayers = new Set<any>()
    let previousOptions = { ...optionsRef.value } as TOptions

    async function ensureControl(mapInstance: AMap.Map | null | undefined) {
      if (!isClient || control.value || !mapInstance)
        return

      try {
        const loadOptions = hookOptions.plugin ? { plugins: [hookOptions.plugin] } : undefined
        const AMapInstance = await loader.load(loadOptions)
        const { visible: _ignoredVisible, map: _ignoredMap, ...rest } = optionsRef.value as TOptions & { map?: AMap.Map }
        const instance = factory({ AMap: AMapInstance, options: rest as TOptions })
        control.value = instance
        attachToMap(mapInstance, instance)
        applyControlOptions(instance, optionsRef.value)
        previousOptions = { ...optionsRef.value } as TOptions
      }
      catch (error) {
        warn(error instanceof Error ? error.message : String(error))
      }
    }

    function attachToMap(mapInstance: AMap.Map, instance: TControl) {
      if (attachedMap && attachedMap !== mapInstance)
        detachFromMap()

      const previousLayers = hookOptions.cleanupAddedLayers ? getLayerSet(mapInstance) : null

      if (typeof instance.addTo === 'function')
        instance.addTo(mapInstance)
      else if (typeof mapInstance.addControl === 'function')
        mapInstance.addControl(instance as any)
      else
        instance.setMap?.(mapInstance)

      attachedMap = mapInstance

      if (previousLayers) {
        trackAddedLayers(mapInstance, previousLayers)
        scheduleLayerTracking(mapInstance, previousLayers)
      }
    }

    function detachFromMap() {
      const mapInstance = attachedMap

      if (control.value && mapInstance) {
        if (typeof control.value.remove === 'function')
          control.value.remove()
        else if (typeof control.value.removeFrom === 'function')
          control.value.removeFrom()
        else if (typeof mapInstance.removeControl === 'function')
          mapInstance.removeControl(control.value as any)
        else
          control.value.setMap?.(null)

        cleanupTrackedLayers(mapInstance)
      }
      attachedMap = null
    }

    function getLayers(mapInstance: AMap.Map): any[] {
      const layers = (mapInstance as any).getLayers?.()
      return Array.isArray(layers) ? layers : []
    }

    function getLayerSet(mapInstance: AMap.Map): Set<any> {
      return new Set(getLayers(mapInstance))
    }

    function trackAddedLayers(mapInstance: AMap.Map, previousLayers: Set<any>) {
      if (!hookOptions.cleanupAddedLayers)
        return

      for (const layer of getLayers(mapInstance)) {
        if (!previousLayers.has(layer))
          trackedAddedLayers.add(layer)
      }
    }

    function scheduleLayerTracking(mapInstance: AMap.Map, previousLayers: Set<any>) {
      if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function')
        return

      window.requestAnimationFrame(() => {
        if (attachedMap === mapInstance)
          trackAddedLayers(mapInstance, previousLayers)
      })
    }

    function cleanupTrackedLayers(mapInstance: AMap.Map) {
      if (!trackedAddedLayers.size)
        return

      const currentLayers = getLayerSet(mapInstance)
      for (const layer of trackedAddedLayers) {
        if (!currentLayers.has(layer))
          continue

        if (typeof (mapInstance as any).removeLayer === 'function')
          (mapInstance as any).removeLayer(layer)
        else if (typeof (mapInstance as any).remove === 'function')
          (mapInstance as any).remove(layer)
        else
          layer?.setMap?.(null)
      }

      trackedAddedLayers = new Set()
    }

    watch(() => toValue(mapRef), (mapInstance) => {
      if (!mapInstance) {
        detachFromMap()
        return
      }

      if (control.value)
        attachToMap(mapInstance, control.value)
      else
        ensureControl(mapInstance)
    }, { immediate: true })

    watch(optionsRef, (value) => {
      if (!control.value)
        return

      if (hookOptions.shouldRecreate?.(previousOptions, value)) {
        const mapInstance = attachedMap
        destroy()
        if (mapInstance)
          void ensureControl(mapInstance)
        previousOptions = { ...value } as TOptions
        return
      }

      applyControlOptions(control.value, value)
      previousOptions = { ...value } as TOptions
    }, { deep: true })

    onBeforeUnmount(() => {
      destroy()
    })

    function show() {
      control.value?.show?.()
    }

    function hide() {
      control.value?.hide?.()
    }

    function setPosition(position: any) {
      if (position === undefined)
        return
      control.value?.setPosition?.(position)
    }

    function setOffset(offset: PixelLike | undefined) {
      if (offset === undefined)
        return
      const AMapInstance = loader.get()
      const resolved = AMapInstance ? toPixel(AMapInstance, offset) : offset
      control.value?.setOffset?.(resolved as any)
    }

    function setOptions(options: Record<string, any>) {
      if (!options)
        return
      control.value?.setOptions?.(options)
    }

    function destroy() {
      if (control.value) {
        control.value.hide?.()
      }
      detachFromMap()
      control.value?.destroy?.()
      control.value = null
    }

    return {
      control,
      show,
      hide,
      setPosition,
      setOffset,
      setOptions,
      destroy,
    }
  }
}

export interface UseToolBarOptions extends UseControlOptions {}

export function useToolBar(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseToolBarOptions>,
): UseControlReturn<ControlLike> {
  return createControlHook<ControlLike, UseToolBarOptions>(
    ({ AMap, options: controlOptions }) => new (AMap as any).ToolBar(controlOptions),
    'AMap.ToolBar',
  )(mapRef, options)
}

export interface UseScaleOptions extends UseControlOptions {}

export function useScale(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseScaleOptions>,
): UseControlReturn<ControlLike> {
  return createControlHook<ControlLike, UseScaleOptions>(
    ({ AMap, options: controlOptions }) => new (AMap as any).Scale(controlOptions),
    'AMap.Scale',
  )(mapRef, options)
}

export interface UseControlBarOptions extends UseControlOptions {}

export function useControlBar(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseControlBarOptions>,
): UseControlReturn<ControlLike> {
  return createControlHook<ControlLike, UseControlBarOptions>(
    ({ AMap, options: controlOptions }) => new (AMap as any).ControlBar(controlOptions),
    'AMap.ControlBar',
  )(mapRef, options)
}

export interface UseMapTypeOptions extends UseControlOptions {}

const MAP_TYPE_RECREATE_OPTIONS = ['defaultType', 'showTraffic', 'showRoad', 'layers'] as const

export function useMapType(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseMapTypeOptions>,
): UseControlReturn<ControlLike> {
  return createControlHook<ControlLike, UseMapTypeOptions>(
    ({ AMap, options: controlOptions }) => new (AMap as any).MapType(controlOptions),
    {
      plugin: 'AMap.MapType',
      cleanupAddedLayers: true,
      shouldRecreate: (previous, next) => MAP_TYPE_RECREATE_OPTIONS.some(key => previous[key] !== next[key]),
    },
  )(mapRef, options)
}
