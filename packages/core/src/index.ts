import type { App } from 'vue'

import AmapCircle from './components/AmapCircle.vue'
import AmapControlBar from './components/AmapControlBar.vue'
import AmapInfoWindow from './components/AmapInfoWindow.vue'
import AmapMap from './components/AmapMap.vue'
import AmapMapType from './components/AmapMapType.vue'
import AmapMarker from './components/AmapMarker.vue'
import AmapPolygon from './components/AmapPolygon.vue'
import AmapPolyline from './components/AmapPolyline.vue'
import AmapRoadNetLayer from './components/AmapRoadNetLayer.vue'
import AmapSatelliteLayer from './components/AmapSatelliteLayer.vue'
import AmapScale from './components/AmapScale.vue'
import AmapTileLayer from './components/AmapTileLayer.vue'
import AmapToolBar from './components/AmapToolBar.vue'
import AmapTrafficLayer from './components/AmapTrafficLayer.vue'

export {
  AmapCircle,
  AmapControlBar,
  AmapInfoWindow,
  AmapMap,
  AmapMapType,
  AmapMarker,
  AmapPolygon,
  AmapPolyline,
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
  AmapInfoWindow,
  AmapPolyline,
  AmapPolygon,
  AmapCircle,
  AmapTileLayer,
  AmapTrafficLayer,
  AmapSatelliteLayer,
  AmapRoadNetLayer,
  AmapToolBar,
  AmapScale,
  AmapControlBar,
  AmapMapType,
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
