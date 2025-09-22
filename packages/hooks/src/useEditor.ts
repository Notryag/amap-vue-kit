import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface EditorLike<TOverlay = any> {
  open: () => void
  close: () => void
  setTarget?: (target: TOverlay | null) => void
  getTarget?: () => TOverlay | null
  on?: (event: string, handler: (event: any) => void) => void
  off?: (event: string, handler: (event: any) => void) => void
  destroy?: () => void
  setOptions?: (options: Record<string, any>) => void
}

export type UseEditorOptions<
  TOverlay,
  TEditorOptions extends Record<string, any> = Record<string, any>,
> = Partial<TEditorOptions> & {
  target?: TOverlay | string | null
  active?: boolean
}

export interface UseEditorReturn<TEditor extends EditorLike<TOverlay>, TOverlay> {
  editor: ShallowRef<TEditor | null>
  open: () => void
  close: () => void
  setTarget: (target: TOverlay | string | null | undefined) => void
  getTarget: () => TOverlay | null
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
  destroy: () => void
}

interface ListenerRecord {
  event: string
  handler: (event: any) => void
}

type ExtractEditorOptions<TEditorOptions extends Record<string, any>> = Partial<TEditorOptions>

function createEditorHook<
  TOverlay,
  TEditor extends EditorLike<TOverlay>,
  TEditorOptions extends Record<string, any> = Record<string, any>,
