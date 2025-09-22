import type { BezierCurvePath } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toLngLat } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseBezierCurveOptions extends Partial<AMap.BezierCurveOptions> {
  path?: BezierCurvePath
  visible?: boolean
}

export interface UseBezierCurveReturn extends OverlayLifecycle<AMap.BezierCurve> {
  setPath: (path: BezierCurvePath | undefined) => void
  setOptions: (options: Partial<AMap.BezierCurveOptions>) => void
  setExtData: (extData: any) => void
  show: () => void
  hide: () => void
}

function normalizePath(AMapInstance: typeof AMap | undefined, path: BezierCurvePath | undefined) {
  if (!path || !AMapInstance)
    return path as any
  return path.map(segment => segment.map(point => toLngLat(AMapInstance, point) ?? point))
}

export function useBezierCurve(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseBezierCurveOptions>,
): UseBezierCurveReturn {
  const optionsRef = computed<UseBezierCurveOptions>(() => ({
    ...(toValue(options) as UseBezierCurveOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(mapRef, optionsRef, ({ AMap, map, options: curveOptions }) => {
    const { path, visible, ...rest } = curveOptions as UseBezierCurveOptions & { map?: AMap.Map }
    const curve = new (AMap as any).BezierCurve({
      ...rest,
      path: normalizePath(AMap, path) ?? rest.path,
    }) as AMap.BezierCurve
    curve.setMap(map)
    if (visible === false)
      curve.hide()
    return curve
  }, (curve, nextOptions) => {
    const { path, visible, map: _ignored, ...rest } = nextOptions as UseBezierCurveOptions & { map?: AMap.Map }
    if (Object.keys(rest).length)
      curve.setOptions(rest)
    if (path)
      setPathInternal(curve, path)
    if (visible != null)
      visible ? curve.show() : curve.hide()
  }, () => ({ plugins: ['AMap.BezierCurve'] }))

  function setPathInternal(curve: AMap.BezierCurve, path: BezierCurvePath | undefined) {
    if (!path)
      return
    const AMapInstance = loader.get()
    if (!AMapInstance)
      return
    const normalized = normalizePath(AMapInstance, path)
    curve.setPath(normalized as any)
  }

  function setPath(path: BezierCurvePath | undefined) {
    if (!path) {
      overlay.overlay.value?.setPath(path as any)
      return
    }
    const instance = overlay.overlay.value
    if (!instance)
      return
    setPathInternal(instance, path)
  }

  function setOptions(options: Partial<AMap.BezierCurveOptions>) {
    overlay.overlay.value?.setOptions(options)
  }

  function setExtData(extData: any) {
    const instance = overlay.overlay.value as any
    if (!instance)
      return
    if (typeof instance.setExtData === 'function')
      instance.setExtData(extData)
    else
      instance.setOptions?.({ extData })
  }

  function show() {
    overlay.overlay.value?.show()
  }

  function hide() {
    overlay.overlay.value?.hide()
  }

  return {
    ...overlay,
    setPath,
    setOptions,
    setExtData,
    show,
    hide,
  }
}
