<script setup lang="ts">
import type { PerformanceDatasetId } from './data/performance-datasets'
import { computed, onBeforeUnmount, reactive, ref, shallowRef, watch } from 'vue'
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

type EventSource = 'Map' | 'Marker' | 'InfoWindow' | 'Panel' | 'Dataset' | 'Clipboard' | 'State'

interface EventLogEntry {
  id: number
  time: string
  source: EventSource
  summary: string
  detail?: string
}

const EVENT_LOG_LIMIT = 12
let eventLogId = 0
const eventLog = ref<EventLogEntry[]>([])

function formatTimestamp(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function logEvent(source: EventSource, summary: string, detail?: string) {
  const entry: EventLogEntry = {
    id: ++eventLogId,
    time: formatTimestamp(new Date()),
    source,
    summary,
    detail,
  }

  eventLog.value.unshift(entry)
  if (eventLog.value.length > EVENT_LOG_LIMIT)
    eventLog.value.splice(EVENT_LOG_LIMIT)
}

logEvent(
  'Map',
  hasKey.value ? 'API key detected' : 'API key missing',
  hasKey.value
    ? 'Map components will request JSAPI resources.'
    : 'Set VITE_AMAP_KEY in .env.local to load the live map.',
)

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

type PerformanceRenderMode = 'immediate' | 'chunked'

const performanceDatasetId = ref<PerformanceDatasetId>('small')
const performanceRenderMode = ref<PerformanceRenderMode>('immediate')

const performanceDataset = computed(() =>
  performanceDatasets.find(dataset => dataset.id === performanceDatasetId.value) ?? performanceDatasets[0],
)
const performanceRenderModeOptions: Array<{ label: string, value: PerformanceRenderMode }> = [
  { label: 'Immediate (single batch)', value: 'immediate' },
  { label: 'Chunked (progressive)', value: 'chunked' },
]

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

const performanceMassRenderData = shallowRef<AMap.MassData[]>(performanceMassData.value)
const MASS_CHUNK_SIZE = 800
let massRenderFrame: number | null = null

function cancelMassRenderTask() {
  if (massRenderFrame != null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(massRenderFrame)
    massRenderFrame = null
  }
}

function hydratePerformanceData() {
  cancelMassRenderTask()
  const data = performanceMassData.value
  if (performanceRenderMode.value !== 'chunked' || typeof window === 'undefined' || data.length <= MASS_CHUNK_SIZE) {
    performanceMassRenderData.value = data
    return
  }

  performanceMassRenderData.value = []
  if (data.length === 0)
    return

  let index = 0
  const step = () => {
    index = Math.min(index + MASS_CHUNK_SIZE, data.length)
    performanceMassRenderData.value = data.slice(0, index)
    if (index < data.length)
      massRenderFrame = window.requestAnimationFrame(step)
    else
      massRenderFrame = null
  }

  massRenderFrame = window.requestAnimationFrame(step)
}

const chunkProgress = computed(() => {
  const total = performanceMassData.value.length
  if (total === 0)
    return 1
  return Math.min(1, performanceMassRenderData.value.length / total)
})

const chunkProgressLabel = computed(() => {
  const total = performanceMassData.value.length
  if (total === 0)
    return '0 points loaded'
  const loaded = performanceMassRenderData.value.length
  const percentage = Math.round(chunkProgress.value * 100)
  return `${percentage}% · ${loaded.toLocaleString()} / ${total.toLocaleString()} points`
})

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

  logEvent('Map', 'ready', 'Map initialised and controls are interactive.')
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

const CONTROL_POSITION_VALUES: readonly ControlPosition[] = ['LT', 'RT', 'LB', 'RB']
const MARKER_LABEL_DIRECTIONS: readonly MarkerLabelDirection[] = ['top', 'bottom', 'left', 'right', 'center']
const INFO_WINDOW_ANCHORS: readonly InfoWindowAnchor[] = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'center',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]
const VIEW_MODE_VALUES: readonly ViewMode[] = ['2D', '3D']

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

const MAP_STYLE_VALUES = mapStyleOptions.map(option => option.value)
const PANEL_IDS = panels.map(panel => panel.id)

watch(activePanel, (panel, previousPanel) => {
  if (panel === 'infoWindow')
    infoWindowState.isOpen = true

  if (previousPanel && panel !== previousPanel)
    logEvent('Panel', 'switch', `Viewing ${panel} panel`)
})

watch(performanceDatasetId, (datasetId) => {
  const dataset = performanceDatasets.find(item => item.id === datasetId)
  if (dataset)
    logEvent('Dataset', 'switch', `${dataset.label} · ${dataset.size.toLocaleString()} points`)
})

watch([performanceMassData, performanceRenderMode], () => {
  hydratePerformanceData()
}, { immediate: true })

