import type { PlaygroundState } from '../types'
import { watch } from 'vue'
import { performanceDatasets } from '../data/performance-datasets'
import {
  isControlPosition,
  isInfoWindowAnchor,
  isMapStyle,
  isMarkerDirection,
  isPanelId,
  isPerformanceRenderMode,
  isViewMode,
  toBoolean,
  toFiniteNumber,
  toLngLatTuple,
} from '../utils/validators'

const PLAYGROUND_STORAGE_KEY = 'amap-vue-kit:playground-state'
const PLAYGROUND_HASH_KEY = 'state'

type RestoreSource = 'hash' | 'storage'

export function usePlaygroundPersistence(ctx: {
  createPlaygroundState: () => PlaygroundState
  applyStateValues: (state: Partial<PlaygroundState>) => boolean
  logEvent: (source: 'State', summary: string, detail?: string) => void
}) {
  let persistencePaused = false
  let lastStoredState = ''

  function persistPlaygroundState(state: PlaygroundState, options: { force?: boolean } = {}) {
    if (typeof window === 'undefined')
      return

    if (persistencePaused && !options.force)
      return

    const serialized = JSON.stringify(state)

    if (!options.force && serialized === lastStoredState)
      return

    lastStoredState = serialized

    try {
      window.localStorage.setItem(PLAYGROUND_STORAGE_KEY, serialized)
    }
    catch {
      // Ignore storage quota or availability issues
    }

    const params = new URLSearchParams(window.location.hash.slice(1))
    params.set(PLAYGROUND_HASH_KEY, serialized)

    const newHash = params.toString()
    const currentHash = window.location.hash.slice(1)

    if (currentHash !== newHash) {
      const base = `${window.location.pathname}${window.location.search}`
      const hashString = newHash ? `#${newHash}` : ''
      window.history.replaceState(null, '', `${base}${hashString}`)
    }
  }

  function restoreStateFromHash(): Partial<PlaygroundState> | undefined {
    if (typeof window === 'undefined')
      return undefined

    try {
      const params = new URLSearchParams(window.location.hash.slice(1))
      const raw = params.get(PLAYGROUND_HASH_KEY)

      if (!raw)
        return undefined

      const parsed = JSON.parse(raw)

      if (parsed && typeof parsed === 'object')
        return parsed as Partial<PlaygroundState>
    }
    catch {
      // Ignore malformed state payloads
    }

    return undefined
  }

  function restoreStateFromStorage(): Partial<PlaygroundState> | undefined {
    if (typeof window === 'undefined')
      return undefined

    try {
      const raw = window.localStorage.getItem(PLAYGROUND_STORAGE_KEY)

      if (!raw)
        return undefined

      const parsed = JSON.parse(raw)

      if (parsed && typeof parsed === 'object')
        return parsed as Partial<PlaygroundState>
    }
    catch {
      // Ignore malformed storage payloads
    }

    return undefined
  }

  function applyPlaygroundState(state: Partial<PlaygroundState>, source: RestoreSource) {
    persistencePaused = true

    try {
      const restored = ctx.applyStateValues(state)
      persistPlaygroundState(ctx.createPlaygroundState(), { force: true })

      if (restored) {
        ctx.logEvent(
          'State',
          'restore',
          source === 'hash' ? 'Restored from URL hash' : 'Restored from local storage',
        )
      }
    }
    finally {
      persistencePaused = false
    }
  }

  function restoreInitialState() {
    if (typeof window === 'undefined')
      return

    const hashState = restoreStateFromHash()

    if (hashState) {
      applyPlaygroundState(hashState, 'hash')
      return
    }

    const storedState = restoreStateFromStorage()

    if (storedState)
      applyPlaygroundState(storedState, 'storage')
    else
      persistPlaygroundState(ctx.createPlaygroundState(), { force: true })
  }

  watch(
    () => ctx.createPlaygroundState(),
    (state) => {
      persistPlaygroundState(state)
    },
  )

  return {
    restoreInitialState,
    persistPlaygroundState,
  }
}

