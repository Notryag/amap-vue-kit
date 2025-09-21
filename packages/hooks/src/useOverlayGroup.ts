import type { MaybeRefOrGetter } from 'vue'
import type { OverlayLifecycle } from './useOverlay'

import { computed, toValue } from 'vue'
import { useOverlay } from './useOverlay'

export interface UseOverlayGroupOptions extends Record<string, any> {
  overlays?: any[]
  visible?: boolean
  extData?: any
}

export interface UseOverlayGroupReturn extends OverlayLifecycle<AMap.OverlayGroup> {
  show: () => void
  hide: () => void
  addOverlay: (overlay: any) => void
  addOverlays: (overlays: any[]) => void
  removeOverlay: (overlay: any) => void
  removeOverlays: (overlays: any[]) => void
  clearOverlays: () => void
  getOverlays: () => any[]
  setExtData: (extData: any) => void
}

function applyOverlayGroupOptions(group: AMap.OverlayGroup, options: UseOverlayGroupOptions) {
  const { visible, overlays, extData } = options

  if (visible != null) {
    if (visible)
      (group as any).show?.()
    else
      (group as any).hide?.()
  }

  if (Array.isArray(overlays)) {
    (group as any).clearOverlays?.()
    if (overlays.length)
      (group as any).addOverlays?.(overlays)
  }

  if (extData !== undefined && typeof (group as any).setExtData === 'function')
    (group as any).setExtData(extData)
}

export function useOverlayGroup(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseOverlayGroupOptions>,
): UseOverlayGroupReturn {
  const optionsRef = computed<UseOverlayGroupOptions>(() => ({
    ...(toValue(options) as UseOverlayGroupOptions | undefined ?? {}),
  }))

  const overlay = useOverlay(
    mapRef,
    optionsRef,
    ({ AMap, map, options: groupOptions }) => {
      const { overlays, visible: _ignoredVisible, extData, ...rest } = groupOptions
      const initialOverlays = Array.isArray(overlays) ? overlays : []
      const instance = new (AMap as any).OverlayGroup(initialOverlays)
      instance.setMap(map)
      if (extData !== undefined && typeof (instance as any).setExtData === 'function')
        (instance as any).setExtData(extData)
      if (rest && typeof (instance as any).setOptions === 'function')
        (instance as any).setOptions(rest)
      return instance
    },
    (group, nextOptions) => {
      applyOverlayGroupOptions(group, nextOptions)
    },
  )

  function show() {
    overlay.overlay.value?.show?.()
  }

  function hide() {
    overlay.overlay.value?.hide?.()
  }

  function addOverlay(overlayInstance: any) {
    if (!overlayInstance)
      return
    overlay.overlay.value?.addOverlay?.(overlayInstance)
  }

  function addOverlays(overlays: any[]) {
    if (!Array.isArray(overlays) || !overlays.length)
      return
    overlay.overlay.value?.addOverlays?.(overlays)
  }

  function removeOverlay(overlayInstance: any) {
    if (!overlayInstance)
      return
    overlay.overlay.value?.removeOverlay?.(overlayInstance)
  }

  function removeOverlays(overlays: any[]) {
    if (!Array.isArray(overlays) || !overlays.length)
      return
    overlay.overlay.value?.removeOverlays?.(overlays)
  }

  function clearOverlays() {
    overlay.overlay.value?.clearOverlays?.()
  }

  function getOverlays() {
    const instance = overlay.overlay.value
    if (!instance || typeof (instance as any).getOverlays !== 'function')
      return []
    return (instance as any).getOverlays() ?? []
  }

  function setExtData(extData: any) {
    overlay.overlay.value?.setExtData?.(extData)
  }

  return {
    ...overlay,
    show,
    hide,
    addOverlay,
    addOverlays,
    removeOverlay,
    removeOverlays,
    clearOverlays,
    getOverlays,
    setExtData,
  }
}
