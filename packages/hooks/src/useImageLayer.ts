import type { BoundsLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { loader, toBounds } from '@amap-vue/shared'
import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseImageLayerOptions extends Partial<AMap.ImageLayerOptions> {
  url?: string
  bounds?: BoundsLike
  visible?: boolean
  opacity?: number
  zIndex?: number
}

export interface UseImageLayerReturn extends OverlayLifecycle<AMap.ImageLayer> {
  show: () => void
  hide: () => void
  setImageUrl: (url: string | undefined) => void
  setBounds: (bounds: BoundsLike | undefined) => void
  setOpacity: (opacity: number | undefined) => void
  setZIndex: (zIndex: number | undefined) => void
  setOptions: (options: Partial<AMap.ImageLayerOptions>) => void
}

function resolveBounds(bounds: BoundsLike | undefined) {
  if (!bounds)
    return undefined

  const AMapInstance = loader.get()
  if (!AMapInstance)
    return bounds

  return toBounds(AMapInstance, bounds) ?? bounds
}

function applyImageLayerOptions(layer: AMap.ImageLayer, options: UseImageLayerOptions) {
  const { visible, map: _ignoredMap, url, bounds, opacity, zIndex, ...rest } = options

  if (url != null)
    (layer as any).setImageUrl?.(url)

  if (bounds) {
    const resolved = resolveBounds(bounds)
    if (resolved)
      (layer as any).setBounds?.(resolved as any)
  }

  if (opacity != null)
    (layer as any).setOpacity?.(opacity)

  if (zIndex != null)
    (layer as any).setzIndex?.(zIndex)

  if (visible != null) {
    if (visible)
      (layer as any).show?.()
    else
      (layer as any).hide?.()
  }

  if (Object.keys(rest).length && typeof (layer as any).setOptions === 'function')
    (layer as any).setOptions(rest)
}

export function useImageLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseImageLayerOptions>,
): UseImageLayerReturn {
  const optionsRef = computed<UseImageLayerOptions>(() => ({
    ...(toValue(options) as UseImageLayerOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(
    mapRef,
    optionsRef,
    ({ AMap, map, options: layerOptions }) => {
      const { visible: _ignoredVisible, map: _ignoredMap, ...rest } = layerOptions as UseImageLayerOptions & { map?: AMap.Map }
      const { bounds, ...others } = rest
      const resolvedBounds = bounds ? toBounds(AMap, bounds) ?? bounds : bounds
      const instance = new (AMap as any).ImageLayer({
        ...others,
        bounds: resolvedBounds,
      })
      instance.setMap(map)
      return instance
    },
    (layer, nextOptions) => {
      applyImageLayerOptions(layer, nextOptions)
    },
    () => ({ plugins: ['AMap.ImageLayer'] }),
  )

  function show() {
    overlay.overlay.value?.show?.()
  }

  function hide() {
    overlay.overlay.value?.hide?.()
  }

  function setImageUrl(url: string | undefined) {
    if (url == null)
      return
    overlay.overlay.value?.setImageUrl?.(url)
  }

  function setBounds(bounds: BoundsLike | undefined) {
    if (!bounds)
      return
    const resolved = resolveBounds(bounds)
    if (!resolved)
      return
    overlay.overlay.value?.setBounds?.(resolved as any)
  }

  function setOpacity(opacity: number | undefined) {
    if (opacity == null)
      return
    overlay.overlay.value?.setOpacity?.(opacity)
  }

  function setZIndex(zIndex: number | undefined) {
    if (zIndex == null)
      return
    overlay.overlay.value?.setzIndex?.(zIndex)
  }

  function setOptions(options: Partial<AMap.ImageLayerOptions>) {
    if (!options)
      return
    const instance = overlay.overlay.value
    if (!instance)
      return
    (instance as any).setOptions?.(options)
  }

  return {
    ...overlay,
    show,
    hide,
    setImageUrl,
    setBounds,
    setOpacity,
    setZIndex,
    setOptions,
  }
}
