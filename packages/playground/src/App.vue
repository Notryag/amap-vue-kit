<script setup lang="ts">
import type { PerformanceDatasetId } from './data/performance-datasets'
import { computed, reactive, ref, watch } from 'vue'
import { performanceDatasets } from './data/performance-datasets'

type LngLatTuple = [number, number]
type ControlPosition = 'LT' | 'RT' | 'LB' | 'RB'
type InfoWindowAnchor = 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
type MarkerLabelDirection = 'top' | 'bottom' | 'left' | 'right' | 'center'
type MapStyleKey = 'default' | 'dark' | 'light' | 'fresh' | 'grey' | 'whitesmoke' | 'macaron' | 'blue' | 'darkblue'
type ViewMode = '2D' | '3D'

interface PanelDefinition {
  id:
    | 'map'
    | 'marker'
    | 'infoWindow'
    | 'polyline'
    | 'polygon'
    | 'circle'
    | 'tileLayer'
    | 'traffic'
    | 'satellite'
    | 'roadNet'
    | 'toolBar'
    | 'scale'
    | 'controlBar'
    | 'mapType'
    | 'performance'
  label: string
  description: string
}

const center = ref<LngLatTuple>([116.397428, 39.90923])
const initialCenter: LngLatTuple = [...center.value] as LngLatTuple
const zoom = ref(12)
const pitch = ref(40)
const rotation = ref(0)
const viewMode = ref<ViewMode>('3D')
const mapStyle = ref<MapStyleKey>('default')

const markerState = reactive({
  draggable: true,
  showLabel: true,
  labelText: 'Drag me around',
  labelDirection: 'top' as MarkerLabelDirection,
  offsetX: 0,
  offsetY: -10,
})

const infoWindowState = reactive({
  isOpen: true,
  title: 'Playground ready',
  body: 'Drag the marker or adjust controls to explore component props.',
  anchor: 'bottom-center' as InfoWindowAnchor,
  offsetX: 0,
  offsetY: 0,
})

const polylineState = reactive({
  visible: true,
  strokeColor: '#2563eb',
  strokeWeight: 4,
})

const polygonState = reactive({
  visible: true,
  strokeColor: '#1d4ed8',
  fillColor: '#2563eb',
  fillOpacity: 0.12,
})

const circleState = reactive({
  visible: true,
  radius: 600,
  strokeColor: '#f97316',
  strokeWeight: 2,
  fillColor: '#fb923c',
  fillOpacity: 0.18,
})

const tileLayerState = reactive({
  visible: true,
  opacity: 0.65,
  tileUrl: 'https://webrd02.is.autonavi.com/appmaptile?style=7&x=[x]&y=[y]&z=[z]',
})

const trafficState = reactive({
  visible: true,
  autoRefresh: false,
  interval: 60,
  opacity: 0.9,
})

const satelliteState = reactive({
  visible: true,
  opacity: 0.85,
})

const roadNetState = reactive({
  visible: true,
  opacity: 1,
})

const toolBarState = reactive({
  visible: true,
  position: 'LT' as ControlPosition,
  offsetX: 16,
  offsetY: 16,
})

const scaleState = reactive({
  visible: true,
  position: 'LB' as ControlPosition,
  offsetX: 16,
  offsetY: 16,
})

const controlBarState = reactive({
  visible: true,
  position: 'RB' as ControlPosition,
  offsetX: 16,
  offsetY: 80,
  showZoomBar: true,
  showControlButton: true,
})

const mapTypeState = reactive({
  visible: true,
  position: 'RT' as ControlPosition,
  offsetX: 16,
  offsetY: 16,
  defaultType: 0,
  showTraffic: true,
  showRoad: true,
})

const hasKey = computed(() => Boolean(import.meta.env.VITE_AMAP_KEY))

