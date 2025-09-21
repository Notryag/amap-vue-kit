import type { LoaderOptions } from './types'
import { invariant, isClient, warn } from './utils'

const DEFAULT_VERSION = '2.0'
const DEFAULT_LOCA_VERSION = '2.0.0'

interface LoaderState {
  promise: Promise<typeof AMap> | null
  script?: HTMLScriptElement
  config?: LoaderOptions
}

const state: LoaderState = {
  promise: null,
}

let defaults: Partial<LoaderOptions> = {}

function buildScriptUrl(options: LoaderOptions): string {
  const base = options.baseUrl ?? 'https://webapi.amap.com/maps'
  const params = new URLSearchParams()
  params.set('v', options.version ?? DEFAULT_VERSION)
  params.set('key', options.key)
  if (options.plugins?.length)
    params.set('plugin', Array.from(new Set(options.plugins)).join(','))
  if (options.serviceHost)
    params.set('serviceHost', options.serviceHost)
  return `${base}?${params.toString()}`
}

async function loadLoca(options: LoaderOptions) {
  if (!options.loca)
    return

  const version = typeof options.loca === 'object' && options.loca?.version ? options.loca.version : DEFAULT_LOCA_VERSION
  const url = `https://webapi.amap.com/loca?v=${version}&key=${options.key}`

  if (!document.querySelector('script[data-amap-loca]')) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      script.async = true
      script.dataset.amapLoca = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load AMap Loca script'))
      document.head.appendChild(script)
    })
  }
}

function resolveOptions(options?: Partial<LoaderOptions>): LoaderOptions {
  const resolved: LoaderOptions = {
    version: DEFAULT_VERSION,
    ...defaults,
    ...options,
  } as LoaderOptions

  invariant(resolved.key, 'AMap loader requires an API key. Call loader.config({ key }) before loading.')
  return resolved
}

function createLoadPromise(options: LoaderOptions) {
  const existing = (window as any).AMap as typeof AMap | undefined
  if (existing)
    return Promise.resolve(existing)

  if (options.securityJsCode) {
    (window as any)._AMapSecurityConfig = {
      securityJsCode: options.securityJsCode,
    }
  }

  if (state.script) {
    return new Promise<typeof AMap>((resolve, reject) => {
      state.script?.addEventListener('load', () => {
        const instance = (window as any).AMap as typeof AMap | undefined
        if (instance)
          resolve(instance)
        else
          reject(new Error('AMap JSAPI loaded but did not expose the global `AMap` object.'))
      })
      state.script?.addEventListener('error', () => {
        state.promise = null
        reject(new Error('Failed to load the AMap JSAPI script.'))
      })
    })
  }

  return new Promise<typeof AMap>((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.dataset.amapLoader = 'true'
    script.src = buildScriptUrl(options)

    script.onload = () => {
      const instance = (window as any).AMap as typeof AMap | undefined
      if (instance)
        resolve(instance)
      else
        reject(new Error('AMap JSAPI loaded but did not expose the global `AMap` object.'))
    }
    script.onerror = () => {
      state.promise = null
      script.remove()
      reject(new Error('Failed to load the AMap JSAPI script.'))
    }

    document.head.appendChild(script)
    state.script = script
  })
}

export function createLoader() {
  return {
    config(options: Partial<LoaderOptions>) {
      defaults = {
        ...defaults,
        ...options,
      }
    },
    get(): typeof AMap | undefined {
      return isClient ? (window as any).AMap as typeof AMap | undefined : undefined
    },
    isLoaded(): boolean {
      return Boolean(isClient && (window as any).AMap)
    },
    getConfig(): Partial<LoaderOptions> {
      return { ...defaults }
    },
    async load(options?: Partial<LoaderOptions>): Promise<typeof AMap> {
      invariant(isClient, 'AMap loader can only run in a browser environment.')
      const resolved = resolveOptions(options)

      if (state.promise) {
        if (state.config) {
          const { key, version, plugins = [] } = state.config
          if ((key && key !== resolved.key) || (version && version !== resolved.version))
            warn('Attempted to call loader.load() with a configuration that differs from the initial call. Existing configuration will be reused.')

          if (resolved.plugins) {
            const merged = new Set([...(state.config.plugins ?? []), ...resolved.plugins])
            resolved.plugins = Array.from(merged)
          }
        }

        return state.promise
      }

      const promise = createLoadPromise(resolved)
        .then(async (AMapInstance) => {
          state.config = resolved
          await loadLoca(resolved)
          return AMapInstance
        })
      state.promise = promise
      return promise
    },
  }
}

export const loader = createLoader()

export type { LoaderOptions }
