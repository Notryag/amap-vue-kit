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

function isDevEnvironment() {
  if (typeof import.meta !== 'undefined') {
    const env = (import.meta as any).env
    if (typeof env?.DEV === 'boolean')
      return env.DEV
    if (typeof env?.MODE === 'string')
      return env.MODE !== 'production'
  }

  const globalProcess = typeof globalThis !== 'undefined'
    ? (Reflect.get(globalThis as any, 'process') as { env?: Record<string, any> } | undefined)
    : undefined
  const nodeEnv = globalProcess?.env?.NODE_ENV
  if (typeof nodeEnv === 'string')
    return nodeEnv !== 'production'

  return true
}

export function warn(message: string) {
  if (isDevEnvironment())
    console.warn(`[amap-vue] ${message}`)
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition)
    throw new Error(`[amap-vue] ${message}`)
}