>(
  plugin: string,
  factory: (context: { AMap: typeof AMap, map: AMap.Map, target: TOverlay, options: TEditorOptions }) => TEditor,
) {
  return function useSpecificEditor(
    mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
    options: MaybeRefOrGetter<UseEditorOptions<TOverlay, TEditorOptions>>,
  ): UseEditorReturn<TEditor, TOverlay> {
    const editor = shallowRef<TEditor | null>(null)
    const listeners = new Set<ListenerRecord>()
    const optionsRef = computed<UseEditorOptions<TOverlay, TEditorOptions>>(() => ({
      ...(toValue(options) as UseEditorOptions<TOverlay, TEditorOptions> | undefined ?? {}),
    }))

    let currentMap: AMap.Map | null = null
    let currentTarget: TOverlay | null = null
    let desiredActive = false
    let pendingOptions: ExtractEditorOptions<TEditorOptions> = {}
    let rawTarget: TOverlay | string | null | undefined
    let creating = false
    let targetPollTimer: ReturnType<typeof setInterval> | null = null

    function extractOptions(value: UseEditorOptions<TOverlay, TEditorOptions>) {
      const { target: _ignoredTarget, active: _ignoredActive, ...rest } = value as UseEditorOptions<TOverlay, TEditorOptions> & { map?: AMap.Map }
      return rest as ExtractEditorOptions<TEditorOptions>
    }

    function bindListeners(instance: TEditor | null) {
      if (!instance)
        return
      listeners.forEach(({ event, handler }) => instance.on?.(event, handler))
    }

    function unbindListeners(instance: TEditor | null) {
      if (!instance)
        return
      listeners.forEach(({ event, handler }) => instance.off?.(event, handler))
    }

    function stopTargetPolling() {
      if (targetPollTimer != null) {
        clearInterval(targetPollTimer)
        targetPollTimer = null
      }
    }

    function resolveTarget(
      map: AMap.Map | null,
      targetValue: TOverlay | string | null | undefined,
    ): TOverlay | null {
      if (!targetValue)
        return null
      if (typeof targetValue !== 'string')
        return targetValue as TOverlay
      if (!map)
        return null
      const overlays: any[] = (map as any).getAllOverlays?.() ?? []
      for (const overlay of overlays) {
        const id = typeof overlay.getId === 'function' ? overlay.getId() : undefined
        if (id === targetValue)
          return overlay as TOverlay
        const extData = typeof overlay.getExtData === 'function' ? overlay.getExtData() : undefined
        if (extData && typeof extData === 'object' && (extData as any).id === targetValue)
          return overlay as TOverlay
        if (overlay.id === targetValue)
          return overlay as TOverlay
      }
      return null
    }

    async function ensureEditor(target: TOverlay) {
      if (!isClient || editor.value || !currentMap || !target || creating)
        return
      creating = true
      try {
        const AMapInstance = await loader.load({ plugins: [plugin] })
        if (!currentMap || currentTarget !== target) {
          creating = false
          return
        }
        const optionsValue = optionsRef.value
        const { target: _ignoredTarget, active: _ignoredActive, ...rest } = optionsValue as UseEditorOptions<TOverlay, TEditorOptions>
        const instance = factory({
          AMap: AMapInstance,
          map: currentMap,
          target,
          options: rest as TEditorOptions,
        })
        editor.value = instance
        bindListeners(instance)
        applyEditorOptions()
        applyActiveState()
      }
      catch (error) {
        warn(error instanceof Error ? error.message : String(error))
      }
      finally {
        creating = false
      }
    }

    function applyEditorOptions() {
      const instance = editor.value
      if (!instance || !pendingOptions)
        return
      const keys = Object.keys(pendingOptions as Record<string, any>)
      if (!keys.length)
        return
      instance.setOptions?.(pendingOptions as Record<string, any>)
    }

    function applyActiveState() {
      const instance = editor.value
      if (!instance)
        return
      if (desiredActive)
        instance.open()
      else
        instance.close?.()
    }

    async function syncEditor() {
      if (!currentMap)
        return
      const resolvedTarget = resolveTarget(currentMap, rawTarget)
      currentTarget = resolvedTarget
      if (!resolvedTarget && typeof rawTarget === 'string')
        startTargetPolling()
      else
        stopTargetPolling()

      const instance = editor.value
      if (instance) {
        if (resolvedTarget)
          instance.setTarget?.(resolvedTarget)
        else
          instance.setTarget?.(null as any)
      }

      if (!instance && resolvedTarget)
        await ensureEditor(resolvedTarget)

      applyActiveState()
    }

    function startTargetPolling() {
      if (!isClient || targetPollTimer != null || typeof rawTarget !== 'string' || !currentMap)
        return
      targetPollTimer = setInterval(() => {
        if (!currentMap || typeof rawTarget !== 'string') {
          stopTargetPolling()
          return
        }
        const resolved = resolveTarget(currentMap, rawTarget)
        if (!resolved)
          return
        currentTarget = resolved
        stopTargetPolling()
        const instance = editor.value
        if (instance)
          instance.setTarget?.(resolved)
        else
          void ensureEditor(resolved)
        applyActiveState()
      }, 500)
    }

    function on(event: string, handler: (event: any) => void) {
      const record = { event, handler }
      listeners.add(record)
      const instance = editor.value
      instance?.on?.(event, handler)
    }

    function off(event: string, handler: (event: any) => void) {
      for (const record of Array.from(listeners)) {
        if (record.event === event && record.handler === handler) {
          listeners.delete(record)
          editor.value?.off?.(event, handler)
        }
      }
    }

    function destroy() {
      stopTargetPolling()
      const instance = editor.value
      if (instance) {
        unbindListeners(instance)
        instance.close?.()
        instance.destroy?.()
      }
      editor.value = null
      currentTarget = null
    }

    function open() {
      desiredActive = true
      applyActiveState()
    }

    function close() {
      desiredActive = false
      applyActiveState()
    }

    function setTarget(target: TOverlay | string | null | undefined) {
      rawTarget = target
      void syncEditor()
    }

    function getTarget(): TOverlay | null {
      const instance = editor.value
      if (instance?.getTarget)
        return instance.getTarget() ?? null
      return currentTarget
    }

    watch(() => toValue(mapRef), (mapInstance) => {
      if (currentMap === mapInstance)
        return
      currentMap = mapInstance ?? null
      destroy()
      if (currentMap)
        void syncEditor()
    }, { immediate: true })

    watch(() => optionsRef.value.active, (value) => {
      desiredActive = !!value
      applyActiveState()
    }, { immediate: true })

    watch(() => optionsRef.value.target, (value) => {
      rawTarget = value
      void syncEditor()
    }, { immediate: true })

    watch(() => extractOptions(optionsRef.value), (value) => {
      pendingOptions = { ...value }
      applyEditorOptions()
    }, { deep: true, immediate: true })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      editor,
      open,
      close,
      setTarget,
      getTarget,
      on,
      off,
      destroy,
    }
  }
}

