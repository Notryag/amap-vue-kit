import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'

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
      { text: 'FAQ', link: '/faq' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Map',
          items: [
            { text: 'Map', link: '/components/map' },
            { text: 'Marker', link: '/components/marker' },
            { text: 'Info Window', link: '/components/info-window' },
            { text: 'Polyline', link: '/components/polyline' },
            { text: 'Polygon', link: '/components/polygon' },
            { text: 'Circle', link: '/components/circle' }
          ]
        }
      ],
      '/hooks/': [
        {
          text: 'Hooks',
          items: [
            { text: 'useMap', link: '/hooks/use-map' },
            { text: 'useMarker', link: '/hooks/use-marker' },
            { text: 'useOverlay', link: '/hooks/use-overlay' }
          ]
        }
      ],
      '/advanced/': [
        {
          text: 'Advanced',
          items: [
            { text: 'Mass Markers', link: '/advanced/mass-markers' },
            { text: 'Loca & Visualizations', link: '/advanced/loca' },
            { text: 'Custom Tiles', link: '/advanced/custom-tiles' },
            { text: 'Track Animation', link: '/advanced/track-animation' }
          ]
        },
        {
          text: 'Performance',
          items: [
            { text: 'Performance Guide', link: '/advanced/performance' }
          ]
        }
      ],
      '/recipes/': [
        {
          text: 'Recipes',
          items: [
            { text: 'Marker Clusters', link: '/recipes/marker-clusters' },
            { text: 'Heatmap', link: '/recipes/heatmap' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/amap-vue-kit' }
    ],
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_KEY',
      indexName: 'amap-vue-kit'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 AMap Vue Kit'
    }
  },
  vite: {
    resolve: {
      alias: {
        '@amap-vue/core': resolve(__dirname, '../../packages/core/src'),
        '@amap-vue/hooks': resolve(__dirname, '../../packages/hooks/src'),
        '@amap-vue/shared': resolve(__dirname, '../../packages/shared/src')
      }
    }
  }
})