watch(performanceRenderMode, (mode, previous) => {
  if (!previous || mode === previous)
    return
  const summary = mode === 'chunked'
    ? 'Chunked updates · progressive hydration'
    : 'Immediate updates · single batch'
  logEvent('Dataset', 'render mode', summary)
})

watch(performanceMassRenderData, (value, previous) => {
  if (performanceRenderMode.value !== 'chunked')
    return
  const total = performanceMassData.value.length
  if (total === 0)
    return
  if (value.length === total && (previous?.length ?? 0) !== total)
    logEvent('Dataset', 'chunked ready', `${total.toLocaleString()} points hydrated`)
})

interface PlaygroundState {
  activePanel: PanelId
  center: LngLatTuple
  zoom: number
  pitch: number
  rotation: number
  viewMode: ViewMode
  mapStyle: MapStyleKey
  marker: {
    draggable: boolean
    showLabel: boolean
    labelText: string
    labelDirection: MarkerLabelDirection
    offsetX: number
    offsetY: number
  }
  infoWindow: {
    isOpen: boolean
    title: string
    body: string
    anchor: InfoWindowAnchor
    offsetX: number
    offsetY: number
  }
  polyline: {
    visible: boolean
    strokeColor: string
    strokeWeight: number
  }
  polygon: {
    visible: boolean
    strokeColor: string
    fillColor: string
    fillOpacity: number
  }
  circle: {
    visible: boolean
    radius: number
    strokeColor: string
    strokeWeight: number
    fillColor: string
    fillOpacity: number
  }
  tileLayer: {
    visible: boolean
    opacity: number
    tileUrl: string
  }
  traffic: {
    visible: boolean
    autoRefresh: boolean
    interval: number
    opacity: number
  }
  satellite: {
    visible: boolean
    opacity: number
  }
  roadNet: {
    visible: boolean
    opacity: number
  }
  toolBar: {
    visible: boolean
    position: ControlPosition
    offsetX: number
    offsetY: number
  }
  scale: {
    visible: boolean
    position: ControlPosition
    offsetX: number
    offsetY: number
  }
  controlBar: {
    visible: boolean
    position: ControlPosition
    offsetX: number
    offsetY: number
    showZoomBar: boolean
    showControlButton: boolean
  }
  mapType: {
    visible: boolean
    position: ControlPosition
    offsetX: number
    offsetY: number
    defaultType: number
    showTraffic: boolean
    showRoad: boolean
  }
  performanceDatasetId: PerformanceDatasetId
  performanceRenderMode: PerformanceRenderMode
}

type RestoreSource = 'hash' | 'storage'

const PLAYGROUND_STORAGE_KEY = 'amap-vue-kit:playground-state'
const PLAYGROUND_HASH_KEY = 'state'

let persistencePaused = false
let lastStoredState = ''

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value))
    return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed))
      return parsed
  }
  return undefined
}

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean')
    return value
  if (typeof value === 'string') {
    if (value === 'true')
      return true
    if (value === 'false')
      return false
  }
  return undefined
}

function toLngLatTuple(value: unknown): LngLatTuple | undefined {
  if (!Array.isArray(value) || value.length !== 2)
    return undefined
  const [lngValue, latValue] = value
  const lng = toFiniteNumber(lngValue)
  const lat = toFiniteNumber(latValue)
  if (lng == null || lat == null)
    return undefined
  return [lng, lat] as LngLatTuple
}

function isPanelId(value: unknown): value is PanelId {
  return typeof value === 'string' && PANEL_IDS.includes(value as PanelId)
}

function isViewMode(value: unknown): value is ViewMode {
  return typeof value === 'string' && (VIEW_MODE_VALUES as readonly string[]).includes(value)
}

function isMapStyle(value: unknown): value is MapStyleKey {
  return typeof value === 'string' && (MAP_STYLE_VALUES as readonly string[]).includes(value)
}

function isMarkerDirection(value: unknown): value is MarkerLabelDirection {
  return typeof value === 'string' && (MARKER_LABEL_DIRECTIONS as readonly string[]).includes(value)
}

function isInfoWindowAnchor(value: unknown): value is InfoWindowAnchor {
  return typeof value === 'string' && (INFO_WINDOW_ANCHORS as readonly string[]).includes(value)
}

function isControlPosition(value: unknown): value is ControlPosition {
  return typeof value === 'string' && (CONTROL_POSITION_VALUES as readonly string[]).includes(value)
}

