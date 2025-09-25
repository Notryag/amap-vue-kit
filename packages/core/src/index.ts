import type { App } from 'vue'

import AmapAutoComplete from './components/AmapAutoComplete.vue'
import AmapBezierCurve from './components/AmapBezierCurve.vue'
import AmapBezierCurveEditor from './components/AmapBezierCurveEditor.vue'
import AmapCircle from './components/AmapCircle.vue'
import AmapCircleEditor from './components/AmapCircleEditor.vue'
import AmapCircleMarker from './components/AmapCircleMarker.vue'
import AmapContextMenu from './components/AmapContextMenu.vue'
import AmapControlBar from './components/AmapControlBar.vue'
import AmapDistrictLayer from './components/AmapDistrictLayer.vue'
import AmapElasticMarker from './components/AmapElasticMarker.vue'
import AmapEllipse from './components/AmapEllipse.vue'
import AmapEllipseEditor from './components/AmapEllipseEditor.vue'
import AmapGeoJSONLayer from './components/AmapGeoJSONLayer.vue'
import AmapHeatMap from './components/AmapHeatMap.vue'
import AmapImageLayer from './components/AmapImageLayer.vue'
import AmapInfoWindow from './components/AmapInfoWindow.vue'
import AmapLabelMarker from './components/AmapLabelMarker.vue'
import AmapLabelsLayer from './components/AmapLabelsLayer.vue'
import AmapMap from './components/AmapMap.vue'
import AmapMapType from './components/AmapMapType.vue'
import AmapMarker from './components/AmapMarker.vue'
import AmapMarkerCluster from './components/AmapMarkerCluster.vue'
import AmapMassMarks from './components/AmapMassMarks.vue'
import AmapMouseTool from './components/AmapMouseTool.vue'
import AmapOverlayGroup from './components/AmapOverlayGroup.vue'
import AmapPlaceSearch from './components/AmapPlaceSearch.vue'
import AmapPolygon from './components/AmapPolygon.vue'
import AmapPolygonEditor from './components/AmapPolygonEditor.vue'
import AmapPolyline from './components/AmapPolyline.vue'
import AmapPolylineEditor from './components/AmapPolylineEditor.vue'
import AmapRectangle from './components/AmapRectangle.vue'
import AmapRectangleEditor from './components/AmapRectangleEditor.vue'
import AmapReverseGeocodePanel from './components/AmapReverseGeocodePanel.vue'
import AmapRoadNetLayer from './components/AmapRoadNetLayer.vue'
import AmapSatelliteLayer from './components/AmapSatelliteLayer.vue'
import AmapScale from './components/AmapScale.vue'
import AmapText from './components/AmapText.vue'
import AmapTileLayer from './components/AmapTileLayer.vue'
import AmapToolBar from './components/AmapToolBar.vue'
import AmapTrafficLayer from './components/AmapTrafficLayer.vue'
import AmapWeatherPanel from './components/AmapWeatherPanel.vue'

export {
  AmapAutoComplete,
  AmapBezierCurve,
  AmapBezierCurveEditor,
  AmapCircle,
  AmapCircleEditor,
  AmapCircleMarker,
  AmapContextMenu,
  AmapControlBar,
  AmapDistrictLayer,
  AmapElasticMarker,
  AmapEllipse,
  AmapEllipseEditor,
  AmapGeoJSONLayer,
  AmapHeatMap,
  AmapImageLayer,
  AmapInfoWindow,
  AmapLabelMarker,
  AmapLabelsLayer,
  AmapMap,
  AmapMapType,
  AmapMarker,
  AmapMarkerCluster,
  AmapMassMarks,
  AmapMouseTool,
  AmapOverlayGroup,
  AmapPlaceSearch,
  AmapPolygon,
  AmapPolygonEditor,
  AmapPolyline,
  AmapPolylineEditor,
  AmapRectangle,
  AmapRectangleEditor,
  AmapReverseGeocodePanel,
  AmapRoadNetLayer,
  AmapSatelliteLayer,
  AmapScale,
  AmapText,
  AmapTileLayer,
  AmapToolBar,
  AmapTrafficLayer,
  AmapWeatherPanel,
}

const components = [
  AmapAutoComplete,
  AmapBezierCurve,
  AmapBezierCurveEditor,
  AmapCircle,
  AmapCircleEditor,
  AmapCircleMarker,
  AmapContextMenu,
  AmapControlBar,
  AmapDistrictLayer,
  AmapElasticMarker,
  AmapEllipse,
  AmapEllipseEditor,
  AmapGeoJSONLayer,
  AmapHeatMap,
  AmapImageLayer,
  AmapInfoWindow,
  AmapLabelMarker,
  AmapLabelsLayer,
  AmapMap,
  AmapMapType,
  AmapMarker,
  AmapMarkerCluster,
  AmapMassMarks,
  AmapMouseTool,
  AmapOverlayGroup,
  AmapPlaceSearch,
  AmapPolygon,
  AmapPolygonEditor,
  AmapPolyline,
  AmapPolylineEditor,
  AmapRectangle,
  AmapRectangleEditor,
  AmapReverseGeocodePanel,
  AmapRoadNetLayer,
  AmapSatelliteLayer,
  AmapScale,
  AmapText,
  AmapTileLayer,
  AmapToolBar,
  AmapTrafficLayer,
  AmapWeatherPanel,
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
