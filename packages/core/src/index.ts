import type { App } from 'vue'

import AmapAutoComplete from './components/AmapAutoComplete.vue'
import AmapBezierCurve from './components/AmapBezierCurve.vue'
import AmapBezierCurveEditor from './components/AmapBezierCurveEditor.vue'
import AmapBuildings from './components/AmapBuildings.vue'
import AmapCanvasLayer from './components/AmapCanvasLayer.vue'
import AmapCircle from './components/AmapCircle.vue'
import AmapCircleEditor from './components/AmapCircleEditor.vue'
import AmapCircleMarker from './components/AmapCircleMarker.vue'
import AmapContextMenu from './components/AmapContextMenu.vue'
import AmapControlBar from './components/AmapControlBar.vue'
import AmapCustomLayer from './components/AmapCustomLayer.vue'
import AmapDistrictLayer from './components/AmapDistrictLayer.vue'
import AmapDriving from './components/AmapDriving.vue'
import AmapElasticMarker from './components/AmapElasticMarker.vue'
import AmapEllipse from './components/AmapEllipse.vue'
import AmapEllipseEditor from './components/AmapEllipseEditor.vue'
import AmapFlexibleLayer from './components/AmapFlexibleLayer.vue'
import AmapGeoJSONLayer from './components/AmapGeoJSONLayer.vue'
import AmapGLCustomLayer from './components/AmapGLCustomLayer.vue'
import AmapHawkEye from './components/AmapHawkEye.vue'
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
import AmapRangingTool from './components/AmapRangingTool.vue'
import AmapRectangle from './components/AmapRectangle.vue'
import AmapRectangleEditor from './components/AmapRectangleEditor.vue'
import AmapReverseGeocodePanel from './components/AmapReverseGeocodePanel.vue'
import AmapRiding from './components/AmapRiding.vue'
import AmapRoadNetLayer from './components/AmapRoadNetLayer.vue'
import AmapSatelliteLayer from './components/AmapSatelliteLayer.vue'
import AmapScale from './components/AmapScale.vue'
import AmapText from './components/AmapText.vue'
import AmapTileLayer from './components/AmapTileLayer.vue'
import AmapToolBar from './components/AmapToolBar.vue'
import AmapTrafficLayer from './components/AmapTrafficLayer.vue'
import AmapTransfer from './components/AmapTransfer.vue'
import AmapWalking from './components/AmapWalking.vue'
import AmapWeatherPanel from './components/AmapWeatherPanel.vue'
import AmapWMSLayer from './components/AmapWMSLayer.vue'
import AmapWMTSLayer from './components/AmapWMTSLayer.vue'

export {
  AmapAutoComplete,
  AmapBezierCurve,
  AmapBezierCurveEditor,
  AmapBuildings,
  AmapCanvasLayer,
  AmapCircle,
  AmapCircleEditor,
  AmapCircleMarker,
  AmapContextMenu,
  AmapControlBar,
  AmapCustomLayer,
  AmapDistrictLayer,
  AmapDriving,
  AmapElasticMarker,
  AmapEllipse,
  AmapEllipseEditor,
  AmapFlexibleLayer,
  AmapGeoJSONLayer,
  AmapGLCustomLayer,
  AmapHawkEye,
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
  AmapRangingTool,
  AmapRectangle,
  AmapRectangleEditor,
  AmapReverseGeocodePanel,
  AmapRiding,
  AmapRoadNetLayer,
  AmapSatelliteLayer,
  AmapScale,
  AmapText,
  AmapTileLayer,
  AmapToolBar,
  AmapTrafficLayer,
  AmapTransfer,
  AmapWalking,
  AmapWeatherPanel,
  AmapWMSLayer,
  AmapWMTSLayer,
}

const components = [
  AmapHawkEye,
  AmapAutoComplete,
  AmapBezierCurve,
  AmapBezierCurveEditor,
  AmapBuildings,
  AmapFlexibleLayer,
  AmapGLCustomLayer,
  AmapCanvasLayer,
  AmapCircle,
  AmapCircleEditor,
  AmapCircleMarker,
  AmapContextMenu,
  AmapControlBar,
  AmapCustomLayer,
  AmapDistrictLayer,
  AmapDriving,
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
  AmapRangingTool,
  AmapOverlayGroup,
  AmapPlaceSearch,
  AmapPolygon,
  AmapPolygonEditor,
  AmapPolyline,
  AmapPolylineEditor,
  AmapRectangle,
  AmapRectangleEditor,
  AmapReverseGeocodePanel,
  AmapRiding,
  AmapRoadNetLayer,
  AmapSatelliteLayer,
  AmapScale,
  AmapText,
  AmapTileLayer,
  AmapToolBar,
  AmapTransfer,
  AmapTrafficLayer,
  AmapWalking,
  AmapWMSLayer,
  AmapWMTSLayer,
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
