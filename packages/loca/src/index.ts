import type { App } from 'vue'

import AmapLocaHeatmapLayer from './components/AmapLocaHeatmapLayer.vue'
import AmapLocaPointLayer from './components/AmapLocaPointLayer.vue'
import AmapLocaPolygonLayer from './components/AmapLocaPolygonLayer.vue'
import AmapLocaProvider from './components/AmapLocaProvider.vue'

export { default as AmapLocaHeatmapLayer } from './components/AmapLocaHeatmapLayer.vue'
export { default as AmapLocaPointLayer } from './components/AmapLocaPointLayer.vue'
export { default as AmapLocaPolygonLayer } from './components/AmapLocaPolygonLayer.vue'
export { default as AmapLocaProvider } from './components/AmapLocaProvider.vue'
export { useLocaContainer } from './composables/useLocaContainer'
export { useLocaHeatmapLayer } from './composables/useLocaHeatmapLayer'
export { useLocaPointLayer } from './composables/useLocaPointLayer'
export { useLocaPolygonLayer } from './composables/useLocaPolygonLayer'
export { useLocaPulseLineLayer } from './composables/useLocaPulseLineLayer'

export * from './types'

const components = [
  AmapLocaHeatmapLayer,
  AmapLocaPointLayer,
  AmapLocaPolygonLayer,
  AmapLocaProvider,
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
