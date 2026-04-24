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
    resolvedMapStyle,
    showMarker,
    markerLabel,
    markerOffset,
    infoWindowOffset,
    polylineOptions,
    polygonOptions,
    circleOptions,
    toolBarOffset,
    scaleOffset,
    controlBarOffset,
    mapTypeOffset,

    resetView,
    stepZoom,
    nudge,
  }
}
