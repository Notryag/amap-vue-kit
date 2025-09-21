import type { PixelLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toPixel, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface ControlLike {
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
  plugin?: string,
) {
  return function useSpecificControl(
    mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
    options: MaybeRefOrGetter<TOptions>,
  ): UseControlReturn<TControl> {
    const control = shallowRef<TControl | null>(null)
    const optionsRef = computed<TOptions>(() => ({
      ...(toValue(options) as TOptions | undefined ?? {}),
    }))
    let attachedMap: AMap.Map | null = null

    async function ensureControl(mapInstance: AMap.Map | null | undefined) {
      if (!isClient || control.value || !mapInstance)
        return

      try {
        const loadOptions = plugin ? { plugins: [plugin] } : undefined
        const AMapInstance = await loader.load(loadOptions)
        const { visible: _ignoredVisible, map: _ignoredMap, ...rest } = optionsRef.value as TOptions & { map?: AMap.Map }
        const instance = factory({ AMap: AMapInstance, options: rest as TOptions })
        control.value = instance
        attachToMap(mapInstance, instance)
        applyControlOptions(instance, optionsRef.value)
      }
      catch (error) {
        warn(error instanceof Error ? error.message : String(error))
      }
    }

    function attachToMap(mapInstance: AMap.Map, instance: TControl) {
      if (attachedMap && attachedMap !== mapInstance)
        detachFromMap()

      mapInstance.addControl(instance as any)
      instance.setMap?.(mapInstance)
      attachedMap = mapInstance
    }

    function detachFromMap() {
      if (control.value && attachedMap) {
        attachedMap.removeControl(control.value as any)
        control.value.setMap?.(null)
      }
      attachedMap = null
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
      if (control.value)
        applyControlOptions(control.value, value)
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
        control.value.destroy?.()
        control.value.setMap?.(null)
      }
      detachFromMap()
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

export function useMapType(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseMapTypeOptions>,
): UseControlReturn<ControlLike> {
  return createControlHook<ControlLike, UseMapTypeOptions>(
    ({ AMap, options: controlOptions }) => new (AMap as any).MapType(controlOptions),
    'AMap.MapType',
  )(mapRef, options)
}
