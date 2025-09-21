import { computed, onBeforeUnmount, onMounted, shallowRef, toValue, watch } from 'vue'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { LngLatLike, ReadyCallback, LoaderOptions } from '@amap-vue/shared'
import { loader } from '@amap-vue/shared'
import { isClient, toLngLat, warn } from '@amap-vue/shared'

export interface UseMapOptions extends Partial<AMap.MapOptions> {
  container?: MaybeRefOrGetter<HTMLElement | null | undefined> | string | HTMLElement
  plugins?: string[]
  loaderOptions?: Partial<LoaderOptions>
}

export interface UseMapReturn {
  map: ShallowRef<AMap.Map | null>
  ready: (callback: ReadyCallback) => void
  setCenter: (center: LngLatLike | undefined) => void
  setZoom: (zoom: number | undefined) => void
  setPitch: (pitch: number | undefined) => void
  setRotation: (rotation: number | undefined) => void
  setMapStyle: (style: string | undefined) => void
  setTheme: (theme: string | undefined) => void
  setViewMode: (mode: AMap.MapViewMode | undefined) => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
  destroy: () => void
  setContainer: (element: HTMLElement | null) => void
}

type ContainerLike = MaybeRefOrGetter<HTMLElement | null | undefined> | string | HTMLElement

function resolveContainer(source: ContainerLike | undefined): HTMLElement | null {
  if (!isClient || !source)
    return null

  if (typeof source === 'string')
    return document.querySelector<HTMLElement>(source) ?? document.getElementById(source) ?? null

  if (source instanceof HTMLElement)
    return source

  const value = toValue(source)
  return value ?? null
}

export function useMap(options: MaybeRefOrGetter<UseMapOptions>, container?: MaybeRefOrGetter<HTMLElement | null | undefined>): UseMapReturn {
  const map = shallowRef<AMap.Map | null>(null)
  const containerRef = shallowRef<HTMLElement | null>(null)
  const readyCallbacks: ReadyCallback[] = []
  const listeners = new Set<{ event: string; handler: (event: any) => void }>()
  let creating = false

  const optionsRef = computed<UseMapOptions>(() => ({
    ...(toValue(options) as UseMapOptions | undefined ?? {})
  }))

  const containerSource = computed(() => {
    const opts = optionsRef.value
    const fromOptions = resolveContainer(opts.container)
    if (fromOptions)
      return fromOptions

    return resolveContainer(container)
  })

  watch(containerSource, (value) => {
    if (value)
      containerRef.value = value
  }, { immediate: true })

  if (container) {
    watch(() => toValue(container), (value) => {
      if (value)
        containerRef.value = value
    })
  }

  function bindListeners(instance: AMap.Map) {
    for (const listener of listeners)
      (instance as any).on?.(listener.event, listener.handler)
  }

  function unbindListeners(instance: AMap.Map) {
    for (const listener of listeners)
      (instance as any).off?.(listener.event, listener.handler)
  }

  async function ensureMap() {
    if (!isClient || creating || map.value || !containerRef.value)
      return

    creating = true
    try {
      const opts = optionsRef.value
      const { container: _ignoredContainer, plugins, loaderOptions, ...mapOptions } = opts
      const loadOptions: Partial<LoaderOptions> = {
        ...(plugins ? { plugins } : {}),
        ...loaderOptions
      }

      const AMap = await loader.load(loadOptions)
      const instance = new AMap.Map(containerRef.value!, mapOptions)
      map.value = instance
      bindListeners(instance)
      readyCallbacks.splice(0, readyCallbacks.length).forEach(cb => cb(instance))
      applyInitialOptions(instance, opts)
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
    }
    finally {
      creating = false
    }
  }

  function applyInitialOptions(instance: AMap.Map, opts: UseMapOptions) {
    setCenter(opts.center)
    setZoom(opts.zoom)
    setPitch(opts.pitch)
    setRotation(opts.rotation)
    setMapStyle(opts.mapStyle)
    setTheme(opts.theme as string | undefined)
    setViewMode(opts.viewMode)
  }

  watch(() => optionsRef.value.center, value => setCenter(value), { deep: true })
  watch(() => optionsRef.value.zoom, value => setZoom(value))
  watch(() => optionsRef.value.pitch, value => setPitch(value))
  watch(() => optionsRef.value.rotation, value => setRotation(value))
  watch(() => optionsRef.value.mapStyle, value => setMapStyle(value))
  watch(() => optionsRef.value.theme as string | undefined, value => setTheme(value))
  watch(() => optionsRef.value.viewMode, value => setViewMode(value as AMap.MapViewMode | undefined))

  watch(containerRef, (value) => {
    if (value)
      ensureMap()
  }, { immediate: true })

  onMounted(() => {
    if (containerRef.value)
      ensureMap()
  })

  onBeforeUnmount(() => {
    destroy()
  })

  function ready(callback: ReadyCallback) {
    if (map.value)
      callback(map.value)
    else
      readyCallbacks.push(callback)
  }

  function setCenter(center: LngLatLike | undefined) {
    if (!center)
      return
    const instance = map.value
    if (!instance)
      return
    const AMap = loader.get()
    const value = AMap ? toLngLat(AMap, center) : center
    instance.setCenter(value as any)
  }

  function setZoom(zoom: number | undefined) {
    if (zoom == null)
      return
    const instance = map.value
    instance?.setZoom(zoom)
  }

  function setPitch(pitch: number | undefined) {
    if (pitch == null)
      return
    const instance = map.value
    if (instance && typeof instance.setPitch === 'function')
      instance.setPitch(pitch)
  }

  function setRotation(rotation: number | undefined) {
    if (rotation == null)
      return
    const instance = map.value
    if (instance && typeof instance.setRotation === 'function')
      instance.setRotation(rotation)
  }

  function setMapStyle(style: string | undefined) {
    if (!style)
      return
    const instance = map.value
    if (instance && typeof instance.setMapStyle === 'function')
      instance.setMapStyle(style)
  }

  function setTheme(theme: string | undefined) {
    if (!theme)
      return
    const instance = map.value as any
    if (instance?.setTheme)
      instance.setTheme(theme)
    else if (instance?.setMapStyle)
      instance.setMapStyle(theme)
  }

  function setViewMode(mode: AMap.MapViewMode | undefined) {
    if (!mode)
      return
    const instance = map.value as any
    if (instance?.setStatus)
      instance.setStatus({ viewMode: mode })
  }

  function on(event: string, handler: (event: any) => void) {
    const record = { event, handler }
    listeners.add(record)
    if (map.value)
      (map.value as any).on?.(event, handler)
  }

  function off(event: string, handler: (event: any) => void) {
    for (const listener of Array.from(listeners)) {
      if (listener.event === event && listener.handler === handler) {
        if (map.value)
          (map.value as any).off?.(event, handler)
        listeners.delete(listener)
      }
    }
  }

  function destroy() {
    const instance = map.value as any
    if (instance) {
      unbindListeners(instance)
      if (typeof instance.destroy === 'function')
        instance.destroy()
      else
        instance.setStatus?.({})
    }
    map.value = null
  }

  function setContainer(element: HTMLElement | null) {
    if (element)
      containerRef.value = element
  }

  return {
    map,
    ready,
    setCenter,
    setZoom,
    setPitch,
    setRotation,
    setMapStyle,
    setTheme,
    setViewMode,
    on,
    off,
    destroy,
    setContainer
  }
}
