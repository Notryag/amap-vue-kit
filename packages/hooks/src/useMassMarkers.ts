import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { isClient, loader, warn } from '@amap-vue/shared'
import { computed, shallowRef, toValue, watch } from 'vue'

export interface UseMassMarkersOptions {
  data: AMap.MassData[]
  style?: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]
  options?: Partial<AMap.MassMarkersOptions>
}

export interface UseMassMarkersReturn {
  mass: ShallowRef<AMap.MassMarks | null>
  setData: (data: AMap.MassData[]) => void
  setStyle: (style: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]) => void
  destroy: () => void
}

export function useMassMarkers(mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>, options: MaybeRefOrGetter<UseMassMarkersOptions>): UseMassMarkersReturn {
  const mass = shallowRef<AMap.MassMarks | null>(null)
  const optionsRef = computed<UseMassMarkersOptions>(() => ({
    ...(toValue(options) as UseMassMarkersOptions | undefined ?? {}),
  }))

  async function ensureMassMarkers(mapInstance: AMap.Map | null | undefined) {
    if (!isClient || mass.value || !mapInstance)
      return

    try {
      const { data, style, options: massOptions } = optionsRef.value
      const AMap = await loader.load({ plugins: ['AMap.MassMarks'] })
      const instance = new (AMap as any).MassMarks(data ?? [], {
        ...(massOptions ?? {}),
        map: mapInstance,
        style,
      }) as AMap.MassMarks
      mass.value = instance
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
    }
  }

  watch(() => toValue(mapRef), (mapInstance) => {
    if (!mapInstance) {
      mass.value?.setMap(null)
      return
    }

    if (mass.value)
      mass.value.setMap(mapInstance)
    else
      ensureMassMarkers(mapInstance)
  }, { immediate: true })

  watch(() => optionsRef.value.data, data => setData(data ?? []), { deep: true })
  watch(() => optionsRef.value.style, (style) => {
    if (style)
      setStyle(style)
  }, { deep: true })

  function setData(data: AMap.MassData[]) {
    mass.value?.setData(data)
  }

  function setStyle(style: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]) {
    if (!mass.value)
      return
    if (Array.isArray(style))
      mass.value.setStyle(style)
    else
      mass.value.setStyle(style)
  }

  function destroy() {
    mass.value?.destroy?.()
    mass.value = null
  }

  return {
    mass,
    setData,
    setStyle,
    destroy,
  }
}
