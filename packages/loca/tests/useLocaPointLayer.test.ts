import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocaPointLayer } from '../src/composables/useLocaPointLayer'
import type { LocaNamespace } from '../src/types'

class MockContainer {
  render = vi.fn()
}

class MockPointLayer {
  public data: any[] = []
  public style: any = null
  public container: any = null
  public render = vi.fn()
  public remove = vi.fn()
  public destroy = vi.fn()
  public on = vi.fn()
  public off = vi.fn()

  constructor(public options: Record<string, any> = {}) {}

  setData(data: any[], options: Record<string, any>) {
    this.data = data.map(item => ({
      point: options.lnglat ? options.lnglat(item) : null,
    }))
  }

  setStyle(style: Record<string, any>) {
    this.style = style
  }

  addTo(container: any) {
    this.container = container
  }
}

let mockLoca: LocaNamespace

beforeEach(() => {
  mockLoca = {
    Container: vi.fn() as any,
    PointLayer: MockPointLayer as any,
    HeatmapLayer: MockPointLayer as any,
    PolygonLayer: MockPointLayer as any,
    PulseLineLayer: MockPointLayer as any,
  }
  ;(globalThis as any).Loca = mockLoca
})

describe('useLocaPointLayer', () => {
  it('sets data using provided keys', () => {
    const container = new MockContainer()
    const api = useLocaPointLayer(() => container as any)

    api.setData([
      { lng: 116.397428, lat: 39.90923 },
      { lng: 120, lat: 30 },
    ])

    api.addTo(container as any)

    expect((api.layer.value as any).data).toEqual([
      { point: [116.397428, 39.90923] },
      { point: [120, 30] },
    ])
    expect((api.layer.value as any).container).toBe(container)
  })

  it('throws when coordinates are missing', () => {
    const container = new MockContainer()
    const api = useLocaPointLayer(() => container as any)

    expect(() => api.setData([{ lng: null, lat: 10 } as any])).toThrowError(/numeric/)
  })
})
