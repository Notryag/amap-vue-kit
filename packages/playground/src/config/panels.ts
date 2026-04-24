import type { PanelDefinition } from '../types'

export const panels = [
  { id: 'map', label: 'Map', description: 'Control the base map view, pitch, and rotation.' },
  { id: 'marker', label: 'Marker', description: 'Toggle draggable markers, labels, and offsets.' },
  { id: 'infoWindow', label: 'InfoWindow', description: 'Experiment with anchored popups and custom content.' },
  { id: 'polyline', label: 'Polyline', description: 'Adjust path styling and visibility.' },
  { id: 'polygon', label: 'Polygon', description: 'Tweak fill opacity and stroke colours.' },
  { id: 'circle', label: 'Circle', description: 'Resize and style circular overlays.' },
  { id: 'tileLayer', label: 'TileLayer', description: 'Overlay custom tiles on top of the base map.' },
  { id: 'traffic', label: 'Traffic', description: 'Toggle real-time traffic data with opacity control.' },
  { id: 'satellite', label: 'Satellite', description: 'Blend satellite imagery into the scene.' },
  { id: 'roadNet', label: 'RoadNet', description: 'Display the road network overlay.' },
  { id: 'toolBar', label: 'ToolBar', description: 'Place interactive navigation controls.' },
  { id: 'scale', label: 'Scale', description: 'Display a scale bar at configurable positions.' },
  { id: 'controlBar', label: 'ControlBar', description: 'Show 3D navigation buttons and toggles.' },
  { id: 'mapType', label: 'MapType', description: 'Switch between map types and show quick toggles.' },
  { id: 'performance', label: 'Performance', description: 'Benchmark overlays with ready-made datasets.' },
] as const satisfies readonly PanelDefinition[]

export const PANEL_IDS = panels.map(panel => panel.id)
