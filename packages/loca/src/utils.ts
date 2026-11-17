import type { Loca, LocaGeoJSONSource } from './types'
import { isLocaReady } from '@amap-vue/shared'

export function getLoca(): Loca {
  if (!isLocaReady())
    throw new Error('[amap-vue] Loca is not loaded. Enable it via loader.load({ loca: true }).')

  const loca = (window as any).Loca as Loca | undefined
  if (!loca)
    throw new Error('[amap-vue] Loca global object is missing. Ensure the Loca script finished loading before creating layers.')

  return loca
}

export function createGeoJSONSource(data: Record<string, any>): LocaGeoJSONSource {
  const loca = getLoca()
  return new loca.GeoJSONSource({ data })
}

export function createPointFeature(item: Record<string, any>, lng: number, lat: number) {
  return {
    type: 'Feature',
    properties: item,
    geometry: {
      type: 'Point',
      coordinates: [lng, lat],
    },
  }
}

export function createLineFeature(item: Record<string, any>, path: [number, number][]) {
  return {
    type: 'Feature',
    properties: item,
    geometry: {
      type: 'LineString',
      coordinates: path,
    },
  }
}

export function createFeatureCollection(features: Record<string, any>[]) {
  return {
    type: 'FeatureCollection',
    features,
  }
}
