import type { LoaderOptions } from './types'
import { invariant, isClient, warn } from './utils'

const DEFAULT_VERSION = '2.0'
const DEFAULT_LOCA_VERSION = '2.0.0'

interface LoaderState {
  promise: Promise<typeof AMap> | null
  locaPromise: Promise<void> | null
  script?: HTMLScriptElement
  config?: LoaderOptions
  loadedPlugins: Set<string>
  pluginPromises: Map<string, Promise<void>>
}

const state: LoaderState = {
  promise: null,
  locaPromise: null,
  loadedPlugins: new Set(),
  pluginPromises: new Map(),
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

function normalizePlugins(plugins?: string[]) {
  return Array.from(new Set((plugins ?? []).filter(Boolean)))
}

function isPluginReady(AMapInstance: typeof AMap, plugin: string) {
  if (!plugin.startsWith('AMap.'))
    return state.loadedPlugins.has(plugin)

  const path = plugin.slice('AMap.'.length).split('.')
  let current: any = AMapInstance

  for (const segment of path) {
    current = current?.[segment]
    if (current == null)
      return false
  }

  return true
}

async function loadPlugins(AMapInstance: typeof AMap, plugins?: string[]) {
  const requested = normalizePlugins(plugins)
  if (!requested.length)
    return

  const promises = requested.map((plugin) => {
    if (state.loadedPlugins.has(plugin) || isPluginReady(AMapInstance, plugin)) {
      state.loadedPlugins.add(plugin)
      return Promise.resolve()
    }

    const pending = state.pluginPromises.get(plugin)
    if (pending)
      return pending

    const pluginLoader = (AMapInstance as any).plugin
    if (typeof pluginLoader !== 'function')
      return Promise.reject(new Error(`AMap plugin loader is unavailable. Cannot load ${plugin}.`))

    const promise = new Promise<void>((resolve) => {
      pluginLoader.call(AMapInstance, plugin, () => {
        state.loadedPlugins.add(plugin)
        resolve()
      })
    }).finally(() => {
      state.pluginPromises.delete(plugin)
    })

    state.pluginPromises.set(plugin, promise)
    return promise
  })

  await Promise.all(promises)
}

function mergeConfig(previous: LoaderOptions | undefined, next: LoaderOptions): LoaderOptions {
  if (!previous) {
    return {
      ...next,
      plugins: normalizePlugins(next.plugins),
    }
  }

  return {
    ...previous,
    ...next,
    key: previous.key,
    version: previous.version,
    plugins: normalizePlugins([
      ...(previous.plugins ?? []),
      ...(next.plugins ?? []),
    ]),
  }
}

async function loadLoca(options: LoaderOptions) {
  if (!options.loca)
    return

  if (isLocaReady())
    return

  if (state.locaPromise)
    return state.locaPromise

  const version = typeof options.loca === 'object' && options.loca?.version ? options.loca.version : DEFAULT_LOCA_VERSION
  const url = `https://webapi.amap.com/loca?v=${version}&key=${options.key}`

  const existing = document.querySelector('script[data-amap-loca]') as HTMLScriptElement | null
  if (existing) {
    state.locaPromise = new Promise<void>((resolve, reject) => {
      if (isLocaReady()) {
        state.locaPromise = null
        resolve()
        return
      }

      const cleanup = () => {
        existing.removeEventListener('load', handleLoad)
        existing.removeEventListener('error', handleError)
        state.locaPromise = null
      }

      const complete = (result: 'resolve' | 'reject', error?: Error) => {
        cleanup()
        if (result === 'resolve')
          resolve()
        else if (error)
          reject(error)
      }

      function handleLoad() {
        if (isLocaReady())
          complete('resolve')
        else
          complete('reject', new Error('AMap Loca script loaded but `Loca` global is missing.'))
      }

      function handleError() {
        complete('reject', new Error('Failed to load the AMap Loca script.'))
      }

      existing.addEventListener('load', handleLoad, { once: true })
      existing.addEventListener('error', handleError, { once: true })
    })
    return state.locaPromise
  }

  state.locaPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.dataset.amapLoca = 'true'
    let timeoutId: number | undefined

    const cleanup = () => {
      script.onload = null
      script.onerror = null
      if (timeoutId != null) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
      state.locaPromise = null
    }

    script.onload = () => {
      cleanup()
      if (isLocaReady())
        resolve()
      else
        reject(new Error('AMap Loca script loaded but `Loca` global is missing.'))
    }

    script.onerror = () => {
      cleanup()
      script.remove()
      reject(new Error('Failed to load the AMap Loca script.'))
    }

    if (options.timeout != null) {
      timeoutId = window.setTimeout(() => {
        cleanup()
        script.remove()
        reject(new Error(`Loading the AMap Loca script timed out after ${options.timeout}ms.`))
      }, options.timeout)
    }

    document.head.appendChild(script)
  })

  return state.locaPromise
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

  const { timeout } = options

  if (state.script) {
    return new Promise<typeof AMap>((resolve, reject) => {
      const script = state.script!
      let timeoutId: number | undefined

      const clearTimer = () => {
        if (timeoutId != null) {
          clearTimeout(timeoutId)
          timeoutId = undefined
        }
      }

      const detach = () => {
        script.removeEventListener('load', handleLoad)
        script.removeEventListener('error', handleError)
      }

      const fail = (error: Error) => {
        clearTimer()
        detach()
        state.promise = null
        if (state.script === script)
          state.script = undefined
        script.remove()
        reject(error)
      }

      function handleLoad() {
        clearTimer()
        detach()
        const instance = (window as any).AMap as typeof AMap | undefined
        if (instance)
          resolve(instance)
        else
          fail(new Error('AMap JSAPI loaded but did not expose the global `AMap` object.'))
      }

      function handleError() {
        fail(new Error('Failed to load the AMap JSAPI script.'))
      }

      if (timeout != null) {
        timeoutId = window.setTimeout(() => {
          fail(new Error(`Loading the AMap JSAPI timed out after ${timeout}ms.`))
        }, timeout)
      }

      script.addEventListener('load', handleLoad)
      script.addEventListener('error', handleError)
    })
  }

  return new Promise<typeof AMap>((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.dataset.amapLoader = 'true'
    script.src = buildScriptUrl(options)

    let timeoutId: number | undefined
    const clearTimer = () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
    }

    const detach = () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }

    const fail = (error: Error) => {
      clearTimer()
      detach()
      state.promise = null
      if (state.script === script)
        state.script = undefined
      script.remove()
      reject(error)
    }

    function handleLoad() {
      clearTimer()
      detach()
      const instance = (window as any).AMap as typeof AMap | undefined
      if (instance)
        resolve(instance)
      else
        fail(new Error('AMap JSAPI loaded but did not expose the global `AMap` object.'))
    }

    function handleError() {
      fail(new Error('Failed to load the AMap JSAPI script.'))
    }

    if (timeout != null) {
      timeoutId = window.setTimeout(() => {
        fail(new Error(`Loading the AMap JSAPI timed out after ${timeout}ms.`))
      }, timeout)
    }

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

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
          const { key, version } = state.config
          if ((key && key !== resolved.key) || (version && version !== resolved.version))
            warn('Attempted to call loader.load() with a configuration that differs from the initial call. Existing configuration will be reused.')

          if (resolved.plugins) {
            const merged = new Set([...(state.config.plugins ?? []), ...resolved.plugins])
            resolved.plugins = Array.from(merged)
          }
        }

        return state.promise.then(async (AMapInstance) => {
          await loadPlugins(AMapInstance, resolved.plugins)
          await loadLoca(resolved)
          state.config = mergeConfig(state.config, resolved)
          return AMapInstance
        })
      }

      const promise = createLoadPromise(resolved)
        .then(async (AMapInstance) => {
          await loadPlugins(AMapInstance, resolved.plugins)
          state.config = mergeConfig(state.config, resolved)
          await loadLoca(resolved)
          return AMapInstance
        })
      state.promise = promise
      return promise
    },
  }
}

export const loader = createLoader()

export function isLocaReady(): boolean {
  return Boolean(isClient && (window as any).Loca)
}

export type { LoaderOptions }