function isPerformanceRenderMode(value: unknown): value is PerformanceRenderMode {
  return value === 'immediate' || value === 'chunked'
}

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
  let restored = false

  try {
    if (state.activePanel && isPanelId(state.activePanel)) {
      activePanel.value = state.activePanel
      restored = true
    }

    const restoredCenter = toLngLatTuple(state.center)
    if (restoredCenter) {
      center.value = restoredCenter
      restored = true
    }

    const restoredZoom = toFiniteNumber(state.zoom)
    if (restoredZoom != null) {
      zoom.value = Math.round(restoredZoom)
      restored = true
    }

    const restoredPitch = toFiniteNumber(state.pitch)
    if (restoredPitch != null) {
      pitch.value = Math.round(restoredPitch)
      restored = true
    }

    const restoredRotation = toFiniteNumber(state.rotation)
    if (restoredRotation != null) {
      rotation.value = Math.round(restoredRotation)
      restored = true
    }

    if (state.viewMode && isViewMode(state.viewMode)) {
      viewMode.value = state.viewMode
      restored = true
    }

    if (state.mapStyle && isMapStyle(state.mapStyle)) {
      mapStyle.value = state.mapStyle
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
        markerState.draggable = draggable
        restored = true
      }
      if (showLabel != null) {
        markerState.showLabel = showLabel
        restored = true
      }
      if (labelText != null) {
        markerState.labelText = labelText
        restored = true
      }
      if (labelDirection) {
        markerState.labelDirection = labelDirection
        restored = true
      }
      if (offsetX != null) {
        markerState.offsetX = offsetX
        restored = true
      }
      if (offsetY != null) {
        markerState.offsetY = offsetY
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
        infoWindowState.isOpen = isOpen
        restored = true
      }
      if (title != null) {
        infoWindowState.title = title
        restored = true
      }
      if (body != null) {
        infoWindowState.body = body
        restored = true
      }
      if (anchor) {
        infoWindowState.anchor = anchor
        restored = true
      }
      if (offsetX != null) {
        infoWindowState.offsetX = offsetX
        restored = true
      }
      if (offsetY != null) {
        infoWindowState.offsetY = offsetY
        restored = true
      }
    }

    if (state.polyline) {
      const polyline = state.polyline
      const visible = toBoolean(polyline.visible)
      const strokeColor = typeof polyline.strokeColor === 'string' ? polyline.strokeColor : undefined
      const strokeWeight = toFiniteNumber(polyline.strokeWeight)

      if (visible != null) {
        polylineState.visible = visible
        restored = true
      }
      if (strokeColor != null) {
        polylineState.strokeColor = strokeColor
        restored = true
      }
      if (strokeWeight != null) {
        polylineState.strokeWeight = Math.max(1, Math.round(strokeWeight))
        restored = true
      }
    }

    if (state.polygon) {
      const polygon = state.polygon
      const visible = toBoolean(polygon.visible)
      const strokeColor = typeof polygon.strokeColor === 'string' ? polygon.strokeColor : undefined
      const fillColor = typeof polygon.fillColor === 'string' ? polygon.fillColor : undefined
      const fillOpacity = toFiniteNumber(polygon.fillOpacity)

      if (visible != null) {
        polygonState.visible = visible
        restored = true
      }
      if (strokeColor != null) {
        polygonState.strokeColor = strokeColor
        restored = true
      }
      if (fillColor != null) {
        polygonState.fillColor = fillColor
        restored = true
      }
      if (fillOpacity != null) {
        polygonState.fillOpacity = Math.min(1, Math.max(0, fillOpacity))
        restored = true
      }
    }

    if (state.circle) {
      const circle = state.circle
      const visible = toBoolean(circle.visible)
      const radius = toFiniteNumber(circle.radius)
      const strokeColor = typeof circle.strokeColor === 'string' ? circle.strokeColor : undefined
      const strokeWeight = toFiniteNumber(circle.strokeWeight)
      const fillColor = typeof circle.fillColor === 'string' ? circle.fillColor : undefined
      const fillOpacity = toFiniteNumber(circle.fillOpacity)

      if (visible != null) {
        circleState.visible = visible
        restored = true
      }
      if (radius != null) {
        circleState.radius = Math.max(0, Math.round(radius))
        restored = true
      }
      if (strokeColor != null) {
        circleState.strokeColor = strokeColor
        restored = true
      }
      if (strokeWeight != null) {
        circleState.strokeWeight = Math.max(1, Math.round(strokeWeight))
        restored = true
      }
      if (fillColor != null) {
        circleState.fillColor = fillColor
        restored = true
      }
      if (fillOpacity != null) {
        circleState.fillOpacity = Math.min(1, Math.max(0, fillOpacity))
        restored = true
      }
    }

    if (state.tileLayer) {
      const tileLayer = state.tileLayer
      const visible = toBoolean(tileLayer.visible)
      const opacity = toFiniteNumber(tileLayer.opacity)
      const tileUrl = typeof tileLayer.tileUrl === 'string' ? tileLayer.tileUrl : undefined

      if (visible != null) {
        tileLayerState.visible = visible
        restored = true
      }
      if (opacity != null) {
        tileLayerState.opacity = Math.min(1, Math.max(0, opacity))
        restored = true
      }
      if (tileUrl != null) {
        tileLayerState.tileUrl = tileUrl
        restored = true
      }
    }

    if (state.traffic) {
      const traffic = state.traffic
      const visible = toBoolean(traffic.visible)
      const autoRefresh = toBoolean(traffic.autoRefresh)
      const interval = toFiniteNumber(traffic.interval)
      const opacity = toFiniteNumber(traffic.opacity)

      if (visible != null) {
        trafficState.visible = visible
        restored = true
      }
      if (autoRefresh != null) {
        trafficState.autoRefresh = autoRefresh
        restored = true
      }
      if (interval != null) {
        trafficState.interval = Math.max(1, Math.round(interval))
        restored = true
      }
      if (opacity != null) {
        trafficState.opacity = Math.min(1, Math.max(0, opacity))
        restored = true
      }
    }

    if (state.satellite) {
      const satellite = state.satellite
      const visible = toBoolean(satellite.visible)
      const opacity = toFiniteNumber(satellite.opacity)

      if (visible != null) {
        satelliteState.visible = visible
        restored = true
      }
      if (opacity != null) {
        satelliteState.opacity = Math.min(1, Math.max(0, opacity))
        restored = true
      }
    }

    if (state.roadNet) {
      const roadNet = state.roadNet
      const visible = toBoolean(roadNet.visible)
      const opacity = toFiniteNumber(roadNet.opacity)

      if (visible != null) {
        roadNetState.visible = visible
        restored = true
      }
      if (opacity != null) {
        roadNetState.opacity = Math.min(1, Math.max(0, opacity))
        restored = true
      }
    }

    if (state.toolBar) {
      const toolBar = state.toolBar
      const visible = toBoolean(toolBar.visible)
      const position = isControlPosition(toolBar.position) ? toolBar.position : undefined
      const offsetX = toFiniteNumber(toolBar.offsetX)
      const offsetY = toFiniteNumber(toolBar.offsetY)

      if (visible != null) {
        toolBarState.visible = visible
        restored = true
      }
      if (position) {
        toolBarState.position = position
        restored = true
      }
      if (offsetX != null) {
        toolBarState.offsetX = Math.round(offsetX)
        restored = true
      }
      if (offsetY != null) {
        toolBarState.offsetY = Math.round(offsetY)
        restored = true
      }
    }

    if (state.scale) {
      const scale = state.scale
      const visible = toBoolean(scale.visible)
      const position = isControlPosition(scale.position) ? scale.position : undefined
      const offsetX = toFiniteNumber(scale.offsetX)
      const offsetY = toFiniteNumber(scale.offsetY)

      if (visible != null) {
        scaleState.visible = visible
        restored = true
      }
      if (position) {
        scaleState.position = position
        restored = true
      }
      if (offsetX != null) {
        scaleState.offsetX = Math.round(offsetX)
        restored = true
      }
      if (offsetY != null) {
        scaleState.offsetY = Math.round(offsetY)
        restored = true
      }
    }

    if (state.controlBar) {
      const controlBar = state.controlBar
      const visible = toBoolean(controlBar.visible)
      const position = isControlPosition(controlBar.position) ? controlBar.position : undefined
      const offsetX = toFiniteNumber(controlBar.offsetX)
      const offsetY = toFiniteNumber(controlBar.offsetY)
      const showZoomBar = toBoolean(controlBar.showZoomBar)
      const showControlButton = toBoolean(controlBar.showControlButton)

      if (visible != null) {
        controlBarState.visible = visible
        restored = true
      }
      if (position) {
        controlBarState.position = position
        restored = true
      }
      if (offsetX != null) {
        controlBarState.offsetX = Math.round(offsetX)
        restored = true
      }
      if (offsetY != null) {
        controlBarState.offsetY = Math.round(offsetY)
        restored = true
      }
      if (showZoomBar != null) {
        controlBarState.showZoomBar = showZoomBar
        restored = true
      }
      if (showControlButton != null) {
        controlBarState.showControlButton = showControlButton
        restored = true
      }
    }

    if (state.mapType) {
      const mapType = state.mapType
      const visible = toBoolean(mapType.visible)
      const position = isControlPosition(mapType.position) ? mapType.position : undefined
      const offsetX = toFiniteNumber(mapType.offsetX)
      const offsetY = toFiniteNumber(mapType.offsetY)
      const defaultType = toFiniteNumber(mapType.defaultType)
      const showTraffic = toBoolean(mapType.showTraffic)
      const showRoad = toBoolean(mapType.showRoad)

      if (visible != null) {
        mapTypeState.visible = visible
        restored = true
      }
      if (position) {
        mapTypeState.position = position
        restored = true
      }
      if (offsetX != null) {
        mapTypeState.offsetX = Math.round(offsetX)
        restored = true
      }
      if (offsetY != null) {
        mapTypeState.offsetY = Math.round(offsetY)
        restored = true
      }
      if (defaultType != null) {
        mapTypeState.defaultType = Math.max(0, Math.round(defaultType))
        restored = true
      }
      if (showTraffic != null) {
        mapTypeState.showTraffic = showTraffic
        restored = true
      }
      if (showRoad != null) {
        mapTypeState.showRoad = showRoad
        restored = true
      }
    }

    if (state.performanceDatasetId && typeof state.performanceDatasetId === 'string') {
      const datasetExists = performanceDatasets.some(dataset => dataset.id === state.performanceDatasetId)
      if (datasetExists) {
        performanceDatasetId.value = state.performanceDatasetId
        restored = true
      }
    }

    if (state.performanceRenderMode && isPerformanceRenderMode(state.performanceRenderMode)) {
      performanceRenderMode.value = state.performanceRenderMode
      restored = true
    }
  }
  finally {
    const currentState = createPlaygroundState()
    persistPlaygroundState(currentState, { force: true })
    persistencePaused = false
    if (restored)
      logEvent('State', 'restore', source === 'hash' ? 'Restored from URL hash' : 'Restored from local storage')
  }
}

