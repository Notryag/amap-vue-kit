import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import AmapLoca, { AmapLocaProvider, install } from '../src'

describe('@amap-vue/loca install', () => {
  it('registers all exported components globally', () => {
    const app = createApp({})

    install(app)

    expect(app.component('AmapLocaProvider')).toBe(AmapLocaProvider)
    expect(app.component('AmapLocaPointLayer')).toBeTruthy()
    expect(app.component('AmapLocaHeatmapLayer')).toBeTruthy()
    expect(app.component('AmapLocaPolygonLayer')).toBeTruthy()
  })

  it('exposes a default Vue plugin', () => {
    const app = createApp({})

    app.use(AmapLoca)

    expect(app.component('AmapLocaProvider')).toBe(AmapLocaProvider)
  })
})