export function createApplyStateValues(ctx: any) {
  return function applyStateValues(state: Partial<PlaygroundState>) {
    let restored = false

    if (state.activePanel && isPanelId(state.activePanel)) {
      ctx.activePanel.value = state.activePanel
      restored = true
    }

    const restoredCenter = toLngLatTuple(state.center)
    if (restoredCenter) {
      ctx.center.value = restoredCenter
      restored = true
    }

    const restoredZoom = toFiniteNumber(state.zoom)
    if (restoredZoom != null) {
      ctx.zoom.value = Math.round(restoredZoom)
      restored = true
    }

    const restoredPitch = toFiniteNumber(state.pitch)
    if (restoredPitch != null) {
      ctx.pitch.value = Math.round(restoredPitch)
      restored = true
    }

    const restoredRotation = toFiniteNumber(state.rotation)
    if (restoredRotation != null) {
      ctx.rotation.value = Math.round(restoredRotation)
      restored = true
    }

    if (state.viewMode && isViewMode(state.viewMode)) {
      ctx.viewMode.value = state.viewMode
      restored = true
    }

    if (state.mapStyle && isMapStyle(state.mapStyle)) {
      ctx.mapStyle.value = state.mapStyle
      restored = true
    }

    if (state.marker) {
      const marker = state.marker
      const draggable = toBoolean(marker.draggable)
      const showLabel = toBoolean(marker.showLabel)
      const labelText = typeof marker.labelText === 'string' ? marker.labelText : undefined
      const labelDirection = isMarkerDirection(marker.labelDirection) ? marker.labelDirection : undefined
      const offsetX = toFiniteNumber(marker.offsetX)
      const offsetY = toFiniteNumber(marker.offsetY)

      if (draggable != null) {
        ctx.markerState.draggable = draggable
        restored = true
      }

      if (showLabel != null) {
        ctx.markerState.showLabel = showLabel
        restored = true
      }

      if (labelText != null) {
        ctx.markerState.labelText = labelText
        restored = true
      }

      if (labelDirection) {
        ctx.markerState.labelDirection = labelDirection
        restored = true
      }

      if (offsetX != null) {
        ctx.markerState.offsetX = offsetX
        restored = true
      }

      if (offsetY != null) {
        ctx.markerState.offsetY = offsetY
        restored = true
      }
    }

    if (state.text) {
      const visible = toBoolean(state.text.visible)
      const text = typeof state.text.text === 'string' ? state.text.text : undefined
      const color = typeof state.text.color === 'string' ? state.text.color : undefined

      if (visible != null) {
        ctx.textState.visible = visible
        restored = true
      }

      if (text != null) {
        ctx.textState.text = text
        restored = true
      }

      if (color != null) {
        ctx.textState.color = color
        restored = true
      }
    }

    if (state.circleMarker) {
      const visible = toBoolean(state.circleMarker.visible)
      const radius = toFiniteNumber(state.circleMarker.radius)
      const fillColor = typeof state.circleMarker.fillColor === 'string' ? state.circleMarker.fillColor : undefined
      const strokeColor = typeof state.circleMarker.strokeColor === 'string' ? state.circleMarker.strokeColor : undefined

      if (visible != null) {
        ctx.circleMarkerState.visible = visible
        restored = true
      }

      if (radius != null) {
        ctx.circleMarkerState.radius = Math.max(1, Math.round(radius))
        restored = true
      }

      if (fillColor != null) {
        ctx.circleMarkerState.fillColor = fillColor
        restored = true
      }

      if (strokeColor != null) {
        ctx.circleMarkerState.strokeColor = strokeColor
        restored = true
      }
    }

    if (state.elasticMarker) {
      const visible = toBoolean(state.elasticMarker.visible)
      if (visible != null) {
        ctx.elasticMarkerState.visible = visible
        restored = true
      }
    }

    if (state.labelsLayer) {
      const visible = toBoolean(state.labelsLayer.visible)
      const collision = toBoolean(state.labelsLayer.collision)
      const allowCollision = toBoolean(state.labelsLayer.allowCollision)

      if (visible != null) {
        ctx.labelsLayerState.visible = visible
        restored = true
      }

      if (collision != null) {
        ctx.labelsLayerState.collision = collision
        restored = true
      }

      if (allowCollision != null) {
        ctx.labelsLayerState.allowCollision = allowCollision
        restored = true
      }
    }

    if (state.markerCluster) {
      const visible = toBoolean(state.markerCluster.visible)
      const gridSize = toFiniteNumber(state.markerCluster.gridSize)

      if (visible != null) {
        ctx.markerClusterState.visible = visible
        restored = true
      }

      if (gridSize != null) {
        ctx.markerClusterState.gridSize = Math.max(1, Math.round(gridSize))
        restored = true
      }
    }

    if (state.infoWindow) {
      const infoWindow = state.infoWindow
      const isOpen = toBoolean(infoWindow.isOpen)
      const title = typeof infoWindow.title === 'string' ? infoWindow.title : undefined
      const body = typeof infoWindow.body === 'string' ? infoWindow.body : undefined
      const anchor = isInfoWindowAnchor(infoWindow.anchor) ? infoWindow.anchor : undefined
      const offsetX = toFiniteNumber(infoWindow.offsetX)
      const offsetY = toFiniteNumber(infoWindow.offsetY)

      if (isOpen != null) {
        ctx.infoWindowState.isOpen = isOpen
        restored = true
      }

      if (title != null) {
        ctx.infoWindowState.title = title
        restored = true
      }

      if (body != null) {
        ctx.infoWindowState.body = body
        restored = true
      }

      if (anchor) {
        ctx.infoWindowState.anchor = anchor
        restored = true
      }

      if (offsetX != null) {
        ctx.infoWindowState.offsetX = offsetX
        restored = true
      }

      if (offsetY != null) {
        ctx.infoWindowState.offsetY = offsetY
        restored = true
      }
    }

    applyOverlayState(state, ctx, () => {
      restored = true
    })

    if (state.performanceDatasetId && typeof state.performanceDatasetId === 'string') {
      const datasetExists = state.performanceDatasetId === 'official'
        || performanceDatasets.some(dataset => dataset.id === state.performanceDatasetId)

      if (datasetExists) {
        ctx.performanceDatasetId.value = state.performanceDatasetId
        restored = true
      }
    }

    if (state.performanceRenderMode && isPerformanceRenderMode(state.performanceRenderMode)) {
      ctx.performanceRenderMode.value = state.performanceRenderMode
      restored = true
    }

    return restored
  }
}

