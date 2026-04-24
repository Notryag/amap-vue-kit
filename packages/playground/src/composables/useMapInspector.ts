import type { LngLatTuple } from '../types'
import { computed, reactive, ref, shallowRef } from 'vue'

interface BoundsSnapshot {
  southWest: LngLatTuple
  northEast: LngLatTuple
}

function describeLayer(layer: any): string {
  if (layer && typeof layer.CLASS_NAME === 'string')
    return layer.CLASS_NAME.replace(/^AMap\./, '')

  const constructorName = layer?.constructor?.name
  if (typeof constructorName === 'string' && constructorName.length)
    return constructorName.replace(/^AMap\./, '')

  if (typeof layer?.type === 'string' && layer.type.length)
    return layer.type

  return 'Layer'
}

function collectOverlayArray(raw: unknown): object[] {
  if (!raw)
    return []

  if (Array.isArray(raw))
    return raw.filter((value): value is object => typeof value === 'object' && value !== null)

  if (typeof raw === 'object') {
    const result: object[] = []

    for (const value of Object.values(raw as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        for (const entry of value) {
          if (typeof entry === 'object' && entry !== null)
            result.push(entry)
        }
      }
    }

    return result
  }

  return []
}

export function useMapInspector(hasKey: { value: boolean }) {
  const mapInstance = shallowRef<AMap.Map | null>(null)
  const mapBounds = shallowRef<BoundsSnapshot | null>(null)
  const inspectorLayers = ref<string[]>([])
  const overlayStats = reactive({ total: 0, added: 0, removed: 0 })

  const overlayRegistry = new Set<object>()
  let inspectorRefreshHandle: number | null = null

  const boundsText = computed(() => {
    const bounds = mapBounds.value
    if (!bounds)
      return '—'

    const [swLng, swLat] = bounds.southWest
    const [neLng, neLat] = bounds.northEast
    return `${swLng.toFixed(4)}, ${swLat.toFixed(4)} → ${neLng.toFixed(4)}, ${neLat.toFixed(4)}`
  })

  const mapInspectorStatusLabel = computed(() => {
    if (!hasKey.value)
      return 'No key'
    if (mapInstance.value)
      return 'Connected'
    return 'Waiting'
  })

  const mapInspectorStatusClass = computed(() => ({
    active: hasKey.value && Boolean(mapInstance.value),
    warning: !hasKey.value,
    pending: hasKey.value && !mapInstance.value,
  }))

  function captureMapBounds(map: AMap.Map) {
    const bounds = map.getBounds?.()

    if (!bounds || typeof bounds.getSouthWest !== 'function' || typeof bounds.getNorthEast !== 'function') {
      mapBounds.value = null
      return
    }

    const southWest = bounds.getSouthWest()
    const northEast = bounds.getNorthEast()

    if (!southWest || !northEast) {
      mapBounds.value = null
      return
    }

    mapBounds.value = {
      southWest: [
        Number(southWest.getLng().toFixed(6)),
        Number(southWest.getLat().toFixed(6)),
      ],
      northEast: [
        Number(northEast.getLng().toFixed(6)),
        Number(northEast.getLat().toFixed(6)),
      ],
    }
  }

  function refreshMapLayers(map: AMap.Map) {
    const layers = (map as any).getLayers?.()

    if (!Array.isArray(layers)) {
      inspectorLayers.value = []
      return
    }

    inspectorLayers.value = layers.map(layer => describeLayer(layer))
  }

  function refreshOverlayStats(map: AMap.Map) {
    const getter = (map as any).getAllOverlays

    if (typeof getter !== 'function') {
      overlayStats.total = overlayRegistry.size
      return
    }

    const overlays = collectOverlayArray(getter.call(map))
    const seen = new Set<object>(overlays)

    for (const overlay of overlays) {
      if (!overlayRegistry.has(overlay)) {
        overlayRegistry.add(overlay)
        overlayStats.added += 1
      }
    }

    for (const existing of Array.from(overlayRegistry)) {
      if (!seen.has(existing)) {
        overlayRegistry.delete(existing)
        overlayStats.removed += 1
      }
    }

    overlayStats.total = overlays.length
  }

  function updateInspectorSnapshot() {
    const map = mapInstance.value
    if (!map)
      return

    captureMapBounds(map)
    refreshMapLayers(map)
    refreshOverlayStats(map)
  }

  function scheduleInspectorRefresh() {
    if (typeof window === 'undefined' || !mapInstance.value)
      return

    if (inspectorRefreshHandle != null)
      return

    inspectorRefreshHandle = window.requestAnimationFrame(() => {
      inspectorRefreshHandle = null
      updateInspectorSnapshot()
    })
  }

  function resetMapInspector() {
    if (inspectorRefreshHandle != null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(inspectorRefreshHandle)
      inspectorRefreshHandle = null
    }

    mapInstance.value = null
    mapBounds.value = null
    inspectorLayers.value = []
    overlayRegistry.clear()

    overlayStats.total = 0
    overlayStats.added = 0
    overlayStats.removed = 0
  }

  function setMapInstance(map: AMap.Map) {
    mapInstance.value = map
    captureMapBounds(map)
    refreshMapLayers(map)
    refreshOverlayStats(map)
  }

  return {
    mapInstance,
    mapBounds,
    inspectorLayers,
    overlayStats,
    boundsText,
    mapInspectorStatusLabel,
    mapInspectorStatusClass,
    captureMapBounds,
    refreshOverlayStats,
    scheduleInspectorRefresh,
    resetMapInspector,
    setMapInstance,
  }
}
