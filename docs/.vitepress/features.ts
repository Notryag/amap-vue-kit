export interface ApiFeature {
  name: string
  component?: string
  hook?: string
}

export interface ApiGroup {
  text: string
  items: ApiFeature[]
}

// Follow the JSAPI 2.0 reference order, listing implemented features only.
export const apiGroups: ApiGroup[] = [
  {
    text: '地图',
    items: [
      { name: '地图 Map', component: 'map', hook: 'use-map' },
    ],
  },
  {
    text: '高德官方图层',
    items: [
      { name: '瓦片与卫星图层 TileLayer', component: 'tile-layer', hook: 'use-tile-layer' },
      { name: '3D 楼块 Buildings', component: 'buildings', hook: 'use-buildings' },
      { name: '行政区图层 DistrictLayer', component: 'district-layer' },
    ],
  },
  {
    text: '行业标准图层',
    items: [
      { name: 'WMS 图层', component: 'wms-layer', hook: 'use-wms-layer' },
      { name: 'WMTS 图层', component: 'wmts-layer', hook: 'use-wmts-layer' },
    ],
  },
  {
    text: '自有数据图层',
    items: [
      { name: '热力图 HeatMap', component: 'heat-map', hook: 'use-heat-map' },
      { name: '标签图层 LabelsLayer', component: 'labels-layer', hook: 'use-labels-layer' },
      { name: '图片图层 ImageLayer', component: 'image-layer', hook: 'use-image-layer' },
    ],
  },
  {
    text: '点标记',
    items: [
      { name: '点标记 Marker', component: 'marker', hook: 'use-marker' },
      { name: '文本 Text', component: 'text', hook: 'use-text' },
      { name: '标签标记 LabelMarker', component: 'label-marker', hook: 'use-label-marker' },
      { name: '灵活标记 ElasticMarker', component: 'elastic-marker', hook: 'use-elastic-marker' },
      { name: '点聚合 MarkerCluster', component: 'marker-cluster', hook: 'use-marker-clusterer' },
      { name: '海量点 MassMarks', component: 'mass-marks', hook: 'use-mass-markers' },
    ],
  },
  {
    text: '信息窗体',
    items: [
      { name: '信息窗体 InfoWindow', component: 'info-window', hook: 'use-info-window' },
    ],
  },
  {
    text: '右键菜单',
    items: [
      { name: '右键菜单 ContextMenu', component: 'context-menu', hook: 'use-context-menu' },
    ],
  },
  {
    text: '矢量图形',
    items: [
      { name: '多边形 Polygon', component: 'polygon', hook: 'use-polygon' },
      { name: '折线 Polyline', component: 'polyline', hook: 'use-polyline' },
      { name: '贝塞尔曲线 BezierCurve', component: 'bezier-curve', hook: 'use-bezier-curve' },
      { name: '圆形 Circle', component: 'circle', hook: 'use-circle' },
      { name: '圆点 CircleMarker', component: 'circle-marker', hook: 'use-circle-marker' },
      { name: '椭圆 Ellipse', component: 'ellipse', hook: 'use-ellipse' },
      { name: '矩形 Rectangle', component: 'rectangle', hook: 'use-rectangle' },
      { name: 'GeoJSON', component: 'geojson-layer' },
    ],
  },
  {
    text: '覆盖物群组',
    items: [
      { name: '覆盖物分组 OverlayGroup', component: 'overlay-group', hook: 'use-overlay-group' },
    ],
  },
  {
    text: '地图控件',
    items: [
      { name: '工具条、比例尺与地图类型', component: 'map-controls', hook: 'use-control' },
      { name: '鹰眼 HawkEye', component: 'hawk-eye', hook: 'use-hawk-eye' },
    ],
  },
  {
    text: '工具',
    items: [
      { name: '鼠标绘制 MouseTool', component: 'mouse-tool', hook: 'use-mouse-tool' },
      { name: '测距工具 RangingTool', component: 'ranging-tool', hook: 'use-ranging-tool' },
      { name: '图形编辑器 Editor', component: 'editors', hook: 'use-editor' },
    ],
  },
  {
    text: '搜索服务',
    items: [
      { name: '输入提示 AutoComplete', component: 'auto-complete', hook: 'use-auto-complete' },
      { name: '地点搜索 PlaceSearch', component: 'place-search', hook: 'use-place-search' },
    ],
  },
  {
    text: '地理编码',
    items: [
      { name: '地理编码 Geocoder', component: 'reverse-geocode-panel', hook: 'use-geocoder' },
    ],
  },
  {
    text: '路线规划',
    items: [
      { name: '驾车 Driving', component: 'driving', hook: 'use-driving' },
      { name: '步行 Walking', component: 'walking', hook: 'use-walking' },
      { name: '骑行 Riding', component: 'riding', hook: 'use-riding' },
      { name: '公交换乘 Transfer', component: 'transfer', hook: 'use-transfer' },
    ],
  },
  {
    text: '其他服务',
    items: [
      { name: '行政区查询 DistrictSearch', hook: 'use-district-search' },
      { name: '天气 Weather', component: 'weather-panel', hook: 'use-weather' },
    ],
  },
  {
    text: '定位',
    items: [
      { name: '定位 Geolocation', hook: 'use-geolocation' },
    ],
  },
  {
    text: '底层封装',
    items: [
      { name: '自定义覆盖物 useOverlay', hook: 'use-overlay' },
    ],
  },
]

export const apiSidebar = [
  { text: '功能总览', link: '/api/' },
  ...apiGroups.map(group => ({
    text: group.text,
    collapsed: true,
    items: group.items.map(feature => ({
      text: feature.name,
      link: feature.component
        ? `/components/${feature.component}`
        : `/hooks/${feature.hook}`,
      activeMatch: `^/(?:${[
        feature.component && `components/${feature.component}`,
        feature.hook && `hooks/${feature.hook}`,
      ].filter(Boolean).join('|')})(?:\\.html)?$`,
    })),
  })),
]
