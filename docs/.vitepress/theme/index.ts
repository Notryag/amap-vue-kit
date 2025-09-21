import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Core from '@amap-vue/core'
import { loader } from '@amap-vue/shared'

import './style.css'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    DefaultTheme.enhanceApp?.({ app })
    app.use(Core)

    const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
    if (key)
      loader.config({ key })
  }
}

export default theme
