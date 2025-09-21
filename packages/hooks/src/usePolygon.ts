import type { LngLatLike, PolygonPath } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toLngLat } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UsePolygonOptions extends Partial<AMap.PolygonOptions> {
  path?: PolygonPath
  visible?: boolean
}

export interface UsePolygonReturn extends OverlayLifecycle<AMap.Polygon> {
  setPath: (path: PolygonPath | undefined) => void
  setOptions: (options: Partial<AMap.PolygonOptions>) => void
  setExtData: (extData: any) => void
  show: () => void
  hide: () => void
}

function normalizePolygonPath(AMapInstance: typeof AMap | undefined, path: PolygonPath | undefined) {
  if (!Array.isArray(path))
    return []
  if (!path.length)
    return []

  const convertPoint = (point: LngLatLike) => (AMapInstance ? toLngLat(AMapInstance, point) ?? point : point)
  const first = path[0] as any

  if (Array.isArray(first) && typeof first[0] !== 'number')
    return (path as LngLatLike[][]).map(segment => segment.map(point => convertPoint(point)))

  return (path as LngLatLike[]).map(point => convertPoint(point))
}

export function usePolygon(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UsePolygonOptions>,
): UsePolygonReturn {
  const optionsRef = computed<UsePolygonOptions>(() => ({
    ...(toValue(options) as UsePolygonOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(mapRef, optionsRef, ({ AMap, map, options: polygonOptions }) => {
    const { path, visible, map: _ignored, ...rest } = polygonOptions as UsePolygonOptions & { map?: AMap.Map }
    const polygon = new AMap.Polygon({
      ...rest,
      path: normalizePolygonPath(AMap, path),
    })
    polygon.setMap(map)
    if (visible === false)
      polygon.hide()
    return polygon
  }, (polygon, nextOptions) => {
    const { path, visible, map: _ignored, ...rest } = nextOptions as UsePolygonOptions & { map?: AMap.Map }
    if (Object.keys(rest).length)
      polygon.setOptions(rest)
    if (path !== undefined)
      setPathInternal(polygon, path)
    if (visible != null)
      visible ? polygon.show() : polygon.hide()
  })

  function setPathInternal(polygon: AMap.Polygon, path: PolygonPath | undefined) {
    if (!Array.isArray(path))
      return
    const AMapInstance = loader.get()
    const resolved = normalizePolygonPath(AMapInstance, path)
    polygon.setPath(resolved as any)
  }

  function setPath(path: PolygonPath | undefined) {
    const instance = overlay.overlay.value
    if (!instance)
      return
    setPathInternal(instance, path)
  }

  function setOptions(options: Partial<AMap.PolygonOptions>) {
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
