import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'AMap Vue Kit',
  description: 'Vue 3 components and composables for AMap JSAPI 2.x',
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/map' },
      { text: 'Hooks', link: '/hooks/use-map' },
      { text: 'Advanced', link: '/advanced/mass-markers' },
      { text: 'Recipes', link: '/recipes/marker-clusters' },
      { text: 'FAQ', link: '/faq' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'A · Basics & Overlays',
          items: [
            { text: 'Map', link: '/components/map' },
            { text: 'Marker', link: '/components/marker' },
            { text: 'Text', link: '/components/text' },
            { text: 'Circle Marker', link: '/components/circle-marker' },
            { text: 'Elastic Marker', link: '/components/elastic-marker' },
            { text: 'Marker Cluster', link: '/components/marker-cluster' },
            { text: 'Info Window', link: '/components/info-window' },
          ],
        },
        {
          text: 'A · Geometry',
          items: [
            { text: 'Polyline', link: '/components/polyline' },
            { text: 'Polygon', link: '/components/polygon' },
            { text: 'Circle', link: '/components/circle' },
            { text: 'Rectangle', link: '/components/rectangle' },
            { text: 'Ellipse', link: '/components/ellipse' },
            { text: 'Bezier Curve', link: '/components/bezier-curve' },
          ],
        },
        {
          text: 'B · Layers',
          items: [
            { text: 'Tile Layers', link: '/components/tile-layer' },
            { text: 'Labels Layer', link: '/components/labels-layer' },
            { text: 'Label Marker', link: '/components/label-marker' },
            { text: 'Heat Map', link: '/components/heat-map' },
          ],
        },
        {
          text: 'C · Controls',
          items: [
            { text: 'Map Controls', link: '/components/map-controls' },
          ],
        },
        {
          text: 'D · Utilities & Editors',
          items: [
            { text: 'Context Menu', link: '/components/context-menu' },
            { text: 'Image Layer', link: '/components/image-layer' },
            { text: 'Overlay Group', link: '/components/overlay-group' },
            { text: 'Shape Editors', link: '/components/editors' },
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
            { text: 'useContextMenu', link: '/hooks/use-context-menu' },
            { text: 'useEditor', link: '/hooks/use-editor' },
          ],
        },
      ],
      '/advanced/': [
        {
          text: 'Advanced',
          items: [
            { text: 'Mass Markers', link: '/advanced/mass-markers' },
            { text: 'Loca & Visualizations', link: '/advanced/loca' },
            { text: 'Custom Tiles', link: '/advanced/custom-tiles' },
            { text: 'Track Animation', link: '/advanced/track-animation' },
          ],
        },
        {
          text: 'Performance',
          items: [
            { text: 'Performance Guide', link: '/advanced/performance' },
          ],
        },
      ],
      '/recipes/': [
        {
          text: 'Recipes',
          items: [
            { text: 'Campus Basemap', link: '/recipes/campus-basemap' },
            { text: 'Marker Clusters', link: '/recipes/marker-clusters' },
            { text: 'Linked Info Windows', link: '/recipes/info-window-linking' },
            { text: 'Heatmap', link: '/recipes/heatmap' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/amap-vue-kit' },
    ],
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_KEY',
      indexName: 'amap-vue-kit',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 AMap Vue Kit',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@amap-vue/core': resolve(__dirname, '../../packages/core/src'),
        '@amap-vue/hooks': resolve(__dirname, '../../packages/hooks/src'),
        '@amap-vue/shared': resolve(__dirname, '../../packages/shared/src'),
      },
    },
  },
})
