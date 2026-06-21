import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import AmapVue, { AmapMap, install } from '../src'

describe('@amap-vue/core install', () => {
  it('registers all exported components globally', () => {
    const app = createApp({})

    install(app)

    expect(app.component('AmapMap')).toBe(AmapMap)
    expect(app.component('AmapMarker')).toBeTruthy()
    expect(app.component('AmapToolBar')).toBeTruthy()
  })

  it('exposes a default Vue plugin', () => {
    const app = createApp({})

    app.use(AmapVue)

    expect(app.component('AmapMap')).toBe(AmapMap)
  })
})
