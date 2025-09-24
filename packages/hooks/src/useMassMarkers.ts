import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, warn } from '@amap-vue/shared'
import { computed, shallowRef, toValue, watch } from 'vue'

export interface UseMassMarkersOptions {
  data?: AMap.MassData[]
  style?: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]
  options?: Partial<AMap.MassMarkersOptions>
  visible?: boolean
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseMassMarkersReturn {
  mass: ShallowRef<AMap.MassMarks | null>
  setData: (data: AMap.MassData[]) => void
  setStyle: (style: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]) => void
  setOptions: (options: Partial<AMap.MassMarkersOptions>) => void
  show: () => void
  hide: () => void
  destroy: () => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
}

interface ListenerRecord {
  event: string
  handler: (event: any) => void
}

export function useMassMarkers(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseMassMarkersOptions>,
): UseMassMarkersReturn {
  const mass = shallowRef<AMap.MassMarks | null>(null)
  const listeners = new Set<ListenerRecord>()
  const optionsRef = computed<UseMassMarkersOptions>(() => ({
    ...(toValue(options) as UseMassMarkersOptions | undefined ?? {}),
  }))

  let currentMap: AMap.Map | null = null
  let creating = false

  async function ensureMassMarkers(mapInstance: AMap.Map | null | undefined) {
    if (!isClient || mass.value || !mapInstance || creating)
      return

    creating = true
    try {
      const { data, style, options: massOptions, visible } = optionsRef.value
      const loaderOptions = optionsRef.value.loadOptions ? toValue(optionsRef.value.loadOptions) : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.MassMarks'] })
      if (!currentMap) {
        creating = false
        return
      }
      const instance = new (AMapInstance as any).MassMarks(data ?? [], {
        ...(massOptions ?? {}),
        map: visible === false ? null : mapInstance,
        style,
      }) as AMap.MassMarks
      mass.value = instance
      bindListeners(instance)
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
    }
    finally {
      creating = false
    }
  }

  function bindListeners(instance: AMap.MassMarks) {
    listeners.forEach(({ event, handler }) => (instance as any).on?.(event, handler))
  }

  function unbindListeners(instance: AMap.MassMarks | null) {
    if (!instance)
      return
    listeners.forEach(({ event, handler }) => (instance as any).off?.(event, handler))
  }

  watch(() => toValue(mapRef), (mapInstance) => {
    currentMap = mapInstance ?? null
    const instance = mass.value
    if (!mapInstance) {
      instance?.setMap(null)
      return
    }

    if (!instance) {
      void ensureMassMarkers(mapInstance)
      return
    }

    if (optionsRef.value.visible === false)
      instance.setMap(null)
    else
      instance.setMap(mapInstance)
  }, { immediate: true })

  watch(() => optionsRef.value.data, data => setData(data ?? []), { deep: true })
  watch(() => optionsRef.value.style, (style) => {
    if (style)
      setStyle(style)
  }, { deep: true })
  watch(() => optionsRef.value.options, (nextOptions) => {
    if (nextOptions)
      setOptions(nextOptions)
  }, { deep: true })
  watch(() => optionsRef.value.visible, (visible) => {
    if (visible === undefined)
      return
    if (!visible)
      hide()
    else
      show()
  })

  function setData(data: AMap.MassData[]) {
    mass.value?.setData(data)
  }

  function setStyle(style: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]) {
    const instance = mass.value
    if (!instance)
      return
    instance.setStyle(style as any)
  }

  function setOptions(options: Partial<AMap.MassMarkersOptions>) {
    if (!options)
      return
    mass.value?.setOptions?.(options)
  }

  function show() {
    const instance = mass.value
    if (!instance || !currentMap)
      return
    instance.setMap(currentMap)
  }

  function hide() {
    mass.value?.setMap(null)
  }

  function destroy() {
    const instance = mass.value
    if (instance) {
      unbindListeners(instance)
      instance.setMap(null)
      instance.destroy?.()
    }
    mass.value = null
  }

  function on(event: string, handler: (event: any) => void) {
    const record = { event, handler }
    listeners.add(record)
    mass.value?.on?.(event, handler)
  }

  function off(event: string, handler: (event: any) => void) {
    for (const record of Array.from(listeners)) {
      if (record.event === event && record.handler === handler) {
        listeners.delete(record)
        mass.value?.off?.(event, handler)
      }
    }
  }

  return {
    mass,
    setData,
    setStyle,
    setOptions,
    show,
    hide,
    destroy,
    on,
    off,
  }
}