if (typeof window !== 'undefined') {
  const hashState = restoreStateFromHash()
  if (hashState) {
    applyPlaygroundState(hashState, 'hash')
  }
  else {
    const storedState = restoreStateFromStorage()
    if (storedState)
      applyPlaygroundState(storedState, 'storage')
    else
      persistPlaygroundState(createPlaygroundState(), { force: true })
  }
}

watch(
  () => createPlaygroundState(),
  (state) => {
    persistPlaygroundState(state)
  },
)

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

  logEvent('Map', 'moveend', `Center ${centerText.value} · zoom ${zoom.value}`)
}

function handleMarkerDragend(event: any) {
  const { lnglat } = event ?? {}
  if (lnglat)
    center.value = [Number(lnglat.lng.toFixed(6)), Number(lnglat.lat.toFixed(6))] as LngLatTuple

  if (lnglat)
    logEvent('Marker', 'dragend', `${lnglat.lng.toFixed(6)}, ${lnglat.lat.toFixed(6)}`)
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

type CopyStatus = 'idle' | 'copied' | 'error'

function indentLines(text: string, spaces: number) {
  const padding = ' '.repeat(spaces)
  return text
    .split('\n')
    .map(line => (line.length > 0 ? `${padding}${line}` : line))
    .join('\n')
}

function formatNumber(value: number) {
  if (Number.isInteger(value))
    return value.toString()
  return value.toFixed(2).replace(/\.0+$/, '').replace(/(\.[1-9]*)0+$/, '$1')
}

function formatCoordinate(value: number) {
  return value.toFixed(6)
}

function formatLngLatTuple(tuple: LngLatTuple) {
  return `[${tuple.map(formatCoordinate).join(', ')}]`
}

function formatTuple(values: number[]) {
  return `[${values.map(formatNumber).join(', ')}]`
}

function formatBoolean(value: boolean) {
  return value ? 'true' : 'false'
}

function escapeSingleQuotes(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function buildMapTemplate(children?: string) {
  const attributes = [
    `:center="${formatLngLatTuple(center.value)}"`,
    `:zoom="${zoom.value}"`,
    `:pitch="${pitch.value}"`,
    `:rotation="${rotation.value}"`,
    `view-mode="${viewMode.value}"`,
  ]

  if (resolvedMapStyle.value)
    attributes.push(`map-style="${resolvedMapStyle.value}"`)

  const attributeLines = attributes.map(attribute => `    ${attribute}`).join('\n')

  if (!children)
    return `<template>\n  <AmapMap\n${attributeLines}\n  />\n</template>`

  return `<template>\n  <AmapMap\n${attributeLines}\n  >\n${indentLines(children, 4)}\n  </AmapMap>\n</template>`
}

function createSfcSnippet(options: {
  components: string[]
  children?: string
  extraImports?: string[]
  declarations?: string[]
}) {
  const template = buildMapTemplate(options.children)
  const componentOrder = ['AmapMap', ...options.components.filter(component => component !== 'AmapMap')]
  const componentList = Array.from(new Set(componentOrder))
  const imports = [
    `import { ${componentList.join(', ')} } from '@amap-vue/core'`,
    ...(options.extraImports ?? []),
  ]
  const declarations = (options.declarations ?? []).filter(line => line !== undefined && line !== null && line !== '')
  const scriptLines = ['<script setup lang="ts">', ...imports]
  if (declarations.length > 0)
    scriptLines.push('', ...declarations)
  scriptLines.push('<\\/script>')
  return [template, '', scriptLines.join('\n'), ''].join('\n')
}

function renderMarkerTag() {
  const lines = [
    '<AmapMarker',
    `  :position="${formatLngLatTuple(center.value)}"`,
    `  :draggable="${formatBoolean(markerState.draggable)}"`,
  ]

  if (markerState.showLabel && markerState.labelText.trim()) {
    lines.push(
      `  :label="{ content: '${escapeSingleQuotes(markerState.labelText.trim())}', direction: '${markerState.labelDirection}' }"`,
    )
  }

  lines.push(`  :offset="${formatTuple([markerState.offsetX, markerState.offsetY])}"`)
  lines.push('/>')
  return lines.join('\n')
}

function renderInfoWindowTag() {
  const contentLines = [
    '<AmapInfoWindow',
    `  :position="${formatLngLatTuple(center.value)}"`,
    `  :is-open="${formatBoolean(infoWindowState.isOpen)}"`,
    `  anchor="${infoWindowState.anchor}"`,
    `  :offset="${formatTuple([infoWindowState.offsetX, infoWindowState.offsetY])}"`,
    '>',
  ]

  const title = escapeHtml(infoWindowState.title)
  const body = escapeHtml(infoWindowState.body).replace(/\n/g, '<br>')

  contentLines.push('  <div class="info-window">')
  contentLines.push(`    <h3>${title}</h3>`)
  contentLines.push(`    <p>${body}</p>`)
  contentLines.push('  </div>')
  contentLines.push('</AmapInfoWindow>')
  return contentLines.join('\n')
}

const snippetGenerators: Record<PanelId, () => string> = {
  map: () => createSfcSnippet({ components: [] }),
  marker: () => createSfcSnippet({ components: ['AmapMarker'], children: renderMarkerTag() }),
  infoWindow: () => {
    const sections = [renderMarkerTag(), renderInfoWindowTag()]
    return createSfcSnippet({ components: ['AmapMarker', 'AmapInfoWindow'], children: sections.join('\n\n') })
  },
  polyline: () => {
    const declarations = [
      `const path = ${formatJson(polylinePath)}`,
      `const options = ${formatJson(polylineOptions.value)}`,
    ]
    const child = [
      '<AmapPolyline',
      '  :path="path"',
      '  :options="options"',
      `  :visible="${formatBoolean(polylineState.visible)}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapPolyline'], children: child, declarations })
  },
  polygon: () => {
    const declarations = [
      `const path = ${formatJson(polygonPath)}`,
      `const options = ${formatJson(polygonOptions.value)}`,
    ]
    const child = [
      '<AmapPolygon',
      '  :path="path"',
      '  :options="options"',
      `  :visible="${formatBoolean(polygonState.visible)}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapPolygon'], children: child, declarations })
  },
  circle: () => {
    const declarations = [`const options = ${formatJson(circleOptions.value)}`]
    const child = [
      '<AmapCircle',
      `  :center="${formatLngLatTuple(center.value)}"`,
      `  :radius="${circleState.radius}"`,
      '  :options="options"',
      `  :visible="${formatBoolean(circleState.visible)}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapCircle'], children: child, declarations })
  },
  tileLayer: () => {
    const child = [
      '<AmapTileLayer',
      `  :visible="${formatBoolean(tileLayerState.visible)}"`,
      `  :opacity="${tileLayerState.opacity}"`,
      `  tile-url="${tileLayerState.tileUrl}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapTileLayer'], children: child })
  },
  traffic: () => {
    const child = [
      '<AmapTrafficLayer',
      `  :visible="${formatBoolean(trafficState.visible)}"`,
      `  :auto-refresh="${formatBoolean(trafficState.autoRefresh)}"`,
      `  :interval="${trafficState.interval}"`,
      `  :opacity="${trafficState.opacity}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapTrafficLayer'], children: child })
  },
  satellite: () => {
    const child = [
      '<AmapSatelliteLayer',
      `  :visible="${formatBoolean(satelliteState.visible)}"`,
      `  :opacity="${satelliteState.opacity}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapSatelliteLayer'], children: child })
  },
  roadNet: () => {
    const child = [
      '<AmapRoadNetLayer',
      `  :visible="${formatBoolean(roadNetState.visible)}"`,
      `  :opacity="${roadNetState.opacity}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapRoadNetLayer'], children: child })
  },
  toolBar: () => {
    const child = [
      '<AmapToolBar',
      `  :visible="${formatBoolean(toolBarState.visible)}"`,
      `  position="${toolBarState.position}"`,
      `  :offset="${formatTuple([toolBarState.offsetX, toolBarState.offsetY])}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapToolBar'], children: child })
  },
  scale: () => {
    const child = [
      '<AmapScale',
      `  :visible="${formatBoolean(scaleState.visible)}"`,
      `  position="${scaleState.position}"`,
      `  :offset="${formatTuple([scaleState.offsetX, scaleState.offsetY])}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapScale'], children: child })
  },
  controlBar: () => {
    const child = [
      '<AmapControlBar',
      `  :visible="${formatBoolean(controlBarState.visible)}"`,
      `  position="${controlBarState.position}"`,
      `  :offset="${formatTuple([controlBarState.offsetX, controlBarState.offsetY])}"`,
      `  :show-zoom-bar="${formatBoolean(controlBarState.showZoomBar)}"`,
      `  :show-control-button="${formatBoolean(controlBarState.showControlButton)}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapControlBar'], children: child })
  },
  mapType: () => {
    const child = [
      '<AmapMapType',
      `  :visible="${formatBoolean(mapTypeState.visible)}"`,
      `  position="${mapTypeState.position}"`,
      `  :offset="${formatTuple([mapTypeState.offsetX, mapTypeState.offsetY])}"`,
      `  :default-type="${mapTypeState.defaultType}"`,
      `  :show-traffic="${formatBoolean(mapTypeState.showTraffic)}"`,
      `  :show-road="${formatBoolean(mapTypeState.showRoad)}"`,
      '/>',
    ].join('\n')
    return createSfcSnippet({ components: ['AmapMapType'], children: child })
  },
  performance: () => {
    const dataset = performanceDataset.value
    const sampleLines = dataset.samples.map((sample, index) =>
      `  { lnglat: [${formatCoordinate(sample.lng)}, ${formatCoordinate(sample.lat)}], name: 'Point ${index + 1}', style: ${sample.clusterId} }, // weight ${sample.weight.toFixed(2)}`,
    )
    const remaining = dataset.size - dataset.samples.length
    const onMountedLines = `
onMounted(async () => {
  const AMap = await loader.load({
    key: 'YOUR_AMAP_KEY',
    plugins: ['AMap.MassMarks'],
  })

  const createStyle = (color: string): AMap.MassMarkersStyleOptions => {
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="',
      '__COLOR_PLACEHOLDER__',
      '" fill-opacity="0.9"/><circle cx="6" cy="6" r="2.5" fill="#ffffff" fill-opacity="0.55"/></svg>',
    ].join('')
    const url = 'data:image/svg+xml,__URL_PLACEHOLDER__'
    return {
      url,
      size: new AMap.Size(10, 10),
      anchor: new AMap.Pixel(5, 5),
    }
  }

  styles.value = [
    createStyle('#2563eb'),
    createStyle('#f97316'),
    createStyle('#16a34a'),
  ]
})
`.trim().split('\n')

    const declarations = [
      `// Selected dataset: ${dataset.label} (${dataset.size.toLocaleString()} points)`,
      [
        'const points: AMap.MassData[] = [',
        ...sampleLines,
        remaining > 0 ? `  // ... ${remaining.toLocaleString()} more points` : undefined,
        ']',
      ]
        .filter(Boolean)
        .join('\n'),
      'const styles = ref<AMap.MassMarkersStyleOptions[]>([])',
      onMountedLines.join('\n'),
    ]

    const child = [
      '<AmapMassMarks',
      '  :data="points"',
      '  :style="styles"',
      '/>',
    ].join('\n')

    const snippet = createSfcSnippet({
      components: ['AmapMassMarks'],
      children: child,
      extraImports: ['import { onMounted, ref } from \'vue\'', 'import { loader } from \'@amap-vue/shared\''],
      declarations,
    })
      .replaceAll('__COLOR_PLACEHOLDER__', `${'${'}color}`)
      .replace('__URL_PLACEHOLDER__', `${'${'}encodeURIComponent(svg)}`)

    return snippet
  },
}

const panelSnippet = computed(() => snippetGenerators[activePanel.value]?.() ?? '')
const hasSnippet = computed(() => panelSnippet.value.trim().length > 0)

const copyStatus = ref<CopyStatus>('idle')
const copyErrorMessage = ref('')
let copyResetHandle: ReturnType<typeof setTimeout> | undefined

const copyButtonLabel = computed(() => {
  if (copyStatus.value === 'copied')
    return 'Copied!'
  if (copyStatus.value === 'error')
    return 'Retry copy'
  return 'Copy snippet'
})

const copyStatusMessage = computed(() => {
  if (!hasSnippet.value)
    return 'Snippet is unavailable for the current panel.'
  if (copyStatus.value === 'copied')
    return `${activePanelMeta.value.label} snippet copied to the clipboard.`
  if (copyStatus.value === 'error')
    return copyErrorMessage.value || 'Clipboard copy failed. Try copying manually.'
  return `Copy the ${activePanelMeta.value.label} panel as a ready-to-use <script setup> snippet.`
})

const copyButtonStateClass = computed(() => (copyStatus.value === 'idle' ? null : copyStatus.value))

function scheduleCopyReset(status: CopyStatus) {
  if (copyResetHandle != null) {
    clearTimeout(copyResetHandle)
    copyResetHandle = undefined
  }

  const delay = status === 'copied' ? 2400 : 4000
  copyResetHandle = setTimeout(() => {
    copyStatus.value = 'idle'
    copyErrorMessage.value = ''
    copyResetHandle = undefined
  }, delay)
}

async function attemptClipboardWrite(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {
      // Ignore and attempt fallback
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'fixed'
      textarea.style.top = '-1000px'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (success)
        return true
    }
    catch {
      // Ignore and bubble up failure
    }
  }

  return false
}

async function copySnippet() {
  if (!hasSnippet.value) {
    copyStatus.value = 'error'
    copyErrorMessage.value = 'No snippet available for this panel.'
    scheduleCopyReset('error')
    return
  }

  const snippet = panelSnippet.value
  const success = await attemptClipboardWrite(snippet)

  if (success) {
    copyStatus.value = 'copied'
    copyErrorMessage.value = ''
    logEvent('Clipboard', 'copy', `${activePanelMeta.value.label} panel snippet`)
    scheduleCopyReset('copied')
  }
  else {
    copyStatus.value = 'error'
    copyErrorMessage.value = 'Clipboard copy is not supported in this environment.'
    scheduleCopyReset('error')
  }
}

onBeforeUnmount(() => {
  if (copyResetHandle != null) {
    clearTimeout(copyResetHandle)
    copyResetHandle = undefined
  }
  cancelMassRenderTask()
})
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

          <label class="form-field">
            <span>Render mode</span>
            <select v-model="performanceRenderMode">
              <option v-for="option in performanceRenderModeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <div v-if="performanceRenderMode === 'chunked'" class="chunk-progress">
            <progress :value="chunkProgress" max="1" aria-label="Chunked load progress" />
            <span>{{ chunkProgressLabel }}</span>
          </div>

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
      <div class="map-toolbar">
        <button
          type="button"
          class="copy-button"
          :class="copyButtonStateClass"
          :disabled="!hasSnippet"
          :title="copyStatusMessage"
          @click="copySnippet"
        >
          {{ copyButtonLabel }}
        </button>
        <p class="copy-feedback" aria-live="polite">
          {{ copyStatusMessage }}
        </p>
      </div>

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
        @click="handleMapClick"
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
          @close="handleInfoWindowClose"
          @open="handleInfoWindowOpen"
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
          :data="performanceMassRenderData"
          :style="massMarkerStyles"
        />
      </AmapMap>

      <aside class="event-log" aria-live="polite">
        <header class="event-log-header">
          <h2>Event log</h2>
          <span class="event-log-meta">Last {{ Math.min(eventLog.length, EVENT_LOG_LIMIT) }} events</span>
        </header>
        <p v-if="eventLog.length === 0" class="event-log-empty">
          Interact with the map or controls to see live events.
        </p>
        <ul v-else class="event-log-list">
          <li v-for="entry in eventLog" :key="entry.id" class="event-log-item">
            <span class="event-log-time">{{ entry.time }}</span>
            <div class="event-log-content">
              <strong class="event-log-source">{{ entry.source }}</strong>
              <span class="event-log-summary">{{ entry.summary }}</span>
              <span v-if="entry.detail" class="event-log-detail">{{ entry.detail }}</span>
            </div>
          </li>
        </ul>
      </aside>
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

.chunk-progress {
  margin: 0.5rem 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.18);
}

.chunk-progress progress {
  width: 100%;
  height: 8px;
  border-radius: 9999px;
  overflow: hidden;
}

.chunk-progress span {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1d4ed8;
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

.map-toolbar {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  z-index: 10;
}

.copy-button {
  border: none;
  border-radius: 9999px;
  padding: 0.55rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.85);
  box-shadow: 0 14px 30px -18px rgba(15, 23, 42, 0.8);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.copy-button:hover {
  background: rgba(37, 99, 235, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 18px 34px -18px rgba(30, 64, 175, 0.65);
}

.copy-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.copy-button.copied {
  background: rgba(22, 163, 74, 0.92);
}

.copy-button.error {
  background: rgba(220, 38, 38, 0.9);
}

.copy-feedback {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.85);
  text-align: right;
  max-width: 220px;
}

.map {
  width: 100%;
  height: 100vh;
}

.event-log {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  width: min(320px, calc(100% - 3rem));
  max-height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.9);
  color: #e2e8f0;
  box-shadow: 0 20px 45px -20px rgba(15, 23, 42, 0.65);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.event-log-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.event-log-header h2 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.event-log-meta {
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.7);
}

.event-log-empty {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(226, 232, 240, 0.8);
}

.event-log-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow-y: auto;
  max-height: 220px;
  padding-right: 0.25rem;
}

.event-log-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.65rem;
  align-items: start;
}

.event-log-time {
  font-family: 'Menlo', 'Fira Code', 'SFMono-Regular', monospace;
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.65);
}

.event-log-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-log-source {
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: rgba(96, 165, 250, 0.9);
}

.event-log-summary {
  font-size: 0.9rem;
}

.event-log-detail {
  font-size: 0.8rem;
  color: rgba(226, 232, 240, 0.75);
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

  .event-log {
    position: static;
    width: auto;
    max-height: none;
    margin: 1rem;
  }

  .map-toolbar {
    position: static;
    align-items: stretch;
    margin: 1rem;
  }

  .copy-feedback {
    text-align: left;
  }
}
</style>
