import type { Loca } from './types'
import { isLocaReady } from '@amap-vue/shared'

export function getLoca(): Loca {
  if (!isLocaReady())
    throw new Error('[amap-vue] Loca is not loaded. Enable it via loader.load({ loca: true }).')

  const loca = (window as any).Loca as Loca | undefined
  if (!loca)
    throw new Error('[amap-vue] Loca global object is missing. Ensure the Loca script finished loading before creating layers.')

  return loca
}

export function callLayer<T extends { render?: () => void }>(layer: T | null | undefined, method: keyof T, ...args: any[]) {
  if (layer && typeof (layer as any)[method] === 'function')
    (layer as any)[method](...args)
}