function applyOverlayState(
  state: Partial<PlaygroundState>,
  ctx: any,
  markRestored: () => void,
) {
  if (state.polyline) {
    const visible = toBoolean(state.polyline.visible)
    const strokeColor = typeof state.polyline.strokeColor === 'string' ? state.polyline.strokeColor : undefined
    const strokeWeight = toFiniteNumber(state.polyline.strokeWeight)

    if (visible != null) {
      ctx.polylineState.visible = visible
      markRestored()
    }

    if (strokeColor != null) {
      ctx.polylineState.strokeColor = strokeColor
      markRestored()
    }

    if (strokeWeight != null) {
      ctx.polylineState.strokeWeight = Math.max(1, Math.round(strokeWeight))
      markRestored()
    }
  }

  if (state.polygon) {
    const visible = toBoolean(state.polygon.visible)
    const strokeColor = typeof state.polygon.strokeColor === 'string' ? state.polygon.strokeColor : undefined
    const fillColor = typeof state.polygon.fillColor === 'string' ? state.polygon.fillColor : undefined
    const fillOpacity = toFiniteNumber(state.polygon.fillOpacity)

    if (visible != null) {
      ctx.polygonState.visible = visible
      markRestored()
    }

    if (strokeColor != null) {
      ctx.polygonState.strokeColor = strokeColor
      markRestored()
    }

    if (fillColor != null) {
      ctx.polygonState.fillColor = fillColor
      markRestored()
    }

    if (fillOpacity != null) {
      ctx.polygonState.fillOpacity = Math.min(1, Math.max(0, fillOpacity))
      markRestored()
    }
  }

  if (state.circle) {
    const visible = toBoolean(state.circle.visible)
    const radius = toFiniteNumber(state.circle.radius)
    const strokeColor = typeof state.circle.strokeColor === 'string' ? state.circle.strokeColor : undefined
    const strokeWeight = toFiniteNumber(state.circle.strokeWeight)
    const fillColor = typeof state.circle.fillColor === 'string' ? state.circle.fillColor : undefined
    const fillOpacity = toFiniteNumber(state.circle.fillOpacity)

    if (visible != null) {
      ctx.circleState.visible = visible
      markRestored()
    }

    if (radius != null) {
      ctx.circleState.radius = Math.max(0, Math.round(radius))
      markRestored()
    }

    if (strokeColor != null) {
      ctx.circleState.strokeColor = strokeColor
      markRestored()
    }

    if (strokeWeight != null) {
      ctx.circleState.strokeWeight = Math.max(1, Math.round(strokeWeight))
      markRestored()
    }

    if (fillColor != null) {
      ctx.circleState.fillColor = fillColor
      markRestored()
    }

    if (fillOpacity != null) {
      ctx.circleState.fillOpacity = Math.min(1, Math.max(0, fillOpacity))
      markRestored()
    }
  }

  if (state.rectangle) {
    const visible = toBoolean(state.rectangle.visible)
    const strokeColor = typeof state.rectangle.strokeColor === 'string' ? state.rectangle.strokeColor : undefined
    const fillColor = typeof state.rectangle.fillColor === 'string' ? state.rectangle.fillColor : undefined
    const fillOpacity = toFiniteNumber(state.rectangle.fillOpacity)

    if (visible != null) {
      ctx.rectangleState.visible = visible
      markRestored()
    }

    if (strokeColor != null) {
      ctx.rectangleState.strokeColor = strokeColor
      markRestored()
    }

    if (fillColor != null) {
      ctx.rectangleState.fillColor = fillColor
      markRestored()
    }

    if (fillOpacity != null) {
      ctx.rectangleState.fillOpacity = Math.min(1, Math.max(0, fillOpacity))
      markRestored()
    }
  }

  if (state.ellipse) {
    const visible = toBoolean(state.ellipse.visible)
    const radiusX = toFiniteNumber(state.ellipse.radiusX)
    const radiusY = toFiniteNumber(state.ellipse.radiusY)
    const strokeColor = typeof state.ellipse.strokeColor === 'string' ? state.ellipse.strokeColor : undefined
    const fillColor = typeof state.ellipse.fillColor === 'string' ? state.ellipse.fillColor : undefined
    const fillOpacity = toFiniteNumber(state.ellipse.fillOpacity)

    if (visible != null) {
      ctx.ellipseState.visible = visible
      markRestored()
    }

    if (radiusX != null) {
      ctx.ellipseState.radiusX = Math.max(1, Math.round(radiusX))
      markRestored()
    }

    if (radiusY != null) {
      ctx.ellipseState.radiusY = Math.max(1, Math.round(radiusY))
      markRestored()
    }

    if (strokeColor != null) {
      ctx.ellipseState.strokeColor = strokeColor
      markRestored()
    }

    if (fillColor != null) {
      ctx.ellipseState.fillColor = fillColor
      markRestored()
    }

    if (fillOpacity != null) {
      ctx.ellipseState.fillOpacity = Math.min(1, Math.max(0, fillOpacity))
      markRestored()
    }
  }

  if (state.bezierCurve) {
    const visible = toBoolean(state.bezierCurve.visible)
    const strokeColor = typeof state.bezierCurve.strokeColor === 'string' ? state.bezierCurve.strokeColor : undefined
    const strokeWeight = toFiniteNumber(state.bezierCurve.strokeWeight)

    if (visible != null) {
      ctx.bezierCurveState.visible = visible
      markRestored()
    }

    if (strokeColor != null) {
      ctx.bezierCurveState.strokeColor = strokeColor
      markRestored()
    }

    if (strokeWeight != null) {
      ctx.bezierCurveState.strokeWeight = Math.max(1, Math.round(strokeWeight))
      markRestored()
    }
  }

  applyLayerState(state, ctx, markRestored)
  applyControlState(state, ctx, markRestored)
}

