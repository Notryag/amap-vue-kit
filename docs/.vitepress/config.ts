import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AMap Vue Kit',
  description: '面向高德地图 JSAPI 2.x 的 Vue 3 组件与组合式函数库',
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/map' },
      { text: 'Hooks', link: '/hooks/use-map' },
      { text: '进阶', link: '/advanced/mass-markers' },
      { text: '场景方案', link: '/recipes/marker-clusters' },
      { text: '常见问题', link: '/faq' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'A · 基础与覆盖物',
          items: [
            { text: '地图容器', link: '/components/map' },
            { text: '点标记', link: '/components/marker' },
            { text: '文本标记', link: '/components/text' },
            { text: '圆点标记', link: '/components/circle-marker' },
            { text: '灵活点标记', link: '/components/elastic-marker' },
            { text: '点聚合', link: '/components/marker-cluster' },
            { text: '信息窗体', link: '/components/info-window' },
          ],
        },
        {
          text: 'B · 矢量图形',
          items: [
            { text: '折线', link: '/components/polyline' },
            { text: '多边形', link: '/components/polygon' },
            { text: '圆形', link: '/components/circle' },
            { text: '矩形', link: '/components/rectangle' },
            { text: '椭圆', link: '/components/ellipse' },
            { text: '贝塞尔曲线', link: '/components/bezier-curve' },
          ],
        },
        {
          text: 'C · 图层与批量点位',
          items: [
            { text: '瓦片图层', link: '/components/tile-layer' },
            { text: '标签图层', link: '/components/labels-layer' },
            { text: '标签标记', link: '/components/label-marker' },
            { text: '海量点', link: '/components/mass-marks' },
            { text: '行政区图层', link: '/components/district-layer' },
            { text: 'GeoJSON 图层', link: '/components/geojson-layer' },
            { text: '热力图', link: '/components/heat-map' },
          ],
        },
        {
          text: 'D · 控件',
          items: [
            { text: '地图控件', link: '/components/map-controls' },
          ],
        },
        {
          text: 'E · 服务、工具与编辑器',
          items: [
            { text: '右键菜单', link: '/components/context-menu' },
            { text: '鼠标绘制工具', link: '/components/mouse-tool' },
            { text: '图片图层', link: '/components/image-layer' },
            { text: '覆盖物分组', link: '/components/overlay-group' },
            { text: '图形编辑器', link: '/components/editors' },
            { text: '逆地理编码面板', link: '/components/reverse-geocode-panel' },
            { text: '输入提示', link: '/components/auto-complete' },
            { text: '地点搜索', link: '/components/place-search' },
            { text: '驾车路线', link: '/components/driving' },
            { text: '步行路线', link: '/components/walking' },
            { text: '骑行路线', link: '/components/riding' },
            { text: '天气面板', link: '/components/weather-panel' },
          ],
        },
      ],
      '/hooks/': [
        {
          text: 'Hooks',
          items: [
            { text: 'useMap', link: '/hooks/use-map' },
            { text: 'useMarker', link: '/hooks/use-marker' },
            { text: 'useCircleMarker', link: '/hooks/use-circle-marker' },
            { text: 'useElasticMarker', link: '/hooks/use-elastic-marker' },
            { text: 'useMarkerClusterer', link: '/hooks/use-marker-clusterer' },
            { text: 'useBezierCurve', link: '/hooks/use-bezier-curve' },
            { text: 'useText', link: '/hooks/use-text' },
            { text: 'useInfoWindow', link: '/hooks/use-info-window' },
            { text: 'usePolyline', link: '/hooks/use-polyline' },
            { text: 'usePolygon', link: '/hooks/use-polygon' },
            { text: 'useCircle', link: '/hooks/use-circle' },
            { text: 'useRectangle', link: '/hooks/use-rectangle' },
            { text: 'useEllipse', link: '/hooks/use-ellipse' },
            { text: 'useTileLayer', link: '/hooks/use-tile-layer' },
            { text: 'useImageLayer', link: '/hooks/use-image-layer' },
            { text: 'useHeatMap', link: '/hooks/use-heat-map' },
            { text: 'useOverlay', link: '/hooks/use-overlay' },
            { text: 'useOverlayGroup', link: '/hooks/use-overlay-group' },
            { text: 'useLabelsLayer', link: '/hooks/use-labels-layer' },
            { text: 'useLabelMarker', link: '/hooks/use-label-marker' },
            { text: 'useMassMarkers', link: '/hooks/use-mass-markers' },
            { text: 'useControl', link: '/hooks/use-control' },
            { text: 'useMouseTool', link: '/hooks/use-mouse-tool' },
            { text: 'useGeocoder', link: '/hooks/use-geocoder' },
            { text: 'useAutoComplete', link: '/hooks/use-auto-complete' },
            { text: 'useGeolocation', link: '/hooks/use-geolocation' },
            { text: 'useWeather', link: '/hooks/use-weather' },
            { text: 'usePlaceSearch', link: '/hooks/use-place-search' },
            { text: 'useDriving', link: '/hooks/use-driving' },
            { text: 'useWalking', link: '/hooks/use-walking' },
            { text: 'useRiding', link: '/hooks/use-riding' },
            { text: 'useContextMenu', link: '/hooks/use-context-menu' },
            { text: 'useEditor', link: '/hooks/use-editor' },
          ],
        },
      ],
      '/advanced/': [
        {
          text: '进阶',
          items: [
            { text: '海量点', link: '/advanced/mass-markers' },
            { text: 'Loca 可视化', link: '/advanced/loca' },
            { text: '自定义瓦片', link: '/advanced/custom-tiles' },
            { text: '轨迹动画', link: '/advanced/track-animation' },
          ],
        },
        {
          text: '性能',
          items: [
            { text: '性能指南', link: '/advanced/performance' },
          ],
        },
      ],
      '/recipes/': [
        {
          text: '场景方案',
          items: [
            { text: '园区底图', link: '/recipes/campus-basemap' },
            { text: '点聚合', link: '/recipes/marker-clusters' },
            { text: '联动信息窗体', link: '/recipes/info-window-linking' },
            { text: '热力图', link: '/recipes/heatmap' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Notryag/amap-vue-kit' },
    ],
    footer: {
      message: '基于 MIT 协议发布。',
      copyright: 'Copyright © 2024 AMap Vue Kit',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@amap-vue/core': resolve(__dirname, '../../packages/core/src'),
        '@amap-vue/hooks': resolve(__dirname, '../../packages/hooks/src'),
        '@amap-vue/loca': resolve(__dirname, '../../packages/loca/src'),
        '@amap-vue/shared': resolve(__dirname, '../../packages/shared/src'),
      },
    },
  },
})