const panels = [
  {
    id: 'map',
    label: 'Map',
    description: 'Control the base map view, pitch, and rotation.',
  },
  {
    id: 'marker',
    label: 'Marker',
    description: 'Toggle draggable markers, labels, and offsets.',
  },
  {
    id: 'infoWindow',
    label: 'InfoWindow',
    description: 'Experiment with anchored popups and custom content.',
  },
  {
    id: 'polyline',
    label: 'Polyline',
    description: 'Adjust path styling and visibility.',
  },
  {
    id: 'polygon',
    label: 'Polygon',
    description: 'Tweak fill opacity and stroke colours.',
  },
  {
    id: 'circle',
    label: 'Circle',
    description: 'Resize and style circular overlays.',
  },
  {
    id: 'tileLayer',
    label: 'TileLayer',
    description: 'Overlay custom tiles on top of the base map.',
  },
  {
    id: 'traffic',
    label: 'Traffic',
    description: 'Toggle real-time traffic data with opacity control.',
  },
  {
    id: 'satellite',
    label: 'Satellite',
    description: 'Blend satellite imagery into the scene.',
  },
  {
    id: 'roadNet',
    label: 'RoadNet',
    description: 'Display the road network overlay.',
  },
  {
    id: 'toolBar',
    label: 'ToolBar',
    description: 'Place interactive navigation controls.',
  },
  {
    id: 'scale',
    label: 'Scale',
    description: 'Display a scale bar at configurable positions.',
  },
  {
    id: 'controlBar',
    label: 'ControlBar',
    description: 'Show 3D navigation buttons and toggles.',
  },
  {
    id: 'mapType',
    label: 'MapType',
    description: 'Switch between map types and show quick toggles.',
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Benchmark overlays with ready-made datasets.',
  },
] as const satisfies readonly PanelDefinition[]

type PanelId = typeof panels[number]['id']

const activePanel = ref<PanelId>('map')

const activePanelMeta = computed(() => panels.find(panel => panel.id === activePanel.value) ?? panels[0])

const performanceDatasetOptions = performanceDatasets.map(dataset => ({
  label: dataset.label,
  value: dataset.id,
}))

const performanceDatasetId = ref<PerformanceDatasetId>('small')

const performanceDataset = computed(() =>
  performanceDatasets.find(dataset => dataset.id === performanceDatasetId.value) ?? performanceDatasets[0],
)

const performanceMetrics = computed(() => {
  const dataset = performanceDataset.value
  const { bounds, averages, medianWeight } = dataset.summary
  return {
    pointCount: dataset.size.toLocaleString(),
    lngSpan: (bounds.maxLng - bounds.minLng).toFixed(3),
    latSpan: (bounds.maxLat - bounds.minLat).toFixed(3),
    averageWeight: averages.weight.toFixed(2),
    medianWeight: medianWeight.toFixed(2),
  }
})

const performanceSamples = computed(() => performanceDataset.value.samples)
const performanceMassData = computed(() => performanceDataset.value.mass)
const performanceDescription = computed(() => performanceDataset.value.description)
const showPerformanceMassMarks = computed(() => activePanel.value === 'performance')

const massMarkerStyles = ref<AMap.MassMarkersStyleOptions[]>([])

function createMassStyle(amap: typeof AMap, color: string): AMap.MassMarkersStyleOptions {
  const size = new amap.Size(10, 10)
  const anchor = new amap.Pixel(5, 5)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="${color}" fill-opacity="0.9"/><circle cx="6" cy="6" r="2.5" fill="#ffffff" fill-opacity="0.55"/></svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    size,
    anchor,
  }
}

function handleMapReady() {
  if (massMarkerStyles.value.length > 0 || typeof window === 'undefined')
    return

  const AMapGlobal = (window as typeof window & { AMap?: typeof AMap }).AMap
  if (!AMapGlobal)
    return

  massMarkerStyles.value = [
    createMassStyle(AMapGlobal, '#2563eb'),
    createMassStyle(AMapGlobal, '#f97316'),
    createMassStyle(AMapGlobal, '#16a34a'),
  ]
}

const polylinePath: LngLatTuple[] = [
  [116.391312, 39.907415],
  [116.397428, 39.90923],
  [116.402199, 39.915599],
  [116.410333, 39.914884],
]

const polygonPath: LngLatTuple[] = [
  [116.394226, 39.913723],
  [116.40507, 39.918988],
  [116.411302, 39.909955],
  [116.403112, 39.90399],
]

const viewModeOptions: Array<{ label: string, value: ViewMode }> = [
  { label: '3D (default)', value: '3D' },
  { label: '2D', value: '2D' },
]

const mapStyleOptions: Array<{ label: string, value: MapStyleKey }> = [
  { label: 'Default', value: 'default' },
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
  { label: 'Fresh', value: 'fresh' },
  { label: 'Grey', value: 'grey' },
  { label: 'Whitesmoke', value: 'whitesmoke' },
  { label: 'Macaron', value: 'macaron' },
  { label: 'Blue', value: 'blue' },
  { label: 'Dark Blue', value: 'darkblue' },
]

const markerDirectionOptions: Array<{ label: string, value: MarkerLabelDirection }> = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Center', value: 'center' },
]

