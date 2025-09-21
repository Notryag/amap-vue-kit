import type { LabelsLayerInjectionContext, MapInjectionContext } from './types'

export const amapMapInjectionKey: unique symbol = Symbol('amap-map-context')
export const amapLabelsLayerInjectionKey: unique symbol = Symbol('amap-labels-layer-context')

export type { LabelsLayerInjectionContext, MapInjectionContext }
