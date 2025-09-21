import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseTileLayerOptions extends Partial<AMap.TileLayerOptions> {
  visible?: boolean
}

export interface UseTileLayerReturn<TLayer extends AMap.TileLayer = AMap.TileLayer> extends OverlayLifecycle<TLayer> {
  show: () => void
  hide: () => void
  reload: () => void
  setOpacity: (opacity: number | undefined) => void
  setZIndex: (zIndex: number | undefined) => void
  setTileUrl: (url: string | ((x: number, y: number, level: number) => string) | undefined) => void
  setOptions: (options: Partial<AMap.TileLayerOptions>) => void
}

function applyTileLayerOptions(layer: AMap.TileLayer, options: UseTileLayerOptions) {
  const { visible, map: _ignoredMap, opacity, zIndex, tileUrl, getTileUrl, ...rest } = options

  if (opacity != null)
    layer.setOpacity(opacity)
  if (zIndex != null)
    layer.setzIndex(zIndex)

  const nextTileUrl = (getTileUrl ?? tileUrl)
  if (nextTileUrl)
    layer.setTileUrl(nextTileUrl as any)

  if (visible != null) {
    if (visible)
      layer.show()
    else
      layer.hide()
  }

  if (Object.keys(rest).length)
    (layer as any).setOptions?.(rest)
}

function createTileLayerHook<TLayer extends AMap.TileLayer, TOptions extends UseTileLayerOptions>(
  factory: (context: { AMap: typeof AMap, options: TOptions }) => TLayer,
  plugin?: string,
) {
  return function useSpecificTileLayer(
    mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
    options: MaybeRefOrGetter<TOptions>,
  ): UseTileLayerReturn<TLayer> {
    const optionsRef = computed<TOptions>(() => ({
      ...(toValue(options) as TOptions | undefined ?? {}),
    }))

    const overlay = useOverlay(
      mapRef,
      optionsRef,
      ({ AMap, map, options: layerOptions }) => {
        const { visible: _ignoredVisible, map: _ignoredMap, ...rest } = layerOptions as TOptions & { map?: AMap.Map }
        const instance = factory({ AMap, options: rest as TOptions })
        instance.setMap(map)
        return instance
      },
      (layer, nextOptions) => {
        applyTileLayerOptions(layer, nextOptions)
      },
      plugin ? () => ({ plugins: [plugin] }) : undefined,
    )

    function show() {
      overlay.overlay.value?.show()
    }

    function hide() {
      overlay.overlay.value?.hide()
    }

    function reload() {
      overlay.overlay.value?.reload()
    }

    function setOpacity(opacity: number | undefined) {
      if (opacity == null)
        return
      overlay.overlay.value?.setOpacity(opacity)
    }

    function setZIndex(zIndex: number | undefined) {
      if (zIndex == null)
        return
      overlay.overlay.value?.setzIndex(zIndex)
    }

    function setTileUrl(url: string | ((x: number, y: number, level: number) => string) | undefined) {
      if (!url)
        return
      overlay.overlay.value?.setTileUrl(url as any)
    }

    function setOptions(options: Partial<AMap.TileLayerOptions>) {
      if (!options)
        return
      const instance = overlay.overlay.value
      instance && (instance as any).setOptions?.(options)
    }

    return {
      ...overlay,
      show,
      hide,
      reload,
      setOpacity,
      setZIndex,
      setTileUrl,
      setOptions,
    }
  }
}

export function useTileLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn {
  return createTileLayerHook(({ AMap, options: layerOptions }) => new AMap.TileLayer(layerOptions))(mapRef, options)
}

export interface UseTrafficLayerOptions extends UseTileLayerOptions, Partial<AMap.TileLayer.Traffic.Options> {}

export function useTrafficLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTrafficLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.Traffic> {
  return createTileLayerHook<AMap.TileLayer.Traffic, UseTrafficLayerOptions>(
    ({ AMap, options: layerOptions }) => new AMap.TileLayer.Traffic(layerOptions),
    'AMap.TileLayer.Traffic',
  )(mapRef, options)
}

export function useSatelliteLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.Satellite> {
  return createTileLayerHook<AMap.TileLayer.Satellite, UseTileLayerOptions>(
    ({ AMap, options: layerOptions }) => new AMap.TileLayer.Satellite(layerOptions),
    'AMap.TileLayer.Satellite',
  )(mapRef, options)
}

export function useRoadNetLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.RoadNet> {
  return createTileLayerHook<AMap.TileLayer.RoadNet, UseTileLayerOptions>(
    ({ AMap, options: layerOptions }) => new AMap.TileLayer.RoadNet(layerOptions),
    'AMap.TileLayer.RoadNet',
  )(mapRef, options)
}
