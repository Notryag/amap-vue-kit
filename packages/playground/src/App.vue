<script setup lang="ts">
import type { LngLatTuple, PlaygroundState } from './types'
import { computed, onBeforeUnmount, watch } from 'vue'
import PlaygroundMapStage from './components/PlaygroundMapStage.vue'
import PlaygroundSidebar from './components/PlaygroundSidebar.vue'
import { createSnippetGenerators } from './composables/snippet'
import { useAmapKey } from './composables/useAmapKey'
import { useEventLog } from './composables/useEventLog'
import { useMapInspector } from './composables/useMapInspector'
import { usePerformanceMarks } from './composables/usePerformanceMarks'
import { createApplyStateValues, usePlaygroundPersistence } from './composables/usePlaygroundPersistence'
import { usePlaygroundState } from './composables/usePlaygroundState'
import { useSnippetCopy } from './composables/useSnippetCopy'
import { panels } from './config/panels'
import { bezierCurvePath, geoJsonPolygonPath, polygonPath, polylinePath } from './constants/paths'

const EVENT_LOG_LIMIT = 12
const OFFICIAL_MASS_VIEW = {
  center: [102.342785, 35.312316] as LngLatTuple,
  zoom: 4,
  pitch: 0,
}

const state = usePlaygroundState()
const {
  center,
  zoom,
  pitch,
  rotation,
  viewMode,
  mapStyle,
  activePanel,
  markerState,
  textState,
  circleMarkerState,
  elasticMarkerState,
  labelsLayerState,
  markerClusterState,
  infoWindowState,
  polylineState,
  polygonState,
  circleState,
  rectangleState,
  ellipseState,
  bezierCurveState,
  tileLayerState,
  trafficState,
  satelliteState,
  roadNetState,
  imageLayerState,
  districtLayerState,
  geoJSONLayerState,
  heatMapState,
  toolBarState,
  scaleState,
  controlBarState,
  mapTypeState,
  centerText,
  showMarker,
} = state

const key = useAmapKey()
const {
  runtimeKey,
  hasKey,
  keyStatusDetail,
} = key

const { eventLog, logEvent } = useEventLog()

logEvent(
  'Map',
  hasKey.value ? 'API key ready' : 'API key missing',
  keyStatusDetail.value,
)

const inspector = useMapInspector(hasKey)
const {
  mapInstance,
  captureMapBounds,
  refreshOverlayStats,
  scheduleInspectorRefresh,
  resetMapInspector,
} = inspector

const performance = usePerformanceMarks(logEvent)
const {
  performanceDatasetId,
  performanceRenderMode,
} = performance

const activePanelMeta = computed(() =>
  panels.find(panel => panel.id === activePanel.value) ?? panels[0],
)

const showPerformanceMassMarks = computed(() =>
  activePanel.value === 'performance',
)

const snippetGenerators = createSnippetGenerators({
  ...state,
  ...performance,
  polylinePath,
  polygonPath,
})

const panelSnippet = computed(() =>
  snippetGenerators[activePanel.value]?.() ?? '',
)

const snippetCopy = useSnippetCopy({
  activePanel,
  activePanelLabel: computed(() => activePanelMeta.value.label),
  panelSnippet,
  logEvent,
})