const infoWindowAnchorOptions: Array<{ label: string, value: InfoWindowAnchor }> = [
  { label: 'Top left', value: 'top-left' },
  { label: 'Top center', value: 'top-center' },
  { label: 'Top right', value: 'top-right' },
  { label: 'Middle left', value: 'middle-left' },
  { label: 'Center', value: 'center' },
  { label: 'Middle right', value: 'middle-right' },
  { label: 'Bottom left', value: 'bottom-left' },
  { label: 'Bottom center', value: 'bottom-center' },
  { label: 'Bottom right', value: 'bottom-right' },
]

const controlPositionOptions: Array<{ label: string, value: ControlPosition }> = [
  { label: 'Left top', value: 'LT' },
  { label: 'Right top', value: 'RT' },
  { label: 'Left bottom', value: 'LB' },
  { label: 'Right bottom', value: 'RB' },
]

const mapTypeDefaultOptions = [
  { label: 'Standard map', value: 0 },
  { label: 'Satellite map', value: 1 },
]

const centerText = computed(() => {
  const [lng, lat] = center.value
  return `${lng.toFixed(6)}, ${lat.toFixed(6)}`
})

const resolvedMapStyle = computed(() => {
  if (mapStyle.value === 'default')
    return undefined
  return `amap://styles/${mapStyle.value}`
})

const showMarker = computed(() => ['map', 'marker', 'infoWindow'].includes(activePanel.value))

const markerLabel = computed(() => {
  if (!markerState.showLabel || !markerState.labelText.trim())
    return undefined
  return {
    content: markerState.labelText,
    direction: markerState.labelDirection,
  } satisfies AMap.MarkerLabelOptions
})

const markerOffset = computed(() => [markerState.offsetX, markerState.offsetY] as [number, number])
const infoWindowOffset = computed(() => [infoWindowState.offsetX, infoWindowState.offsetY] as [number, number])

const polylineOptions = computed(() => ({
  strokeColor: polylineState.strokeColor,
  strokeWeight: polylineState.strokeWeight,
  strokeOpacity: 0.9,
  lineJoin: 'round',
  lineCap: 'round',
}))

const polygonOptions = computed(() => ({
  strokeColor: polygonState.strokeColor,
  strokeWeight: 2,
  fillColor: polygonState.fillColor,
  fillOpacity: polygonState.fillOpacity,
}))

const circleOptions = computed(() => ({
  strokeColor: circleState.strokeColor,
  strokeWeight: circleState.strokeWeight,
  strokeOpacity: 0.9,
  fillColor: circleState.fillColor,
  fillOpacity: circleState.fillOpacity,
}))

const toolBarOffset = computed(() => [toolBarState.offsetX, toolBarState.offsetY] as [number, number])
const scaleOffset = computed(() => [scaleState.offsetX, scaleState.offsetY] as [number, number])
const controlBarOffset = computed(() => [controlBarState.offsetX, controlBarState.offsetY] as [number, number])
const mapTypeOffset = computed(() => [mapTypeState.offsetX, mapTypeState.offsetY] as [number, number])

watch(activePanel, (panel) => {
  if (panel === 'infoWindow')
    infoWindowState.isOpen = true
})

function resetView() {
  center.value = [...initialCenter] as LngLatTuple
  zoom.value = 12
  pitch.value = 40
  rotation.value = 0
  viewMode.value = '3D'
  mapStyle.value = 'default'
}

function stepZoom(delta: number) {
  zoom.value = Math.min(18, Math.max(3, zoom.value + delta))
}

function nudge(lngDelta: number, latDelta: number) {
  const [lng, lat] = center.value
  center.value = [
    Number((lng + lngDelta).toFixed(6)),
    Number((lat + latDelta).toFixed(6)),
  ] as LngLatTuple
}

function handleMapMoveend(event: any) {
  const map = event?.target as AMap.Map | undefined
  const currentCenter = map?.getCenter?.()
  if (currentCenter)
    center.value = [Number(currentCenter.getLng().toFixed(6)), Number(currentCenter.getLat().toFixed(6))] as LngLatTuple

  const currentZoom = map?.getZoom?.()
  if (typeof currentZoom === 'number')
    zoom.value = Math.round(currentZoom)

  const currentPitch = map?.getPitch?.()
  if (typeof currentPitch === 'number')
    pitch.value = Math.round(currentPitch)

  const currentRotation = map?.getRotation?.()
  if (typeof currentRotation === 'number')
    rotation.value = Math.round(currentRotation)
}

function handleMarkerDragend(event: any) {
  const { lnglat } = event ?? {}
  if (lnglat)
    center.value = [Number(lnglat.lng.toFixed(6)), Number(lnglat.lat.toFixed(6))] as LngLatTuple
}

function handleMarkerClick() {
  if (activePanel.value === 'infoWindow')
    infoWindowState.isOpen = true
}
</script>

