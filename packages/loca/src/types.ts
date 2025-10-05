import type { Ref } from 'vue'

export type MaybeRefMap<T> = T | Ref<T | null | undefined> | (() => T | null | undefined)

export interface LocaContainerOptions {
  map: AMap.Map
  pitch?: number
  rotateEnable?: boolean
  showZoomBar?: boolean
  showPitch?: boolean
  showCompass?: boolean
  style?: Record<string, any>
}

export interface LocaContainer {
  getMap: () => AMap.Map
  render: () => void
  destroy: () => void
}

export type LocaStyleValue<TData = any> = any | ((item: TData) => any)

export type LocaLayerStyle<TData = any> = Record<string, LocaStyleValue<TData>>

export interface LocaLayer<TData = any> {
  setData: (data: TData[], options?: Record<string, any>) => void
  setStyle: (style: LocaLayerStyle<TData>) => void
  setOptions?: (options: Record<string, any>) => void
  addTo: (container: LocaContainer) => void
  remove: () => void
  render: () => void
  destroy: () => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
}

export interface LocaPointLayerOptions {
  zIndex?: number
  visible?: boolean
  opacity?: number
  blend?: 'normal' | 'add'
  [key: string]: any
}

export interface LocaHeatmapLayerOptions {
  radius?: number
  blur?: number
  opacity?: number
  valueField?: string
  gradient?: Record<number, string>
  zIndex?: number
  visible?: boolean
  [key: string]: any
}

export interface LocaPolygonLayerOptions {
  zIndex?: number
  visible?: boolean
  hasSide?: boolean
  depth?: number
  [key: string]: any
}

export interface LocaPulseLineLayerOptions {
  lineWidth?: number
  duration?: number
  interval?: number
  unit?: string
  height?: number
  trailColor?: string
  [key: string]: any
}

export type LocaPointLayer<TData = any> = LocaLayer<TData>
export type LocaHeatmapLayer<TData = any> = LocaLayer<TData>
export type LocaPolygonLayer<TData = any> = LocaLayer<TData>
export type LocaPulseLineLayer<TData = any> = LocaLayer<TData>

export interface LocaNamespace {
  Container: new (options: LocaContainerOptions) => LocaContainer
  PointLayer: new (options?: LocaPointLayerOptions) => LocaPointLayer
  HeatmapLayer: new (options?: LocaHeatmapLayerOptions) => LocaHeatmapLayer
  PolygonLayer: new (options?: LocaPolygonLayerOptions) => LocaPolygonLayer
  PulseLineLayer: new (options?: LocaPulseLineLayerOptions) => LocaPulseLineLayer
}

declare global {
  interface Window {
    Loca?: LocaNamespace
  }
}

export type { LocaNamespace as Loca }
