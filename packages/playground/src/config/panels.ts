import type { PanelDefinition } from '../types'

export const panels = [
  { id: 'map', group: '地图', label: '地图', description: '控制底图视角、俯仰和旋转。' },
  { id: 'marker', group: '标记', label: '点标记', description: '切换拖拽、标签和偏移。' },
  { id: 'text', group: '标记', label: '文本', description: '将文本标签渲染为地图覆盖物。' },
  { id: 'circleMarker', group: '标记', label: '圆点标记', description: '配置轻量圆形点覆盖物样式。' },
  { id: 'elasticMarker', group: '标记', label: '灵活点标记', description: '预览随缩放变化的标记样式。' },
  { id: 'labelsLayer', group: '标记', label: '标签图层', description: '渲染带避让能力的标签标记。' },
  { id: 'markerCluster', group: '标记', label: '点聚合', description: '聚合生成的点标记数据。' },
  { id: 'infoWindow', group: '标记', label: '信息窗体', description: '调试锚点弹窗和自定义内容。' },
  { id: 'polyline', group: '图形', label: '折线', description: '调整路径样式和可见性。' },
  { id: 'polygon', group: '图形', label: '多边形', description: '调整填充透明度和描边颜色。' },
  { id: 'circle', group: '图形', label: '圆形', description: '调整圆形覆盖物大小和样式。' },
  { id: 'rectangle', group: '图形', label: '矩形', description: '绘制并配置矩形覆盖物。' },
  { id: 'ellipse', group: '图形', label: '椭圆', description: '调整椭圆半径和填充样式。' },
  { id: 'bezierCurve', group: '图形', label: '贝塞尔曲线', description: '渲染曲线矢量路径。' },
  { id: 'tileLayer', group: '图层', label: '瓦片图层', description: '在底图上叠加自定义瓦片。' },
  { id: 'traffic', group: '图层', label: '实时路况', description: '切换实时交通图层并控制透明度。' },
  { id: 'satellite', group: '图层', label: '卫星影像', description: '将卫星影像混合到场景中。' },
  { id: 'roadNet', group: '图层', label: '路网', description: '显示路网叠加图层。' },
  { id: 'imageLayer', group: '图层', label: '图片图层', description: '在地图范围内放置图片覆盖物。' },
  { id: 'districtLayer', group: '图层', label: '行政区图层', description: '显示行政区边界图层。' },
  { id: 'geoJSONLayer', group: '数据', label: 'GeoJSON', description: '将 GeoJSON 要素导入地图。' },
  { id: 'heatMap', group: '数据', label: '热力图', description: '渲染带权重点密度数据。' },
  { id: 'toolBar', group: '控件', label: '工具条', description: '放置交互式导航控件。' },
  { id: 'scale', group: '控件', label: '比例尺', description: '在可配置位置显示比例尺。' },
  { id: 'controlBar', group: '控件', label: '组合控制条', description: '显示 3D 导航按钮和切换控件。' },
  { id: 'mapType', group: '控件', label: '图层切换', description: '切换地图类型并显示快捷开关。' },
  { id: 'performance', group: '数据', label: '性能', description: '使用预置数据集对覆盖物做基准测试。' },
] as const satisfies readonly PanelDefinition[]

export const PANEL_IDS = panels.map(panel => panel.id)
