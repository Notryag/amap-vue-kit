import type { PerformanceDatasetId } from './data/performance-datasets'

export type LngLatTuple = [number, number]
export type ControlPosition = 'LT' | 'RT' | 'LB' | 'RB'

export type InfoWindowAnchor
  = | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'middle-left'
    | 'center'
    | 'middle-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'

export type MarkerLabelDirection = 'top' | 'bottom' | 'left' | 'right' | 'center'

export type MapStyleKey
  = | 'default'
    | 'dark'
    | 'light'
    | 'fresh'
    | 'grey'
    | 'whitesmoke'
    | 'macaron'
    | 'blue'
    | 'darkblue'

export type ViewMode = '2D' | '3D'

export type PerformanceRenderMode = 'immediate' | 'chunked'

export interface PanelDefinition {
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

export type PanelId = PanelDefinition['id']

export interface EventLogEntry {
  id: number
  time: string
  source: 'Map' | 'Marker' | 'InfoWindow' | 'Panel' | 'Dataset' | 'Clipboard' | 'State'
  summary: string
  detail?: string
}

export interface PlaygroundState {
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
