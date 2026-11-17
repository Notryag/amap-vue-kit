import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { apiSidebar } from './features'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AMap Vue Kit',
  description: '面向高德地图 JSAPI 2.x 的 Vue 3 组件与组合式函数库',
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    search: { provider: 'local' },
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '功能与示例', link: '/api/' },
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
      '/api/': apiSidebar,
      '/components/': apiSidebar,
      '/hooks/': apiSidebar,
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
    envDir: resolve(__dirname, '../..'),
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