function applyLayerState(
  state: Partial<PlaygroundState>,
  ctx: any,
  markRestored: () => void,
) {
  if (state.tileLayer) {
    const visible = toBoolean(state.tileLayer.visible)
    const opacity = toFiniteNumber(state.tileLayer.opacity)
    const tileUrl = typeof state.tileLayer.tileUrl === 'string' ? state.tileLayer.tileUrl : undefined

    if (visible != null) {
      ctx.tileLayerState.visible = visible
      markRestored()
    }

    if (opacity != null) {
      ctx.tileLayerState.opacity = Math.min(1, Math.max(0, opacity))
      markRestored()
    }

    if (tileUrl != null) {
      ctx.tileLayerState.tileUrl = tileUrl
      markRestored()
    }
  }

  for (const key of ['traffic', 'satellite', 'roadNet'] as const) {
    const stateValue = state[key]
    const ctxKey = `${key}State`

    if (!stateValue)
      continue

    const visible = toBoolean(stateValue.visible)
    const opacity = toFiniteNumber(stateValue.opacity)

    if (visible != null) {
      ctx[ctxKey].visible = visible
      markRestored()
    }

    if (opacity != null) {
      ctx[ctxKey].opacity = Math.min(1, Math.max(0, opacity))
      markRestored()
    }

    if (key === 'traffic') {
      const autoRefresh = toBoolean(state.traffic?.autoRefresh)
      const interval = toFiniteNumber(state.traffic?.interval)

      if (autoRefresh != null) {
        ctx.trafficState.autoRefresh = autoRefresh
        markRestored()
      }

      if (interval != null) {
        ctx.trafficState.interval = Math.max(1, Math.round(interval))
        markRestored()
      }
    }
  }

  if (state.imageLayer) {
    const visible = toBoolean(state.imageLayer.visible)
    const opacity = toFiniteNumber(state.imageLayer.opacity)

    if (visible != null) {
      ctx.imageLayerState.visible = visible
      markRestored()
    }

    if (opacity != null) {
      ctx.imageLayerState.opacity = Math.min(1, Math.max(0, opacity))
      markRestored()
    }
  }

  if (state.districtLayer) {
    const visible = toBoolean(state.districtLayer.visible)
    const opacity = toFiniteNumber(state.districtLayer.opacity)
    const adcode = typeof state.districtLayer.adcode === 'string' ? state.districtLayer.adcode : undefined

    if (visible != null) {
      ctx.districtLayerState.visible = visible
      markRestored()
    }

    if (opacity != null) {
      ctx.districtLayerState.opacity = Math.min(1, Math.max(0, opacity))
      markRestored()
    }

    if (adcode != null) {
      ctx.districtLayerState.adcode = adcode
      markRestored()
    }
  }

  if (state.geoJSONLayer) {
    const visible = toBoolean(state.geoJSONLayer.visible)
    const fillOpacity = toFiniteNumber(state.geoJSONLayer.fillOpacity)

    if (visible != null) {
      ctx.geoJSONLayerState.visible = visible
      markRestored()
    }

    if (fillOpacity != null) {
      ctx.geoJSONLayerState.fillOpacity = Math.min(1, Math.max(0, fillOpacity))
      markRestored()
    }
  }

  if (state.heatMap) {
    const visible = toBoolean(state.heatMap.visible)
    const radius = toFiniteNumber(state.heatMap.radius)
    const opacityStart = toFiniteNumber(state.heatMap.opacityStart)
    const opacityEnd = toFiniteNumber(state.heatMap.opacityEnd)

    if (visible != null) {
      ctx.heatMapState.visible = visible
      markRestored()
    }

    if (radius != null) {
      ctx.heatMapState.radius = Math.max(1, Math.round(radius))
      markRestored()
    }

    if (opacityStart != null) {
      ctx.heatMapState.opacityStart = Math.min(1, Math.max(0, opacityStart))
      markRestored()
    }

    if (opacityEnd != null) {
      ctx.heatMapState.opacityEnd = Math.min(1, Math.max(0, opacityEnd))
      markRestored()
    }
  }
}

