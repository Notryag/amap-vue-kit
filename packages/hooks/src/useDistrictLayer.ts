import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export type DistrictLayerType = 'World' | 'Country' | 'Province' | 'City' | 'District'

export interface UseDistrictLayerOptions extends Partial<AMap.DistrictLayerOptions> {
  type?: DistrictLayerType
  adcode?: string | number | Array<string | number>
  visible?: boolean
}

export interface UseDistrictLayerReturn extends OverlayLifecycle<AMap.DistrictLayer> {
  show: () => void
  hide: () => void
  setDistricts: (adcode: string | number | Array<string | number> | undefined) => void
  setStyles: (styles: AMap.DistrictLayerOptions['styles']) => void
  setOptions: (options: Partial<AMap.DistrictLayerOptions>) => void
}

function hasOwn(target: object, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(target, key)
}

function resolveLayerCtor(AMapInstance: typeof AMap, type: DistrictLayerType | undefined) {
  const district = (AMapInstance as any).DistrictLayer
  if (!district)
    throw new Error('AMap.DistrictLayer plugin is not available. Ensure it is added to loader plugins.')
  if (type && district[type])
    return district[type]
  return district.Country ?? district.World ?? district
}

function applyDistrictLayerOptions(instance: AMap.DistrictLayer, options: UseDistrictLayerOptions) {
  const { visible, adcode, styles, zooms, zIndex, depth, type: _type, ...rest } = options
  if (rest && Object.keys(rest).length)
    (instance as any).setOptions?.(rest)
  if (styles && hasOwn(options, 'styles'))
    (instance as any).setStyles?.(styles)
  if (zooms && hasOwn(options, 'zooms'))
    (instance as any).setZooms?.(zooms)
  if (typeof zIndex === 'number' || hasOwn(options, 'zIndex'))
    (instance as any).setzIndex?.(zIndex)
  if (depth != null && hasOwn(options, 'depth'))
    (instance as any).setOptions?.({ depth })
  if (adcode != null && hasOwn(options, 'adcode'))
    (instance as any).setDistricts?.(adcode)
  if (visible != null) {
    if (visible)
      (instance as any).show?.()
    else
      (instance as any).hide?.()
  }
}

export function useDistrictLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseDistrictLayerOptions>,
): UseDistrictLayerReturn {
  const optionsRef = computed<UseDistrictLayerOptions>(() => ({
    ...(toValue(options) as UseDistrictLayerOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(
    mapRef,
    optionsRef,
    ({ AMap, map, options: layerOptions }) => {
      const { type, adcode, visible, ...rest } = layerOptions
      const LayerCtor = resolveLayerCtor(AMap, type)
      const instance = new LayerCtor(rest)
      instance.setMap(map)
      if (adcode != null)
        (instance as any).setDistricts?.(adcode)
      if (visible === false)
        (instance as any).hide?.()
      return instance as AMap.DistrictLayer
    },
    (instance, nextOptions) => {
      applyDistrictLayerOptions(instance, nextOptions)
    },
    () => ({ plugins: ['AMap.DistrictLayer'] }),
  )

  function show() {
    overlay.overlay.value?.show?.()
  }

  function hide() {
    overlay.overlay.value?.hide?.()
  }

  function setDistricts(adcode: string | number | Array<string | number> | undefined) {
    if (adcode == null) {
      return
    }
    ;(overlay.overlay.value as any)?.setDistricts?.(adcode)
  }

  function setStyles(styles: AMap.DistrictLayerOptions['styles']) {
    if (styles == null) {
      return
    }
    ;(overlay.overlay.value as any)?.setStyles?.(styles)
  }

  function setOptions(options: Partial<AMap.DistrictLayerOptions>) {
    if (!options) {
      return
    }
    overlay.overlay.value?.setOptions?.(options)
  }

  return {
    ...overlay,
    show,
    hide,
    setDistricts,
    setStyles,
    setOptions,
  }
}
