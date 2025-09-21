import type { ShallowRef } from 'vue'

export type LngLatLike = AMap.LngLat | [number, number]
export type PixelLike = AMap.Pixel | [number, number]

export type ReadyCallback = (map: AMap.Map) => void

export interface MapInjectionContext {
  map: ShallowRef<AMap.Map | null>
  ready: (callback: ReadyCallback) => void
}

export interface LoaderOptions {
  /**
   * The API key obtained from the AMap developer console.
   */
  key: string
  /**
   * JSAPI version, defaults to `2.0`.
   */
  version?: string
  /**
   * Plugin list passed to the loader.
   */
  plugins?: string[]
  /**
   * Optional security JS code for JSAPI 2.x applications with enhanced security enabled.
   */
  securityJsCode?: string
  /**
   * Optional custom service host, for private deployments.
   */
  serviceHost?: string
  /**
   * Whether to also load the Loca library. Pass `true` for default or provide the version.
   */
  loca?: boolean | { version?: string }
  /**
   * Custom base URL of the JSAPI script.
   */
  baseUrl?: string
}
