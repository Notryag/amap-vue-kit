import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface UseMouseToolOptions {
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
export interface UseMouseToolReturn {
  tool: ShallowRef<AMap.MouseTool | null>
  drawCircle: (options?: Partial<AMap.CircleOptions>) => Promise<AMap.Circle | undefined>
  drawRectangle: (options?: Partial<AMap.RectangleOptions>) => Promise<AMap.Rectangle | undefined>
  drawPolygon: (options?: Partial<AMap.PolygonOptions>) => Promise<AMap.Polygon | undefined>
  drawPolyline: (options?: Partial<AMap.PolylineOptions>) => Promise<AMap.Polyline | undefined>
  drawBezierCurve: (options?: Partial<AMap.BezierCurveOptions>) => Promise<AMap.BezierCurve | undefined>
  drawEllipse: (options?: Partial<AMap.EllipseOptions>) => Promise<AMap.Ellipse | undefined>
  close: () => void
  destroy: () => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
}

interface ListenerRecord {
  event: string
  handler: (event: any) => void
}

export function useMouseTool(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseMouseToolOptions | undefined> = {},
): UseMouseToolReturn {
  const tool: ShallowRef<AMap.MouseTool | null> = shallowRef(null)
  const listeners = new Set<ListenerRecord>()
  const optionsRef = computed<UseMouseToolOptions>(() => ({
    ...(toValue(options) as UseMouseToolOptions | undefined ?? {}),
  }))

  let currentMap: AMap.Map | null = null
  let creating = false

  async function ensureTool() {
    if (!isClient || tool.value || !currentMap || creating)
      return
    creating = true
    try {
      const loaderOptions = optionsRef.value.loadOptions ? toValue(optionsRef.value.loadOptions) : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.MouseTool'] })
      if (!currentMap) {
        creating = false
        return
      }
      const instance = new (AMapInstance as any).MouseTool(currentMap)
      tool.value = instance
      bindListeners(instance)
    }
    finally {
      creating = false
    }
  }

  function bindListeners(instance: AMap.MouseTool) {
    listeners.forEach(({ event, handler }) => instance.on?.(event, handler))
  }

  function unbindListeners(instance: AMap.MouseTool | null) {
    if (!instance)
      return
    listeners.forEach(({ event, handler }) => instance.off?.(event, handler))
  }

  async function withTool<T>(callback: (instance: AMap.MouseTool) => T): Promise<T | undefined> {
    if (!tool.value && currentMap)
      await ensureTool()
    const instance = tool.value
    if (!instance)
      return undefined
    return callback(instance)
  }

  function close() {
    tool.value?.close?.()
  }

  function destroy() {
    const instance = tool.value
    if (instance) {
      unbindListeners(instance)
      instance.close?.()
    }
    tool.value = null
  }

  function on(event: string, handler: (event: any) => void) {
    const record = { event, handler }
    listeners.add(record)
    tool.value?.on?.(event, handler)
  }

  function off(event: string, handler: (event: any) => void) {
    for (const record of Array.from(listeners)) {
      if (record.event === event && record.handler === handler) {
        listeners.delete(record)
        tool.value?.off?.(event, handler)
      }
    }
  }

  async function drawCircle(options?: Partial<AMap.CircleOptions>) {
    return withTool(toolInstance => toolInstance.circle(options))
  }

  async function drawRectangle(options?: Partial<AMap.RectangleOptions>) {
    return withTool(toolInstance => toolInstance.rectangle(options))
  }

  async function drawPolygon(options?: Partial<AMap.PolygonOptions>) {
    return withTool(toolInstance => toolInstance.polygon(options))
  }

  async function drawPolyline(options?: Partial<AMap.PolylineOptions>) {
    return withTool(toolInstance => toolInstance.polyline(options))
  }

  async function drawBezierCurve(options?: Partial<AMap.BezierCurveOptions>) {
    return withTool(toolInstance => toolInstance.bezierCurve(options))
  }

  async function drawEllipse(options?: Partial<AMap.EllipseOptions>) {
    return withTool(toolInstance => toolInstance.ellipse(options))
  }

  watch(() => toValue(mapRef), (mapInstance) => {
    if (mapInstance === currentMap)
      return
    currentMap = mapInstance ?? null
    if (!currentMap) {
      destroy()
      return
    }
    void ensureTool()
  }, { immediate: true })

  onBeforeUnmount(() => {
    destroy()
  })

  return {
    tool,
    drawCircle,
    drawRectangle,
    drawPolygon,
    drawPolyline,
    drawBezierCurve,
    drawEllipse,
    close,
    destroy,
    on,
    off,
  }
}
