import type { Theme } from 'vitepress'
import Core from '@amap-vue/core'
import Loca from '@amap-vue/loca'
import { loader } from '@amap-vue/shared'
import DefaultTheme from 'vitepress/theme'

import './style.css'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    DefaultTheme.enhanceApp?.({ app })
    app.use(Core)
    app.use(Loca)

    const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
    if (key)
      loader.config({ key })
  },
}

export default theme
