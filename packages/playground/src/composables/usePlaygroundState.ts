import type {
  ControlPosition,
  InfoWindowAnchor,
  LngLatTuple,
  MapStyleKey,
  MarkerLabelDirection,
  PanelId,
  ViewMode,
} from '../types'
import { computed, reactive, ref } from 'vue'

export function usePlaygroundState() {
  const center = ref<LngLatTuple>([116.397428, 39.90923])
  const initialCenter: LngLatTuple = [...center.value] as LngLatTuple
  const zoom = ref(12)
  const pitch = ref(40)
  const rotation = ref(0)
  const viewMode = ref<ViewMode>('3D')
  const mapStyle = ref<MapStyleKey>('default')

  const activePanel = ref<PanelId>('map')

  const markerState = reactive({
    draggable: true,
    showLabel: true,
    labelText: 'Drag me around',
    labelDirection: 'top' as MarkerLabelDirection,
    offsetX: 0,
    offsetY: -10,
  })

  const textState = reactive({
    visible: true,
    text: 'Text overlay',
    color: '#0f172a',
  })

  const circleMarkerState = reactive({
    visible: true,
    radius: 14,
    fillColor: '#14b8a6',
    strokeColor: '#0f766e',
  })

  const elasticMarkerState = reactive({
    visible: true,
  })

  const labelsLayerState = reactive({
    visible: true,
    collision: true,
    allowCollision: false,
  })

  const markerClusterState = reactive({
    visible: true,
    gridSize: 80,
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

  const rectangleState = reactive({
    visible: true,
    strokeColor: '#0891b2',
    fillColor: '#22d3ee',
    fillOpacity: 0.16,
  })

  const ellipseState = reactive({
    visible: true,
    radiusX: 900,
    radiusY: 420,
    strokeColor: '#7c3aed',
    fillColor: '#a78bfa',
    fillOpacity: 0.18,
  })

  const bezierCurveState = reactive({
    visible: true,
    strokeColor: '#db2777',
    strokeWeight: 5,
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

  const imageLayerState = reactive({
    visible: true,
    opacity: 0.72,
  })

  const districtLayerState = reactive({
    visible: true,
    opacity: 0.65,
    adcode: '110000',
  })

  const geoJSONLayerState = reactive({
    visible: true,
    fillOpacity: 0.22,
  })

  const heatMapState = reactive({
    visible: true,
    radius: 28,
    opacityStart: 0.25,
    opacityEnd: 0.88,
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
    }
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

  const textOptions = computed(() => ({
    draggable: true,
    style: {
      padding: '6px 10px',
      borderRadius: '4px',
      border: '1px solid rgba(15, 23, 42, 0.2)',
      background: 'rgba(255, 255, 255, 0.94)',
      color: textState.color,
      boxShadow: '0 8px 22px rgba(15, 23, 42, 0.16)',
    },
  }))

  const circleMarkerOptions = computed(() => ({
    strokeColor: circleMarkerState.strokeColor,
    strokeWeight: 2,
    fillColor: circleMarkerState.fillColor,
    fillOpacity: 0.72,
  }))

  const rectangleBounds = computed(() => {
    const [lng, lat] = center.value
    return [
      [Number((lng - 0.018).toFixed(6)), Number((lat - 0.01).toFixed(6))],
      [Number((lng + 0.018).toFixed(6)), Number((lat + 0.01).toFixed(6))],
    ] as [LngLatTuple, LngLatTuple]
  })

  const rectangleOptions = computed(() => ({
    strokeColor: rectangleState.strokeColor,
    strokeWeight: 2,
    fillColor: rectangleState.fillColor,
    fillOpacity: rectangleState.fillOpacity,
  }))

  const ellipseRadius = computed(() => [ellipseState.radiusX, ellipseState.radiusY] as [number, number])

  const ellipseOptions = computed(() => ({
    strokeColor: ellipseState.strokeColor,
    strokeWeight: 2,
    fillColor: ellipseState.fillColor,
    fillOpacity: ellipseState.fillOpacity,
  }))

  const bezierCurveOptions = computed(() => ({
    strokeColor: bezierCurveState.strokeColor,
    strokeWeight: bezierCurveState.strokeWeight,
    strokeOpacity: 0.92,
  }))

  const heatMapOpacity = computed(() => [
    Math.min(heatMapState.opacityStart, heatMapState.opacityEnd),
    Math.max(heatMapState.opacityStart, heatMapState.opacityEnd),
  ] as [number, number])

  const toolBarOffset = computed(() => [toolBarState.offsetX, toolBarState.offsetY] as [number, number])
  const scaleOffset = computed(() => [scaleState.offsetX, scaleState.offsetY] as [number, number])
  const controlBarOffset = computed(() => [controlBarState.offsetX, controlBarState.offsetY] as [number, number])
  const mapTypeOffset = computed(() => [mapTypeState.offsetX, mapTypeState.offsetY] as [number, number])

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

  return {
    center,
    initialCenter,
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
    resolvedMapStyle,
    showMarker,
    markerLabel,
    markerOffset,
    infoWindowOffset,
    polylineOptions,
    polygonOptions,
    circleOptions,
    textOptions,
    circleMarkerOptions,
    rectangleBounds,
    rectangleOptions,
    ellipseRadius,
    ellipseOptions,
    bezierCurveOptions,
    heatMapOpacity,
    toolBarOffset,
    scaleOffset,
    controlBarOffset,
    mapTypeOffset,

    resetView,
    stepZoom,
    nudge,
  }
}