function applyControlState(
  state: Partial<PlaygroundState>,
  ctx: any,
  markRestored: () => void,
) {
  for (const key of ['toolBar', 'scale', 'controlBar', 'mapType'] as const) {
    const stateValue = state[key]
    const ctxKey = `${key}State`

    if (!stateValue)
      continue

    const visible = toBoolean(stateValue.visible)
    const position = isControlPosition(stateValue.position) ? stateValue.position : undefined
    const offsetX = toFiniteNumber(stateValue.offsetX)
    const offsetY = toFiniteNumber(stateValue.offsetY)

    if (visible != null) {
      ctx[ctxKey].visible = visible
      markRestored()
    }

    if (position) {
      ctx[ctxKey].position = position
      markRestored()
    }

    if (offsetX != null) {
      ctx[ctxKey].offsetX = Math.round(offsetX)
      markRestored()
    }

    if (offsetY != null) {
      ctx[ctxKey].offsetY = Math.round(offsetY)
      markRestored()
    }
  }

  if (state.controlBar) {
    const showZoomBar = toBoolean(state.controlBar.showZoomBar)
    const showControlButton = toBoolean(state.controlBar.showControlButton)

    if (showZoomBar != null) {
      ctx.controlBarState.showZoomBar = showZoomBar
      markRestored()
    }

    if (showControlButton != null) {
      ctx.controlBarState.showControlButton = showControlButton
      markRestored()
    }
  }

  if (state.mapType) {
    const defaultType = toFiniteNumber(state.mapType.defaultType)
    const showTraffic = toBoolean(state.mapType.showTraffic)
    const showRoad = toBoolean(state.mapType.showRoad)

    if (defaultType != null) {
      ctx.mapTypeState.defaultType = Math.max(0, Math.round(defaultType))
      markRestored()
    }

    if (showTraffic != null) {
      ctx.mapTypeState.showTraffic = showTraffic
      markRestored()
    }

    if (showRoad != null) {
      ctx.mapTypeState.showRoad = showRoad
      markRestored()
    }
  }
}