function createPlaygroundState(): PlaygroundState {
  return {
    activePanel: activePanel.value,
    center: [...center.value] as LngLatTuple,
    zoom: zoom.value,
    pitch: pitch.value,
    rotation: rotation.value,
    viewMode: viewMode.value,
    mapStyle: mapStyle.value,
    marker: {
      draggable: markerState.draggable,
      showLabel: markerState.showLabel,
      labelText: markerState.labelText,
      labelDirection: markerState.labelDirection,
      offsetX: markerState.offsetX,
      offsetY: markerState.offsetY,
    },
    text: {
      visible: textState.visible,
      text: textState.text,
      color: textState.color,
    },
    circleMarker: {
      visible: circleMarkerState.visible,
      radius: circleMarkerState.radius,
      fillColor: circleMarkerState.fillColor,
      strokeColor: circleMarkerState.strokeColor,
    },
    elasticMarker: {
      visible: elasticMarkerState.visible,
    },
    labelsLayer: {
      visible: labelsLayerState.visible,
      collision: labelsLayerState.collision,
      allowCollision: labelsLayerState.allowCollision,
    },
    markerCluster: {
      visible: markerClusterState.visible,
      gridSize: markerClusterState.gridSize,
    },
    infoWindow: {
      isOpen: infoWindowState.isOpen,
      title: infoWindowState.title,
      body: infoWindowState.body,
      anchor: infoWindowState.anchor,
      offsetX: infoWindowState.offsetX,
      offsetY: infoWindowState.offsetY,
    },
    polyline: {
      visible: polylineState.visible,
      strokeColor: polylineState.strokeColor,
      strokeWeight: polylineState.strokeWeight,
    },
    polygon: {
      visible: polygonState.visible,
      strokeColor: polygonState.strokeColor,
      fillColor: polygonState.fillColor,
      fillOpacity: polygonState.fillOpacity,
    },
    circle: {
      visible: circleState.visible,
      radius: circleState.radius,
      strokeColor: circleState.strokeColor,
      strokeWeight: circleState.strokeWeight,
      fillColor: circleState.fillColor,
      fillOpacity: circleState.fillOpacity,
    },
    rectangle: {
      visible: rectangleState.visible,
      strokeColor: rectangleState.strokeColor,
      fillColor: rectangleState.fillColor,
      fillOpacity: rectangleState.fillOpacity,
    },
    ellipse: {
      visible: ellipseState.visible,
      radiusX: ellipseState.radiusX,
      radiusY: ellipseState.radiusY,
      strokeColor: ellipseState.strokeColor,
      fillColor: ellipseState.fillColor,
      fillOpacity: ellipseState.fillOpacity,
    },
    bezierCurve: {
      visible: bezierCurveState.visible,
      strokeColor: bezierCurveState.strokeColor,
      strokeWeight: bezierCurveState.strokeWeight,
    },
    tileLayer: {
      visible: tileLayerState.visible,
      opacity: tileLayerState.opacity,
      tileUrl: tileLayerState.tileUrl,
    },
    traffic: {
      visible: trafficState.visible,
      autoRefresh: trafficState.autoRefresh,
      interval: trafficState.interval,
      opacity: trafficState.opacity,
    },
    satellite: {
      visible: satelliteState.visible,
      opacity: satelliteState.opacity,
    },
    roadNet: {
      visible: roadNetState.visible,
      opacity: roadNetState.opacity,
    },
    imageLayer: {
      visible: imageLayerState.visible,
      opacity: imageLayerState.opacity,
    },
    districtLayer: {
      visible: districtLayerState.visible,
      opacity: districtLayerState.opacity,
      adcode: districtLayerState.adcode,
    },
    geoJSONLayer: {
      visible: geoJSONLayerState.visible,
      fillOpacity: geoJSONLayerState.fillOpacity,
    },
    heatMap: {
      visible: heatMapState.visible,
      radius: heatMapState.radius,
      opacityStart: heatMapState.opacityStart,
      opacityEnd: heatMapState.opacityEnd,
    },
    toolBar: {
      visible: toolBarState.visible,
      position: toolBarState.position,
      offsetX: toolBarState.offsetX,
      offsetY: toolBarState.offsetY,
    },
    scale: {
      visible: scaleState.visible,
      position: scaleState.position,
      offsetX: scaleState.offsetX,
      offsetY: scaleState.offsetY,
    },
    controlBar: {
      visible: controlBarState.visible,
      position: controlBarState.position,
      offsetX: controlBarState.offsetX,
      offsetY: controlBarState.offsetY,
      showZoomBar: controlBarState.showZoomBar,
      showControlButton: controlBarState.showControlButton,
    },
    mapType: {
      visible: mapTypeState.visible,
      position: mapTypeState.position,
      offsetX: mapTypeState.offsetX,
      offsetY: mapTypeState.offsetY,
      defaultType: mapTypeState.defaultType,
      showTraffic: mapTypeState.showTraffic,
      showRoad: mapTypeState.showRoad,
    },
    performanceDatasetId: performanceDatasetId.value,
    performanceRenderMode: performanceRenderMode.value,
  }
}

