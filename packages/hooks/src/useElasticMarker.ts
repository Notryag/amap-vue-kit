import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toLngLat } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseElasticMarkerOptions extends Partial<AMap.ElasticMarkerOptions> {
  position?: LngLatLike
  visible?: boolean
}

export interface UseElasticMarkerReturn extends OverlayLifecycle<AMap.ElasticMarker> {
  setPosition: (position: LngLatLike | undefined) => void
  setStyles: (styles: AMap.ElasticMarkerStyles | undefined) => void
  setZoomStyleMapping: (mapping: Record<number, number> | undefined) => void
  setExtData: (extData: any) => void
  setOptions: (options: Partial<AMap.ElasticMarkerOptions>) => void
  show: () => void
  hide: () => void
}

export function useElasticMarker(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseElasticMarkerOptions>,
): UseElasticMarkerReturn {
  const optionsRef = computed<UseElasticMarkerOptions>(() => ({
    ...(toValue(options) as UseElasticMarkerOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(
    mapRef,
    optionsRef,
    ({ AMap, map, options: elasticOptions }) => {
      const { position, visible, ...rest } = elasticOptions as UseElasticMarkerOptions & { map?: AMap.Map }
      const marker = new (AMap as any).ElasticMarker({
        ...rest,
        map,
        position: position ? toLngLat(AMap, position) ?? position : rest.position,
      }) as AMap.ElasticMarker
      if (visible === false)
        marker.hide()
      return marker
    },
    (marker, nextOptions) => {
      const { position, visible, map: _ignored, styles, zoomStyleMapping, ...rest } = nextOptions as UseElasticMarkerOptions & { map?: AMap.Map }
      if (Object.keys(rest).length)
        marker.setOptions?.(rest)
      if (position !== undefined)
        setPositionInternal(marker, position)
      if (styles !== undefined)
        marker.setStyles?.(styles as any)
      if (zoomStyleMapping !== undefined)
        marker.setZoomStyleMapping?.(zoomStyleMapping)
      if (visible != null)
        visible ? marker.show() : marker.hide()
    },
    () => ({ plugins: ['AMap.ElasticMarker'] }),
  )

  function setPositionInternal(marker: AMap.ElasticMarker, position: LngLatLike | undefined) {
    if (!position)
      return
    const AMapInstance = loader.get()
    const resolved = AMapInstance ? toLngLat(AMapInstance, position) ?? position : position
    marker.setPosition(resolved as any)
  }

  function setPosition(position: LngLatLike | undefined) {
    const instance = overlay.overlay.value
    if (!instance)
      return
    if (!position) {
      instance.setPosition(position as any)
      return
    }
    setPositionInternal(instance, position)
  }

  function setStyles(styles: AMap.ElasticMarkerStyles | undefined) {
    if (!styles)
      return
    overlay.overlay.value?.setStyles(styles as any)
  }

  function setZoomStyleMapping(mapping: Record<number, number> | undefined) {
    if (!mapping)
      return
    overlay.overlay.value?.setZoomStyleMapping(mapping)
  }

  function setExtData(extData: any) {
    overlay.overlay.value?.setExtData?.(extData)
  }

  function setOptions(options: Partial<AMap.ElasticMarkerOptions>) {
    overlay.overlay.value?.setOptions?.(options)
  }

  function show() {
    overlay.overlay.value?.show()
  }

  function hide() {
    overlay.overlay.value?.hide()
  }

  return {
    ...overlay,
    setPosition,
    setStyles,
    setZoomStyleMapping,
    setExtData,
    setOptions,
    show,
    hide,
  }
}
