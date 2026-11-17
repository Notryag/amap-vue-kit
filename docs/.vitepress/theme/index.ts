import type { Theme } from 'vitepress'
import Core from '@amap-vue/core'
import Loca from '@amap-vue/loca'
import { loader } from '@amap-vue/shared'
import DefaultTheme from 'vitepress/theme'
import ApiCatalog from './ApiCatalog.vue'
import DemoPreview from './DemoPreview.vue'
import DocsLayout from './DocsLayout.vue'

import './style.css'

const theme: Theme = {
  ...DefaultTheme,
  Layout: DocsLayout,
  enhanceApp({ app }) {
    DefaultTheme.enhanceApp?.({ app })
    app.use(Core)
    app.use(Loca)
    app.component('DemoPreview', DemoPreview)
    app.component('ApiCatalog', ApiCatalog)

    const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
    if (key)
      loader.config({ key })
  },
}

export default theme
