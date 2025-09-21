import type { App } from 'vue'

import AmapCircle from './components/AmapCircle.vue'
import AmapCircleEditor from './components/AmapCircleEditor.vue'
import AmapControlBar from './components/AmapControlBar.vue'
import AmapEllipseEditor from './components/AmapEllipseEditor.vue'
import AmapHeatMap from './components/AmapHeatMap.vue'
import AmapImageLayer from './components/AmapImageLayer.vue'
import AmapInfoWindow from './components/AmapInfoWindow.vue'
import AmapLabelMarker from './components/AmapLabelMarker.vue'
import AmapLabelsLayer from './components/AmapLabelsLayer.vue'
import AmapMap from './components/AmapMap.vue'
import AmapMapType from './components/AmapMapType.vue'
import AmapMarker from './components/AmapMarker.vue'
import AmapOverlayGroup from './components/AmapOverlayGroup.vue'
import AmapPolygon from './components/AmapPolygon.vue'
import AmapPolyline from './components/AmapPolyline.vue'
import AmapRectangleEditor from './components/AmapRectangleEditor.vue'
import AmapRoadNetLayer from './components/AmapRoadNetLayer.vue'
import AmapSatelliteLayer from './components/AmapSatelliteLayer.vue'
import AmapScale from './components/AmapScale.vue'
import AmapTileLayer from './components/AmapTileLayer.vue'
import AmapToolBar from './components/AmapToolBar.vue'
import AmapTrafficLayer from './components/AmapTrafficLayer.vue'

export {
  AmapCircle,
  AmapCircleEditor,
  AmapControlBar,
  AmapEllipseEditor,
  AmapHeatMap,
  AmapImageLayer,
  AmapInfoWindow,
  AmapLabelMarker,
  AmapLabelsLayer,
  AmapMap,
  AmapMapType,
  AmapMarker,
  AmapOverlayGroup,
  AmapPolygon,
  AmapPolyline,
  AmapRectangleEditor,
  AmapRoadNetLayer,
  AmapSatelliteLayer,
  AmapScale,
  AmapTileLayer,
  AmapToolBar,
  AmapTrafficLayer,
}

const components = [
  AmapMap,
  AmapMarker,
  AmapLabelMarker,
  AmapInfoWindow,
  AmapPolyline,
  AmapPolygon,
  AmapCircle,
  AmapCircleEditor,
  AmapLabelsLayer,
  AmapImageLayer,
  AmapHeatMap,
  AmapTileLayer,
  AmapTrafficLayer,
  AmapSatelliteLayer,
  AmapRoadNetLayer,
  AmapOverlayGroup,
  AmapToolBar,
  AmapScale,
  AmapControlBar,
  AmapMapType,
  AmapRectangleEditor,
  AmapEllipseEditor,
]

export function install(app: App) {
  components.forEach((component) => {
    if (component.name)
      app.component(component.name, component)
  })
}

export default {
  install,
}