const { restoreInitialState } = usePlaygroundPersistence({
  createPlaygroundState,
  applyStateValues: createApplyStateValues({ ...state, ...performance }),
  logEvent,
})

restoreInitialState()

watch(
  [
    activePanel,
    showMarker,
    showPerformanceMassMarks,
    () => textState.visible,
    () => circleMarkerState.visible,
    () => elasticMarkerState.visible,
    () => labelsLayerState.visible,
    () => markerClusterState.visible,
    () => rectangleState.visible,
    () => ellipseState.visible,
    () => bezierCurveState.visible,
    () => tileLayerState.visible,
    () => trafficState.visible,
    () => satelliteState.visible,
    () => roadNetState.visible,
    () => imageLayerState.visible,
    () => districtLayerState.visible,
    () => geoJSONLayerState.visible,
    () => heatMapState.visible,
    () => mapTypeState.visible,
  ],
  () => {
    scheduleInspectorRefresh()
  },
)

watch(activePanel, (panel, previousPanel) => {
  if (panel === 'infoWindow')
    infoWindowState.isOpen = true

  if (previousPanel && panel !== previousPanel)
    logEvent('Panel', 'switch', `Viewing ${panel} panel`)
})

function applyOfficialMassView() {
  if (activePanel.value !== 'performance' || performanceDatasetId.value !== 'official')
    return

  center.value = [...OFFICIAL_MASS_VIEW.center] as LngLatTuple
  zoom.value = OFFICIAL_MASS_VIEW.zoom
  pitch.value = OFFICIAL_MASS_VIEW.pitch
  viewMode.value = '3D'
}

watch([activePanel, performanceDatasetId], applyOfficialMassView, { immediate: true })

watch(hasKey, (value) => {
  if (!value)
    resetMapInspector()
})

function applyRuntimeKey() {
  const previous = runtimeKey.value.trim()
  key.applyRuntimeKey()

  if (runtimeKey.value.trim() !== previous)
    logEvent('Map', 'api-key', 'Runtime key applied. Reloading JSAPI with live data.')
}

function clearRuntimeKey() {
  if (!runtimeKey.value)
    return

  key.clearRuntimeKey()
  logEvent('Map', 'api-key', 'Runtime key cleared. Using placeholder map instead.')
}

function resetView() {
  state.resetView()
}

function stepZoom(delta: number) {
  state.stepZoom(delta)
}

function nudge(lngDelta: number, latDelta: number) {
  state.nudge(lngDelta, latDelta)
}

function getPathCenter(path: LngLatTuple[]): LngLatTuple {
  const lngValues = path.map(point => point[0])
  const latValues = path.map(point => point[1])
  const lng = (Math.min(...lngValues) + Math.max(...lngValues)) / 2
  const lat = (Math.min(...latValues) + Math.max(...latValues)) / 2

  return [Number(lng.toFixed(6)), Number(lat.toFixed(6))]
}

function applyShapeView(targetCenter: LngLatTuple, targetZoom: number) {
  center.value = [...targetCenter] as LngLatTuple
  zoom.value = targetZoom
  pitch.value = 0
  rotation.value = 0
  viewMode.value = '3D'
  logEvent('Panel', 'locate', `Focused ${activePanel.value} at zoom ${targetZoom}`)
  scheduleInspectorRefresh()
}

function locateActiveShape() {
  switch (activePanel.value) {
    case 'polyline':
      applyShapeView(getPathCenter(polylinePath), 15)
      break
    case 'polygon':
      applyShapeView(getPathCenter(polygonPath), 15)
      break
    case 'circle':
      applyShapeView([...center.value] as LngLatTuple, circleState.radius > 1200 ? 13 : 15)
      break
    case 'rectangle':
      applyShapeView([...center.value] as LngLatTuple, 14)
      break
    case 'ellipse':
      applyShapeView([...center.value] as LngLatTuple, ellipseState.radiusX > 1200 ? 13 : 14)
      break
    case 'bezierCurve':
      applyShapeView(getPathCenter(bezierCurvePath.flat()), 12)
      break
  }
}

