<script setup lang="ts">
import type { usePerformanceMarks } from '../composables/usePerformanceMarks'
import type { usePlaygroundState } from '../composables/usePlaygroundState'
import type { LngLatTuple } from '../types'
import { bezierCurvePath } from '../constants/paths'

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

const markerIcon = 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
const clusterPoints = [
  { position: [116.397428, 39.90923], extData: { name: 'Tiananmen' } },
  { position: [116.407428, 39.91923], extData: { name: 'Dongcheng' } },
  { position: [116.387428, 39.91523], extData: { name: 'Xicheng' } },
  { position: [116.417428, 39.89923], extData: { name: 'Chaoyang west' } },
  { position: [116.377428, 39.89923], extData: { name: 'Fengtai east' } },
]
const labelMarkerPoints = [
  { position: [116.397428, 39.90923], text: 'Center' },
  { position: [116.407428, 39.91623], text: 'North east' },
  { position: [116.386428, 39.90223], text: 'South west' },
]
const imageLayerBounds = [
  [116.365, 39.89],
  [116.43, 39.93],
]
const imageLayerUrl = 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png'
const heatMapData = [
  { lng: 116.397428, lat: 39.90923, count: 80 },
  { lng: 116.407428, lat: 39.91923, count: 64 },
  { lng: 116.387428, lat: 39.91523, count: 72 },
  { lng: 116.417428, lat: 39.89923, count: 44 },
  { lng: 116.377428, lat: 39.89923, count: 36 },
  { lng: 116.402428, lat: 39.89223, count: 52 },
]
const geoJsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Playground polygon' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [116.372, 39.898],
          [116.398, 39.928],
          [116.426, 39.902],
          [116.396, 39.888],
          [116.372, 39.898],
        ]],
      },
    },
  ],
}
const elasticMarkerStyles = {
  0: { icon: { img: markerIcon, size: [24, 34], anchor: [12, 34] } },
  1: { icon: { img: markerIcon, size: [32, 45], anchor: [16, 45] } },
}
const elasticMarkerZoomStyleMapping = { 3: 0, 13: 1 }
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
    <AmapText
      v-if="state.activePanel.value === 'text'"
      :position="state.center.value"
      :text="state.textState.text"
      :visible="state.textState.visible"
      :offset="[0, -36]"
      anchor="bottom-center"
      :options="state.textOptions.value"
    />
    <AmapCircleMarker
      v-if="state.activePanel.value === 'circleMarker'"
      :center="state.center.value"
      :radius="state.circleMarkerState.radius"
      :visible="state.circleMarkerState.visible"
      :options="state.circleMarkerOptions.value"
    />
    <AmapElasticMarker
      v-if="state.activePanel.value === 'elasticMarker'"
      :position="state.center.value"
      :styles="elasticMarkerStyles"
      :zoom-style-mapping="elasticMarkerZoomStyleMapping"
      :visible="state.elasticMarkerState.visible"
    />
    <AmapLabelsLayer
      v-if="state.activePanel.value === 'labelsLayer'"
      :visible="state.labelsLayerState.visible"
      :collision="state.labelsLayerState.collision"
      :allow-collision="state.labelsLayerState.allowCollision"
    >
      <AmapLabelMarker
        v-for="point in labelMarkerPoints"
        :key="point.text"
        :position="point.position"
        :text="{ content: point.text, direction: 'top', style: { fillColor: '#0f172a', fontSize: 13 } }"
        :icon="{ image: markerIcon, size: { width: 24, height: 34 }, anchor: [12, 34] }"
      />
    </AmapLabelsLayer>
    <AmapMarkerCluster
      v-if="state.activePanel.value === 'markerCluster'"
      :points="clusterPoints"
      :visible="state.markerClusterState.visible"
      :options="{ gridSize: state.markerClusterState.gridSize }"
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
    <AmapRectangle
      v-if="state.activePanel.value === 'rectangle'"
      :bounds="state.rectangleBounds.value"
      :visible="state.rectangleState.visible"
      :options="state.rectangleOptions.value"
    />
    <AmapEllipse
      v-if="state.activePanel.value === 'ellipse'"
      :center="state.center.value"
      :radius="state.ellipseRadius.value"
      :visible="state.ellipseState.visible"
      :options="state.ellipseOptions.value"
    />
    <AmapBezierCurve
      v-if="state.activePanel.value === 'bezierCurve'"
      :path="bezierCurvePath"
      :visible="state.bezierCurveState.visible"
      :options="state.bezierCurveOptions.value"
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
    <AmapImageLayer
      v-if="state.activePanel.value === 'imageLayer'"
      :url="imageLayerUrl"
      :bounds="imageLayerBounds"
      :visible="state.imageLayerState.visible"
      :opacity="state.imageLayerState.opacity"
    />
    <AmapDistrictLayer
      v-if="state.activePanel.value === 'districtLayer'"
      type="Province"
      :adcode="state.districtLayerState.adcode"
      :visible="state.districtLayerState.visible"
      :opacity="state.districtLayerState.opacity"
      :depth="2"
      :styles="{
        'fill': 'rgba(34, 211, 238, 0.22)',
        'province-stroke': '#0891b2',
        'city-stroke': '#06b6d4',
        'county-stroke': 'rgba(8, 145, 178, 0.65)',
      }"
    />
    <AmapGeoJSONLayer
      v-if="state.activePanel.value === 'geoJSONLayer'"
      :data="geoJsonData"
      :visible="state.geoJSONLayerState.visible"
      :options="{
        getPolygon: () => ({
          strokeColor: '#166534',
          strokeWeight: 2,
          fillColor: '#22c55e',
          fillOpacity: state.geoJSONLayerState.fillOpacity,
        }),
      }"
    />
    <AmapHeatMap
      v-if="state.activePanel.value === 'heatMap'"
      :data="heatMapData"
      :visible="state.heatMapState.visible"
      :radius="state.heatMapState.radius"
      :opacity="state.heatMapOpacity.value"
      :max="100"
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
      :styles="performance.massMarkerStyles.value"
      :options="{
        opacity: 0.8,
        zIndex: 111,
        cursor: 'pointer',
        zooms: [3, 20],
      }"
    />
  </AmapMap>
</template>
