import type { LngLatLike, PixelLike } from './types'

export const isClient = typeof window !== 'undefined'

export function toLngLat<AMapType extends typeof AMap>(AMap: AMapType, value: LngLatLike | undefined | null): AMap.LngLat | undefined {
  if (!value)
    return undefined

  if (Array.isArray(value))
    return new AMap.LngLat(value[0], value[1])

  return value
}

export function toPixel<AMapType extends typeof AMap>(AMap: AMapType, value: PixelLike | undefined | null): AMap.Pixel | undefined {
  if (!value)
    return undefined

  if (Array.isArray(value))
    return new AMap.Pixel(value[0], value[1])

  return value
}

export function warn(message: string) {
  if (process.env.NODE_ENV !== 'production')
    console.warn(`[amap-vue] ${message}`)
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition)
    throw new Error(`[amap-vue] ${message}`)
}