<template>
  <main class="playground">
    <aside class="sidebar">
      <header class="header">
        <h1>AMap Vue Kit Playground</h1>
        <p>Switch between component panels to preview props, events, and runtime behaviour.</p>
      </header>

      <nav class="panel-nav" aria-label="Component panels">
        <button
          v-for="panel in panels"
          :key="panel.id"
          type="button"
          class="panel-tab"
          :class="{ active: activePanel === panel.id }"
          @click="activePanel = panel.id"
        >
          {{ panel.label }}
        </button>
      </nav>

      <section class="card">
        <header class="panel-header">
          <h2>{{ activePanelMeta.label }}</h2>
          <p>{{ activePanelMeta.description }}</p>
        </header>

        <div v-if="activePanel === 'map'" class="panel-body">
          <dl class="metrics">
            <div>
              <dt>Center</dt>
              <dd>{{ centerText }}</dd>
            </div>
            <div>
              <dt>Zoom</dt>
              <dd>{{ zoom }}</dd>
            </div>
            <div>
              <dt>Pitch</dt>
              <dd>{{ pitch }}°</dd>
            </div>
            <div>
              <dt>Rotation</dt>
              <dd>{{ rotation }}°</dd>
            </div>
          </dl>

          <div class="button-row">
            <button type="button" @click="resetView">
              Reset view
            </button>
            <button type="button" @click="stepZoom(1)">
              Zoom in
            </button>
            <button type="button" @click="stepZoom(-1)">
              Zoom out
            </button>
          </div>

          <div class="nudge-grid">
            <button type="button" @click="nudge(0, 0.01)">
              Move north
            </button>
            <div class="nudge-center">
              <button type="button" @click="nudge(-0.01, 0)">
                Move west
              </button>
              <button type="button" @click="nudge(0.01, 0)">
                Move east
              </button>
            </div>
            <button type="button" @click="nudge(0, -0.01)">
              Move south
            </button>
          </div>

          <div class="form-grid">
            <label class="form-field">
              <span>View mode</span>
              <select v-model="viewMode">
                <option v-for="option in viewModeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="form-field">
              <span>Map style</span>
              <select v-model="mapStyle">
                <option v-for="option in mapStyleOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="form-field slider">
              <span>Pitch</span>
              <div class="slider-control">
                <input v-model.number="pitch" type="range" min="0" max="75" step="1">
                <span>{{ pitch }}°</span>
              </div>
            </label>

            <label class="form-field slider">
              <span>Rotation</span>
              <div class="slider-control">
                <input v-model.number="rotation" type="range" min="0" max="360" step="1">
                <span>{{ rotation }}°</span>
              </div>
            </label>
          </div>
        </div>

        <div v-else-if="activePanel === 'marker'" class="panel-body">
          <label class="toggle">
            <input v-model="markerState.draggable" type="checkbox">
            <span>Marker is draggable</span>
          </label>
          <label class="toggle">
            <input v-model="markerState.showLabel" type="checkbox">
            <span>Show label</span>
          </label>

          <label class="form-field">
            <span>Label text</span>
            <input v-model="markerState.labelText" type="text" placeholder="Marker label">
          </label>

          <label class="form-field">
            <span>Label direction</span>
            <select v-model="markerState.labelDirection">
              <option v-for="option in markerDirectionOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <div class="form-field inline">
            <span>Offset (px)</span>
            <div class="inline-inputs">
              <input v-model.number="markerState.offsetX" type="number" step="1" aria-label="Marker offset X">
              <input v-model.number="markerState.offsetY" type="number" step="1" aria-label="Marker offset Y">
            </div>
          </div>
        </div>

        <div v-else-if="activePanel === 'infoWindow'" class="panel-body">
          <label class="toggle">
            <input v-model="infoWindowState.isOpen" type="checkbox">
            <span>Info window open</span>
          </label>

          <label class="form-field">
            <span>Anchor</span>
            <select v-model="infoWindowState.anchor">
              <option v-for="option in infoWindowAnchorOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <div class="form-field inline">
            <span>Offset (px)</span>
            <div class="inline-inputs">
              <input v-model.number="infoWindowState.offsetX" type="number" step="1" aria-label="Info window offset X">
              <input v-model.number="infoWindowState.offsetY" type="number" step="1" aria-label="Info window offset Y">
            </div>
          </div>

          <label class="form-field">
            <span>Title</span>
            <input v-model="infoWindowState.title" type="text" placeholder="Window title">
          </label>

          <label class="form-field">
            <span>Body</span>
            <textarea v-model="infoWindowState.body" rows="3" />
          </label>
        </div>

        <div v-else-if="activePanel === 'polyline'" class="panel-body">
          <label class="toggle">
            <input v-model="polylineState.visible" type="checkbox">
            <span>Show polyline</span>
          </label>

          <label class="form-field slider">
            <span>Stroke weight</span>
            <div class="slider-control">
              <input v-model.number="polylineState.strokeWeight" type="range" min="1" max="12" step="1">
              <span>{{ polylineState.strokeWeight }} px</span>
            </div>
          </label>

          <label class="form-field">
            <span>Stroke colour</span>
            <input v-model="polylineState.strokeColor" type="color">
          </label>
        </div>

        <div v-else-if="activePanel === 'polygon'" class="panel-body">
          <label class="toggle">
            <input v-model="polygonState.visible" type="checkbox">
            <span>Show polygon</span>
          </label>

          <label class="form-field">
            <span>Stroke colour</span>
            <input v-model="polygonState.strokeColor" type="color">
          </label>

          <label class="form-field">
            <span>Fill colour</span>
            <input v-model="polygonState.fillColor" type="color">
          </label>

          <label class="form-field slider">
            <span>Fill opacity</span>
            <div class="slider-control">
              <input v-model.number="polygonState.fillOpacity" type="range" min="0" max="1" step="0.05">
              <span>{{ Math.round(polygonState.fillOpacity * 100) }}%</span>
            </div>
          </label>
        </div>

        <div v-else-if="activePanel === 'circle'" class="panel-body">
          <label class="toggle">
            <input v-model="circleState.visible" type="checkbox">
            <span>Show circle</span>
          </label>

          <label class="form-field slider">
            <span>Radius</span>
            <div class="slider-control">
              <input v-model.number="circleState.radius" type="range" min="100" max="2000" step="50">
              <span>{{ circleState.radius }} m</span>
            </div>
          </label>

          <label class="form-field">
            <span>Stroke colour</span>
            <input v-model="circleState.strokeColor" type="color">
          </label>

          <label class="form-field">
            <span>Fill colour</span>
            <input v-model="circleState.fillColor" type="color">
          </label>

          <label class="form-field slider">
            <span>Fill opacity</span>
            <div class="slider-control">
              <input v-model.number="circleState.fillOpacity" type="range" min="0" max="1" step="0.05">
              <span>{{ Math.round(circleState.fillOpacity * 100) }}%</span>
            </div>
          </label>
        </div>

        <div v-else-if="activePanel === 'tileLayer'" class="panel-body">
          <label class="toggle">
            <input v-model="tileLayerState.visible" type="checkbox">
            <span>Show tile layer</span>
          </label>

          <label class="form-field slider">
            <span>Opacity</span>
            <div class="slider-control">
              <input v-model.number="tileLayerState.opacity" type="range" min="0" max="1" step="0.05">
              <span>{{ Math.round(tileLayerState.opacity * 100) }}%</span>
            </div>
          </label>

          <label class="form-field">
            <span>Tile URL template</span>
            <input v-model="tileLayerState.tileUrl" type="text" spellcheck="false">
            <small class="field-hint">Supports [x], [y], [z] placeholders.</small>
          </label>
        </div>

        <div v-else-if="activePanel === 'traffic'" class="panel-body">
          <label class="toggle">
            <input v-model="trafficState.visible" type="checkbox">
            <span>Show traffic layer</span>
          </label>

          <label class="toggle">
            <input v-model="trafficState.autoRefresh" type="checkbox">
            <span>Auto refresh</span>
          </label>

          <label class="form-field">
            <span>Refresh interval (s)</span>
            <input v-model.number="trafficState.interval" type="number" min="15" max="300" step="15">
          </label>

          <label class="form-field slider">
            <span>Opacity</span>
            <div class="slider-control">
              <input v-model.number="trafficState.opacity" type="range" min="0" max="1" step="0.05">
              <span>{{ Math.round(trafficState.opacity * 100) }}%</span>
            </div>
          </label>
        </div>

        <div v-else-if="activePanel === 'satellite'" class="panel-body">
          <label class="toggle">
            <input v-model="satelliteState.visible" type="checkbox">
            <span>Show satellite imagery</span>
          </label>

          <label class="form-field slider">
            <span>Opacity</span>
            <div class="slider-control">
              <input v-model.number="satelliteState.opacity" type="range" min="0" max="1" step="0.05">
              <span>{{ Math.round(satelliteState.opacity * 100) }}%</span>
            </div>
          </label>
        </div>

        <div v-else-if="activePanel === 'roadNet'" class="panel-body">
          <label class="toggle">
            <input v-model="roadNetState.visible" type="checkbox">
            <span>Show road network</span>
          </label>

          <label class="form-field slider">
            <span>Opacity</span>
            <div class="slider-control">
              <input v-model.number="roadNetState.opacity" type="range" min="0" max="1" step="0.05">
              <span>{{ Math.round(roadNetState.opacity * 100) }}%</span>
            </div>
          </label>
        </div>

        <div v-else-if="activePanel === 'toolBar'" class="panel-body">
          <label class="toggle">
            <input v-model="toolBarState.visible" type="checkbox">
            <span>Show tool bar</span>
          </label>

          <label class="form-field">
            <span>Position</span>
            <select v-model="toolBarState.position">
              <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <div class="form-field inline">
            <span>Offset (px)</span>
            <div class="inline-inputs">
              <input v-model.number="toolBarState.offsetX" type="number" step="1" aria-label="Tool bar offset X">
              <input v-model.number="toolBarState.offsetY" type="number" step="1" aria-label="Tool bar offset Y">
            </div>
          </div>
        </div>

        <div v-else-if="activePanel === 'scale'" class="panel-body">
          <label class="toggle">
            <input v-model="scaleState.visible" type="checkbox">
            <span>Show scale</span>
          </label>

          <label class="form-field">
            <span>Position</span>
            <select v-model="scaleState.position">
              <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <div class="form-field inline">
            <span>Offset (px)</span>
            <div class="inline-inputs">
              <input v-model.number="scaleState.offsetX" type="number" step="1" aria-label="Scale offset X">
              <input v-model.number="scaleState.offsetY" type="number" step="1" aria-label="Scale offset Y">
            </div>
          </div>
        </div>

        <div v-else-if="activePanel === 'controlBar'" class="panel-body">
          <label class="toggle">
            <input v-model="controlBarState.visible" type="checkbox">
            <span>Show control bar</span>
          </label>

          <label class="toggle">
            <input v-model="controlBarState.showZoomBar" type="checkbox">
            <span>Show zoom bar</span>
          </label>

          <label class="toggle">
            <input v-model="controlBarState.showControlButton" type="checkbox">
            <span>Show tilt button</span>
          </label>

          <label class="form-field">
            <span>Position</span>
            <select v-model="controlBarState.position">
              <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <div class="form-field inline">
            <span>Offset (px)</span>
            <div class="inline-inputs">
              <input v-model.number="controlBarState.offsetX" type="number" step="1" aria-label="Control bar offset X">
              <input v-model.number="controlBarState.offsetY" type="number" step="1" aria-label="Control bar offset Y">
            </div>
          </div>
        </div>

        <div v-else-if="activePanel === 'mapType'" class="panel-body">
          <label class="toggle">
            <input v-model="mapTypeState.visible" type="checkbox">
            <span>Show map type control</span>
          </label>

          <label class="form-field">
            <span>Default type</span>
            <select v-model.number="mapTypeState.defaultType">
              <option v-for="option in mapTypeDefaultOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="toggle">
            <input v-model="mapTypeState.showTraffic" type="checkbox">
            <span>Allow traffic toggle</span>
          </label>

          <label class="toggle">
            <input v-model="mapTypeState.showRoad" type="checkbox">
            <span>Allow road net toggle</span>
          </label>

          <label class="form-field">
            <span>Position</span>
            <select v-model="mapTypeState.position">
              <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <div class="form-field inline">
            <span>Offset (px)</span>
            <div class="inline-inputs">
              <input v-model.number="mapTypeState.offsetX" type="number" step="1" aria-label="Map type offset X">
              <input v-model.number="mapTypeState.offsetY" type="number" step="1" aria-label="Map type offset Y">
            </div>
          </div>
        </div>

        <div v-else-if="activePanel === 'performance'" class="panel-body">
          <label class="form-field">
            <span>Dataset size</span>
            <select v-model="performanceDatasetId">
              <option v-for="option in performanceDatasetOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <p class="dataset-description">
            {{ performanceDescription }}
          </p>

          <dl class="metrics metrics-wide">
            <div>
              <dt>Points</dt>
              <dd>{{ performanceMetrics.pointCount }}</dd>
            </div>
            <div>
              <dt>Lng span</dt>
              <dd>{{ performanceMetrics.lngSpan }}°</dd>
            </div>
            <div>
              <dt>Lat span</dt>
              <dd>{{ performanceMetrics.latSpan }}°</dd>
            </div>
            <div>
              <dt>Avg weight</dt>
              <dd>{{ performanceMetrics.averageWeight }}</dd>
            </div>
            <div>
              <dt>Median weight</dt>
              <dd>{{ performanceMetrics.medianWeight }}</dd>
            </div>
          </dl>

          <div class="dataset-sample">
            <header>
              <h3>Sample points</h3>
              <p>
                First five entries for quick inspection.
              </p>
            </header>
            <ul>
              <li
                v-for="(sample, index) in performanceSamples"
                :key="`${sample.clusterId}-${sample.lng}-${sample.lat}`"
              >
                <span class="sample-index">#{{ index + 1 }}</span>
                <code>{{ sample.lng.toFixed(6) }}, {{ sample.lat.toFixed(6) }}</code>
                <span class="sample-meta">Cluster {{ sample.clusterId + 1 }} · weight {{ sample.weight.toFixed(2) }}</span>
              </li>
            </ul>
          </div>

          <p class="dataset-hint">
            Use the selected dataset with mass markers or heat maps to measure FPS and render latency. Swap sizes to compare
            batching throughput.
          </p>
        </div>
      </section>

      <section class="card notice">
        <h2>API key</h2>
        <p v-if="hasKey">
          Using key from <code>.env.local</code>. Restart the dev server after changing it.
        </p>
        <p v-else>
          Add <code>VITE_AMAP_KEY</code> to <code>.env.local</code> to load the live JSAPI map. Without it the container shows a
          placeholder.
        </p>
      </section>
    </aside>

    <section class="map-container">
      <div v-if="!hasKey" class="map-placeholder">
        <strong>No API key detected.</strong>
        <p>
          Set <code>VITE_AMAP_KEY</code> to explore the interactive map. The controls on the left still update component props.
        </p>
      </div>
      <AmapMap
        v-else
        class="map"
        :center="center"
        :zoom="zoom"
        :pitch="pitch"
        :rotation="rotation"
        :view-mode="viewMode"
        :map-style="resolvedMapStyle"
        @ready="handleMapReady"
        @moveend="handleMapMoveend"
      >
        <AmapMarker
          v-if="showMarker"
          :position="center"
          :draggable="markerState.draggable"
          :label="markerLabel"
          :offset="markerOffset"
          @click="handleMarkerClick"
          @dragend="handleMarkerDragend"
        />
        <AmapInfoWindow
          v-if="activePanel === 'infoWindow'"
          :position="center"
          :is-open="infoWindowState.isOpen"
          :anchor="infoWindowState.anchor"
          :offset="infoWindowOffset"
          @close="infoWindowState.isOpen = false"
          @open="infoWindowState.isOpen = true"
        >
          <div class="info-window">
            <h3>{{ infoWindowState.title }}</h3>
            <p>{{ infoWindowState.body }}</p>
          </div>
        </AmapInfoWindow>
        <AmapPolyline
          v-if="activePanel === 'polyline' && polylineState.visible"
          :path="polylinePath"
          :options="polylineOptions"
        />
        <AmapPolygon
          v-if="activePanel === 'polygon' && polygonState.visible"
          :path="polygonPath"
          :options="polygonOptions"
        />
        <AmapCircle
          v-if="activePanel === 'circle' && circleState.visible"
          :center="center"
          :radius="circleState.radius"
          :options="circleOptions"
        />
        <AmapTileLayer
          v-if="activePanel === 'tileLayer'"
          :visible="tileLayerState.visible"
          :opacity="tileLayerState.opacity"
          :tile-url="tileLayerState.tileUrl"
        />
        <AmapTrafficLayer
          v-if="activePanel === 'traffic'"
          :visible="trafficState.visible"
          :auto-refresh="trafficState.autoRefresh"
          :interval="trafficState.interval"
          :opacity="trafficState.opacity"
        />
        <AmapSatelliteLayer
          v-if="activePanel === 'satellite'"
          :visible="satelliteState.visible"
          :opacity="satelliteState.opacity"
        />
        <AmapRoadNetLayer
          v-if="activePanel === 'roadNet'"
          :visible="roadNetState.visible"
          :opacity="roadNetState.opacity"
        />
        <AmapToolBar
          v-if="activePanel === 'toolBar'"
          :visible="toolBarState.visible"
          :position="toolBarState.position"
          :offset="toolBarOffset"
        />
        <AmapScale
          v-if="activePanel === 'scale'"
          :visible="scaleState.visible"
          :position="scaleState.position"
          :offset="scaleOffset"
        />
        <AmapControlBar
          v-if="activePanel === 'controlBar'"
          :visible="controlBarState.visible"
          :position="controlBarState.position"
          :offset="controlBarOffset"
          :show-zoom-bar="controlBarState.showZoomBar"
          :show-control-button="controlBarState.showControlButton"
        />
        <AmapMapType
          v-if="activePanel === 'mapType'"
          :visible="mapTypeState.visible"
          :position="mapTypeState.position"
          :offset="mapTypeOffset"
          :default-type="mapTypeState.defaultType"
          :show-traffic="mapTypeState.showTraffic"
          :show-road="mapTypeState.showRoad"
        />
        <AmapMassMarks
          v-if="showPerformanceMassMarks"
          :data="performanceMassData"
          :style="massMarkerStyles"
        />
      </AmapMap>
    </section>
  </main>
