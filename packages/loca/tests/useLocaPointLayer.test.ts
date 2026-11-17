import type { LocaNamespace } from '../src/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocaPointLayer } from '../src/composables/useLocaPointLayer'

class MockContainer {
  render = vi.fn()
  add = vi.fn()
  remove = vi.fn()
}

class MockPointLayer {
  public source: any = null
  public style: any = null
  public container: any = null
  public render = vi.fn()
  public destroy = vi.fn()
  public on = vi.fn()
  public off = vi.fn()

  constructor(public options: Record<string, any> = {}) {}

  setSource(source: any) {
    this.source = source
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
    GeoJSONSource: vi.fn((options: Record<string, any>) => {
      return options
    }) as any,
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

    expect((api.layer.value as any).source.data).toEqual({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { lng: 116.397428, lat: 39.90923 },
          geometry: { type: 'Point', coordinates: [116.397428, 39.90923] },
        },
        {
          type: 'Feature',
          properties: { lng: 120, lat: 30 },
          geometry: { type: 'Point', coordinates: [120, 30] },
        },
      ],
    })
    expect(container.add).toHaveBeenCalledWith(api.layer.value)
  })

  it('throws when coordinates are missing', () => {
    const container = new MockContainer()
    const api = useLocaPointLayer(() => container as any)

    expect(() => api.setData([{ lng: null, lat: 10 } as any])).toThrowError(/numeric/)
  })
})
