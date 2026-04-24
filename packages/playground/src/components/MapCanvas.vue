<script setup lang="ts">
import type { usePerformanceMarks } from '../composables/usePerformanceMarks'
import type { usePlaygroundState } from '../composables/usePlaygroundState'
import type { LngLatTuple } from '../types'

defineProps<{
  state: ReturnType<typeof usePlaygroundState>
  performance: ReturnType<typeof usePerformanceMarks>
  hasKey: boolean
  showPerformanceMassMarks: boolean
  polylinePath: LngLatTuple[]
  polygonPath: LngLatTuple[]
}>()

defineEmits<{
  ready: [map: AMap.Map]
  click: [event: any]
  moveend: [event: any]
  markerClick: []
  markerDragend: [event: any]
  infoWindowOpen: []
  infoWindowClose: []
}>()
</script>

<template>
  <div v-if="!hasKey" class="map-placeholder">
    <strong>No API key detected.</strong>
    <p>
      Set <code>VITE_AMAP_KEY</code> or paste a temporary key in the sidebar to explore the live map. The controls on the
      left stay interactive even without the JSAPI.
    </p>
  </div>
  <AmapMap
    v-else
    class="map"
    :center="state.center.value"
    :zoom="state.zoom.value"
    :pitch="state.pitch.value"
    :rotation="state.rotation.value"
    :view-mode="state.viewMode.value"
    :map-style="state.resolvedMapStyle.value"
    @ready="$emit('ready', $event)"
    @click="$emit('click', $event)"
    @moveend="$emit('moveend', $event)"
  >
    <AmapMarker
      v-if="state.showMarker.value"
      :position="state.center.value"
      :draggable="state.markerState.draggable"
      :label="state.markerLabel.value"
      :offset="state.markerOffset.value"
      @click="$emit('markerClick')"
      @dragend="$emit('markerDragend', $event)"
    />
    <AmapInfoWindow
      v-if="state.activePanel.value === 'infoWindow'"
      :position="state.center.value"
      :is-open="state.infoWindowState.isOpen"
      :anchor="state.infoWindowState.anchor"
      :offset="state.infoWindowOffset.value"
      @close="$emit('infoWindowClose')"
      @open="$emit('infoWindowOpen')"
    >
      <div class="info-window">
        <h3>{{ state.infoWindowState.title }}</h3>
        <p>{{ state.infoWindowState.body }}</p>
      </div>
    </AmapInfoWindow>
    <AmapPolyline
      v-if="state.activePanel.value === 'polyline' && state.polylineState.visible"
      :path="polylinePath"
      :options="state.polylineOptions.value"
    />
    <AmapPolygon
      v-if="state.activePanel.value === 'polygon' && state.polygonState.visible"
      :path="polygonPath"
      :options="state.polygonOptions.value"
    />
    <AmapCircle
      v-if="state.activePanel.value === 'circle' && state.circleState.visible"
      :center="state.center.value"
      :radius="state.circleState.radius"
      :options="state.circleOptions.value"
    />
    <AmapTileLayer
      v-if="state.activePanel.value === 'tileLayer'"
      :visible="state.tileLayerState.visible"
      :opacity="state.tileLayerState.opacity"
      :tile-url="state.tileLayerState.tileUrl"
    />
    <AmapTrafficLayer
      v-if="state.activePanel.value === 'traffic'"
      :visible="state.trafficState.visible"
      :auto-refresh="state.trafficState.autoRefresh"
      :interval="state.trafficState.interval"
      :opacity="state.trafficState.opacity"
    />
    <AmapSatelliteLayer
      v-if="state.activePanel.value === 'satellite'"
      :visible="state.satelliteState.visible"
      :opacity="state.satelliteState.opacity"
    />
    <AmapRoadNetLayer
      v-if="state.activePanel.value === 'roadNet'"
      :visible="state.roadNetState.visible"
      :opacity="state.roadNetState.opacity"
    />
    <AmapToolBar
      v-if="state.activePanel.value === 'toolBar'"
      :visible="state.toolBarState.visible"
      :position="state.toolBarState.position"
      :offset="state.toolBarOffset.value"
    />
    <AmapScale
      v-if="state.activePanel.value === 'scale'"
      :visible="state.scaleState.visible"
      :position="state.scaleState.position"
      :offset="state.scaleOffset.value"
    />
    <AmapControlBar
      v-if="state.activePanel.value === 'controlBar'"
      :visible="state.controlBarState.visible"
      :position="state.controlBarState.position"
      :offset="state.controlBarOffset.value"
      :show-zoom-bar="state.controlBarState.showZoomBar"
      :show-control-button="state.controlBarState.showControlButton"
    />
    <AmapMapType
      v-if="state.activePanel.value === 'mapType'"
      :visible="state.mapTypeState.visible"
      :position="state.mapTypeState.position"
      :offset="state.mapTypeOffset.value"
      :default-type="state.mapTypeState.defaultType"
      :show-traffic="state.mapTypeState.showTraffic"
      :show-road="state.mapTypeState.showRoad"
    />
    <AmapMassMarks
      v-if="showPerformanceMassMarks"
      :data="performance.performanceMassRenderData.value"
      :style="performance.massMarkerStyles.value"
    />
  </AmapMap>
</template>