</template>

<style scoped>
.playground {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  background: #f1f5f9;
  color: #0f172a;
}

.sidebar {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.75));
  backdrop-filter: blur(12px);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.header p {
  margin: 0.75rem 0 0;
  line-height: 1.5;
  color: #475569;
}

.panel-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.panel-tab {
  border: none;
  border-radius: 9999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  background: rgba(148, 163, 184, 0.2);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.panel-tab.active {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 12px 30px -18px rgba(37, 99, 235, 0.7);
}

.panel-tab:hover {
  background: rgba(59, 130, 246, 0.25);
}

.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.2rem 1.4rem;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 22px 50px -32px rgba(15, 23, 42, 0.45);
}

.panel-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.panel-header p {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
}

.panel-body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.metrics-wide {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.metrics div {
  background: rgba(15, 23, 42, 0.04);
  border-radius: 12px;
  padding: 0.75rem;
}

.metrics dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  margin: 0 0 0.25rem;
}

.metrics dd {
  margin: 0;
  font-family: 'Menlo', 'Fira Code', 'SFMono-Regular', monospace;
  font-size: 0.9rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.button-row button {
  border: none;
  border-radius: 9999px;
  padding: 0.45rem 0.95rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: #2563eb;
  cursor: pointer;
  transition: background 0.2s ease;
}

.button-row button:hover {
  background: #1d4ed8;
}

.nudge-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.nudge-center {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.nudge-grid button {
  border: none;
  border-radius: 12px;
  padding: 0.55rem 0.75rem;
  font-weight: 600;
  color: #1e293b;
  background: rgba(148, 163, 184, 0.18);
  cursor: pointer;
  transition: background 0.2s ease;
}

.nudge-grid button:hover {
  background: rgba(59, 130, 246, 0.25);
}

.form-grid {
  display: grid;
  gap: 0.8rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #334155;
}

.form-field select,
.form-field input[type='text'],
.form-field input[type='number'],
.form-field textarea {
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 10px;
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: inherit;
  background: rgba(255, 255, 255, 0.9);
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.form-field textarea {
  resize: vertical;
}

.form-field select:focus,
.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.8);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
}

.form-field.inline {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.inline-inputs {
  display: flex;
  gap: 0.5rem;
}

.inline-inputs input {
  width: 100%;
}

.slider {
  gap: 0.55rem;
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.slider-control input[type='range'] {
  flex: 1;
}

.slider-control span {
  min-width: 3rem;
  font-variant-numeric: tabular-nums;
  color: #1e293b;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #334155;
}

.toggle input {
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
}

.field-hint {
  font-size: 0.75rem;
  color: #64748b;
}

.notice {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.25);
}

.notice p {
  margin: 0;
  color: #1e293b;
  line-height: 1.6;
}

.dataset-description {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #475569;
}

.dataset-sample {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.9rem;
  border-radius: 14px;
  background: rgba(37, 99, 235, 0.05);
  border: 1px solid rgba(37, 99, 235, 0.15);
}

.dataset-sample header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1d4ed8;
}

.dataset-sample header p {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #475569;
}

.dataset-sample ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.dataset-sample li {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.75rem;
  row-gap: 0.25rem;
  align-items: center;
}

.dataset-sample code {
  font-family: 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  font-size: 0.78rem;
  color: #0f172a;
}

.sample-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1d4ed8;
  background: rgba(37, 99, 235, 0.12);
}

.sample-meta {
  grid-column: 1 / -1;
  font-size: 0.8rem;
  color: #475569;
}

.dataset-hint {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #334155;
}

.map-container {
  position: relative;
  background: #0f172a;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.map {
  width: 100%;
  height: 100vh;
}

.map-placeholder {
  margin: auto;
  max-width: 360px;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.9);
  color: #e2e8f0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map-placeholder strong {
  font-size: 1.1rem;
}

.map-placeholder code {
  background: rgba(148, 163, 184, 0.2);
  padding: 0.2rem 0.35rem;
  border-radius: 6px;
}

.info-window {
  min-width: 220px;
}

.info-window h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.info-window p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

@media (max-width: 960px) {
  .playground {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }

  .map {
    height: 70vh;
  }
}
</style>
