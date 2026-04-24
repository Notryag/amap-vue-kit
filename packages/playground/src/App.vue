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
import { polygonPath, polylinePath } from './constants/paths'

const EVENT_LOG_LIMIT = 12

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
  infoWindowState,
  polylineState,
  polygonState,
  circleState,
  tileLayerState,
  trafficState,
  satelliteState,
  roadNetState,
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
    () => tileLayerState.visible,
    () => trafficState.visible,
    () => satelliteState.visible,
    () => roadNetState.visible,
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
