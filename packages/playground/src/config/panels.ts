import type { PanelDefinition } from '../types'

export const panels = [
  { id: 'map', group: 'Map', label: 'Map', description: 'Control the base map view, pitch, and rotation.' },
  { id: 'marker', group: 'Markers', label: 'Marker', description: 'Toggle draggable markers, labels, and offsets.' },
  { id: 'text', group: 'Markers', label: 'Text', description: 'Render text labels as map overlays.' },
  { id: 'circleMarker', group: 'Markers', label: 'CircleMarker', description: 'Style lightweight circular point overlays.' },
  { id: 'elasticMarker', group: 'Markers', label: 'ElasticMarker', description: 'Preview zoom-aware marker styling.' },
  { id: 'labelsLayer', group: 'Markers', label: 'LabelsLayer', description: 'Render label markers with collision handling.' },
  { id: 'markerCluster', group: 'Markers', label: 'MarkerCluster', description: 'Cluster generated marker points.' },
  { id: 'infoWindow', group: 'Markers', label: 'InfoWindow', description: 'Experiment with anchored popups and custom content.' },
  { id: 'polyline', group: 'Shapes', label: 'Polyline', description: 'Adjust path styling and visibility.' },
  { id: 'polygon', group: 'Shapes', label: 'Polygon', description: 'Tweak fill opacity and stroke colours.' },
  { id: 'circle', group: 'Shapes', label: 'Circle', description: 'Resize and style circular overlays.' },
  { id: 'rectangle', group: 'Shapes', label: 'Rectangle', description: 'Draw and style bounded rectangular overlays.' },
  { id: 'ellipse', group: 'Shapes', label: 'Ellipse', description: 'Tune ellipse radii and fill styles.' },
  { id: 'bezierCurve', group: 'Shapes', label: 'BezierCurve', description: 'Render curved vector paths.' },
  { id: 'tileLayer', group: 'Layers', label: 'TileLayer', description: 'Overlay custom tiles on top of the base map.' },
  { id: 'traffic', group: 'Layers', label: 'Traffic', description: 'Toggle real-time traffic data with opacity control.' },
  { id: 'satellite', group: 'Layers', label: 'Satellite', description: 'Blend satellite imagery into the scene.' },
  { id: 'roadNet', group: 'Layers', label: 'RoadNet', description: 'Display the road network overlay.' },
  { id: 'imageLayer', group: 'Layers', label: 'ImageLayer', description: 'Place an image overlay inside map bounds.' },
  { id: 'districtLayer', group: 'Layers', label: 'DistrictLayer', description: 'Display administrative boundary layers.' },
  { id: 'geoJSONLayer', group: 'Data', label: 'GeoJSON', description: 'Import GeoJSON features into the map.' },
  { id: 'heatMap', group: 'Data', label: 'HeatMap', description: 'Render weighted point density data.' },
  { id: 'toolBar', group: 'Controls', label: 'ToolBar', description: 'Place interactive navigation controls.' },
  { id: 'scale', group: 'Controls', label: 'Scale', description: 'Display a scale bar at configurable positions.' },
  { id: 'controlBar', group: 'Controls', label: 'ControlBar', description: 'Show 3D navigation buttons and toggles.' },
  { id: 'mapType', group: 'Controls', label: 'MapType', description: 'Switch between map types and show quick toggles.' },
  { id: 'performance', group: 'Data', label: 'Performance', description: 'Benchmark overlays with ready-made datasets.' },
] as const satisfies readonly PanelDefinition[]

export const PANEL_IDS = panels.map(panel => panel.id)