function locateGeojsonLayer() {
  activePanel.value = 'geoJSONLayer'
  applyShapeView(getPathCenter(geoJsonPolygonPath), 13)
}

function handleMapReady(map: AMap.Map) {
  inspector.setMapInstance(map)
  performance.ensureMassMarkerStyles()
  logEvent('Map', 'ready', 'Map initialised and controls are interactive.')
  inspector.scheduleInspectorRefresh()
}

function handleMapMoveend(event: any) {
  const map = (event?.target as AMap.Map | undefined) ?? mapInstance.value ?? undefined

  if (map) {
    mapInstance.value = map
    captureMapBounds(map)
    refreshOverlayStats(map)
  }

  const currentCenter = map?.getCenter?.()
  if (currentCenter) {
    center.value = [
      Number(currentCenter.getLng().toFixed(6)),
      Number(currentCenter.getLat().toFixed(6)),
    ] as LngLatTuple
  }

  const currentZoom = map?.getZoom?.()
  if (typeof currentZoom === 'number')
    zoom.value = Math.round(currentZoom)

  const currentPitch = map?.getPitch?.()
  if (typeof currentPitch === 'number')
    pitch.value = Math.round(currentPitch)

  const currentRotation = map?.getRotation?.()
  if (typeof currentRotation === 'number')
    rotation.value = Math.round(currentRotation)

  logEvent('Map', 'moveend', `Center ${centerText.value} · zoom ${zoom.value}`)
  scheduleInspectorRefresh()
}

function handleMarkerDragend(event: any) {
  const { lnglat } = event ?? {}

  if (lnglat) {
    center.value = [
      Number(lnglat.lng.toFixed(6)),
      Number(lnglat.lat.toFixed(6)),
    ] as LngLatTuple
    logEvent('Marker', 'dragend', `${lnglat.lng.toFixed(6)}, ${lnglat.lat.toFixed(6)}`)
  }
}

function handleMarkerClick() {
  if (activePanel.value === 'infoWindow')
    infoWindowState.isOpen = true

  logEvent('Marker', 'click', 'Marker clicked')
}

function handleMapClick(event: any) {
  const { lnglat } = event ?? {}

  if (lnglat)
    logEvent('Map', 'click', `${lnglat.lng.toFixed(6)}, ${lnglat.lat.toFixed(6)}`)
  else
    logEvent('Map', 'click', 'Click event received')
}

function handleInfoWindowOpen() {
  infoWindowState.isOpen = true
  logEvent('InfoWindow', 'open', 'Info window opened')
}

function handleInfoWindowClose() {
  infoWindowState.isOpen = false
  logEvent('InfoWindow', 'close', 'Info window closed')
}

onBeforeUnmount(() => {
  snippetCopy.cleanupSnippetCopy()
  performance.cancelMassRenderTask()
  inspector.resetMapInspector()
})
</script>

<template>
  <main class="playground">
    <PlaygroundSidebar
      :panels="panels"
      :active-panel-meta="activePanelMeta"
      :state="state"
      :key-state="key"
      :performance="performance"
      @reset-view="resetView"
      @step-zoom="stepZoom"
      @nudge="nudge"
      @locate-shape="locateActiveShape"
      @locate-geojson="locateGeojsonLayer"
      @apply-runtime-key="applyRuntimeKey"
      @clear-runtime-key="clearRuntimeKey"
    />
    <PlaygroundMapStage
      :state="state"
      :inspector="inspector"
      :performance="performance"
      :snippet-copy="snippetCopy"
      :event-log="eventLog"
      :event-log-limit="EVENT_LOG_LIMIT"
      :has-key="hasKey"
      :show-performance-mass-marks="showPerformanceMassMarks"
      :polyline-path="polylinePath"
      :polygon-path="polygonPath"
      @map-ready="handleMapReady"
      @map-click="handleMapClick"
      @map-moveend="handleMapMoveend"
      @marker-click="handleMarkerClick"
      @marker-dragend="handleMarkerDragend"
      @info-window-open="handleInfoWindowOpen"
      @info-window-close="handleInfoWindowClose"
    />
  </main>
</template>

<style src="./styles/playground.css"></style>
