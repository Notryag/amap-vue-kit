import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { loader, toLngLat } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface MarkerClusterPoint {
  position: LngLatLike
  extData?: any
  markerOptions?: Partial<AMap.MarkerOptions>
}

export interface UseMarkerClustererOptions extends Partial<AMap.MarkerClusterOptions> {
  points?: MarkerClusterPoint[]
  markers?: AMap.Marker[]
  visible?: boolean
}

export interface UseMarkerClustererReturn {
  cluster: ShallowRef<AMap.MarkerCluster | null>
  setPoints: (points: MarkerClusterPoint[] | undefined) => void
  setMarkers: (markers: AMap.Marker[] | undefined) => void
  setOptions: (options: Partial<AMap.MarkerClusterOptions>) => void
  show: () => void
  hide: () => void
  destroy: () => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
}

export function useMarkerClusterer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseMarkerClustererOptions>,
): UseMarkerClustererReturn {
  const cluster = shallowRef<AMap.MarkerCluster | null>(null)
  const optionsRef = computed<UseMarkerClustererOptions>(() => ({
    ...(toValue(options) as UseMarkerClustererOptions | undefined ?? {}),
  }))

  let currentMap: AMap.Map | null = null
  let createdMarkers: AMap.Marker[] = []
  const listeners = new Set<{ event: string, handler: (event: any) => void }>()

  async function ensureCluster(mapInstance: AMap.Map | null | undefined) {
    if (!mapInstance || cluster.value)
      return

    const { markers, points, visible, ...rest } = optionsRef.value
    const AMapInstance = await loader.load({ plugins: ['AMap.MarkerCluster'] })
    const markerList = markers ?? buildMarkers(AMapInstance, points ?? [])
    if (!markers) {
      createdMarkers = markerList
    }

    const instance = new (AMapInstance as any).MarkerCluster(mapInstance, markerList, rest)
    if (visible === false)
      instance.setMap(null)
    bindListeners(instance)
    cluster.value = instance
  }

  function bindListeners(instance: AMap.MarkerCluster) {
    for (const { event, handler } of listeners)
      (instance as any).on?.(event, handler)
  }

  function unbindListeners(instance: AMap.MarkerCluster) {
    for (const { event, handler } of listeners)
      (instance as any).off?.(event, handler)
  }

  function buildMarkers(AMapInstance: typeof AMap, points: MarkerClusterPoint[]): AMap.Marker[] {
    destroyCreatedMarkers()
    return points.map((point) => {
      const position = toLngLat(AMapInstance, point.position) ?? point.position
      return new AMapInstance.Marker({
        position,
        extData: point.extData,
        ...(point.markerOptions ?? {}),
      })
    })
  }

  function destroyCreatedMarkers() {
    createdMarkers.forEach((marker) => {
      marker.setMap?.(null)
      marker.destroy?.()
    })
    createdMarkers = []
  }

  watch(() => toValue(mapRef), (mapInstance) => {
    currentMap = mapInstance ?? null
    if (!mapInstance) {
      cluster.value?.setMap(null)
      return
    }

    if (cluster.value)
      cluster.value.setMap(mapInstance)
    else
      void ensureCluster(mapInstance)
  }, { immediate: true })

  watch(() => optionsRef.value.markers, (value) => {
    if (!value)
      return
    destroyCreatedMarkers()
    cluster.value?.setMarkers(value)
  }, { deep: true })

  watch(() => optionsRef.value.points, (value) => {
    if (!value)
      return
    const AMapInstance = loader.get()
    if (!AMapInstance)
      return
    const markers = buildMarkers(AMapInstance, value)
    if (!cluster.value) {
      if (currentMap)
        void ensureCluster(currentMap)
      return
    }
    cluster.value.setMarkers(markers)
  }, { deep: true })

  watch(() => optionsRef.value.visible, (visible) => {
    if (visible == null)
      return
    if (!cluster.value)
      return
    if (visible && currentMap)
      cluster.value.setMap(currentMap)
    else
      cluster.value.setMap(null)
  })

  watch(optionsRef, (value) => {
    if (!cluster.value)
      return
    const { markers, points, visible, ...rest } = value
    if (Object.keys(rest).length)
      cluster.value.setOptions(rest)
  }, { deep: true })

  onBeforeUnmount(() => {
    destroy()
  })

  function setPoints(points: MarkerClusterPoint[] | undefined) {
    if (!points) {
      cluster.value?.clearMarkers()
      destroyCreatedMarkers()
      return
    }
    const AMapInstance = loader.get()
    if (!AMapInstance)
      return
    const markers = buildMarkers(AMapInstance, points)
    if (!cluster.value) {
      if (currentMap)
        void ensureCluster(currentMap)
      return
    }
    cluster.value.setMarkers(markers)
  }

  function setMarkers(markers: AMap.Marker[] | undefined) {
    if (!markers) {
      cluster.value?.clearMarkers()
      destroyCreatedMarkers()
      return
    }
    destroyCreatedMarkers()
    cluster.value?.setMarkers(markers)
  }

  function setOptions(options: Partial<AMap.MarkerClusterOptions>) {
    cluster.value?.setOptions(options)
  }

  function show() {
    if (currentMap)
      cluster.value?.setMap(currentMap)
  }

  function hide() {
    cluster.value?.setMap(null)
  }

  function destroy() {
    const instance = cluster.value
    if (instance) {
      unbindListeners(instance)
      instance.clearMarkers()
      instance.setMap(null)
    }
    cluster.value = null
    destroyCreatedMarkers()
  }

  function on(event: string, handler: (event: any) => void) {
    const record = { event, handler }
    listeners.add(record)
    cluster.value?.on?.(event, handler)
  }

  function off(event: string, handler: (event: any) => void) {
    for (const record of Array.from(listeners)) {
      if (record.event === event && record.handler === handler) {
        cluster.value?.off?.(event, handler)
        listeners.delete(record)
      }
    }
  }

  return {
    cluster,
    setPoints,
    setMarkers,
    setOptions,
    show,
    hide,
    destroy,
    on,
    off,
  }
}