export type UseEditorCircleOptions = UseEditorOptions<AMap.Circle, AMap.CircleEditorOptions>

export function useEditorCircle(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseEditorCircleOptions>,
): UseEditorReturn<AMap.CircleEditor, AMap.Circle> {
  return createEditorHook<AMap.Circle, AMap.CircleEditor, AMap.CircleEditorOptions>(
    'AMap.CircleEditor',
    ({ AMap, map, target, options: editorOptions }) => new (AMap as any).CircleEditor(map, target, editorOptions),
  )(mapRef, options)
}

export type UseEditorRectangleOptions = UseEditorOptions<AMap.Rectangle, AMap.RectangleEditorOptions>

export function useEditorRectangle(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseEditorRectangleOptions>,
): UseEditorReturn<AMap.RectangleEditor, AMap.Rectangle> {
  return createEditorHook<AMap.Rectangle, AMap.RectangleEditor, AMap.RectangleEditorOptions>(
    'AMap.RectangleEditor',
    ({ AMap, map, target, options: editorOptions }) => new (AMap as any).RectangleEditor(map, target, editorOptions),
  )(mapRef, options)
}

export type UseEditorEllipseOptions = UseEditorOptions<AMap.Ellipse, AMap.EllipseEditorOptions>

export function useEditorEllipse(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseEditorEllipseOptions>,
): UseEditorReturn<AMap.EllipseEditor, AMap.Ellipse> {
  return createEditorHook<AMap.Ellipse, AMap.EllipseEditor, AMap.EllipseEditorOptions>(
    'AMap.EllipseEditor',
    ({ AMap, map, target, options: editorOptions }) => new (AMap as any).EllipseEditor(map, target, editorOptions),
  )(mapRef, options)
}

export type UseEditorPolylineOptions = UseEditorOptions<AMap.Polyline, AMap.PolylineEditorOptions>

export function useEditorPolyline(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseEditorPolylineOptions>,
): UseEditorReturn<AMap.PolylineEditor, AMap.Polyline> {
  return createEditorHook<AMap.Polyline, AMap.PolylineEditor, AMap.PolylineEditorOptions>(
    'AMap.PolylineEditor',
    ({ AMap, map, target, options: editorOptions }) => new (AMap as any).PolylineEditor(map, target, editorOptions),
  )(mapRef, options)
}

export type UseEditorBezierCurveOptions = UseEditorOptions<AMap.BezierCurve, AMap.BezierCurveEditorOptions>

export function useEditorBezierCurve(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseEditorBezierCurveOptions>,
): UseEditorReturn<AMap.BezierCurveEditor, AMap.BezierCurve> {
  return createEditorHook<AMap.BezierCurve, AMap.BezierCurveEditor, AMap.BezierCurveEditorOptions>(
    'AMap.BezierCurveEditor',
    ({ AMap, map, target, options: editorOptions }) => new (AMap as any).BezierCurveEditor(map, target, editorOptions),
  )(mapRef, options)
}

export type UseEditorPolygonOptions = UseEditorOptions<AMap.Polygon, AMap.PolygonEditorOptions>

export function useEditorPolygon(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseEditorPolygonOptions>,
): UseEditorReturn<AMap.PolygonEditor, AMap.Polygon> {
  return createEditorHook<AMap.Polygon, AMap.PolygonEditor, AMap.PolygonEditorOptions>(
    'AMap.PolygonEditor',
    ({ AMap, map, target, options: editorOptions }) => new (AMap as any).PolygonEditor(map, target, editorOptions),
  )(mapRef, options)
}
