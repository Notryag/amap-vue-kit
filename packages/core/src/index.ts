import type { App } from 'vue'

import AmapCircle from './components/AmapCircle.vue'
import AmapInfoWindow from './components/AmapInfoWindow.vue'
import AmapMap from './components/AmapMap.vue'
import AmapMarker from './components/AmapMarker.vue'
import AmapPolygon from './components/AmapPolygon.vue'
import AmapPolyline from './components/AmapPolyline.vue'

export { AmapCircle, AmapInfoWindow, AmapMap, AmapMarker, AmapPolygon, AmapPolyline }

const components = [
  AmapMap,
  AmapMarker,
  AmapInfoWindow,
  AmapPolyline,
  AmapPolygon,
  AmapCircle,
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
