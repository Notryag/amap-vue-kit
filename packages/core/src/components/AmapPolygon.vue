<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'
import { useOverlay } from '@amap-vue/hooks'
import { amapMapInjectionKey, loader, toLngLat, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, watch } from 'vue'

defineOptions({
  name: 'AmapPolygon',
})

const props = defineProps({
  path: {
    type: [Array] as PropType<PolygonPath>,
    required: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.PolygonOptions>>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: true,
  },
  extData: null as any,
})

const emit = defineEmits<{
  ready: [polygon: AMap.Polygon]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

export type PolygonPath = LngLatLike[] | LngLatLike[][]

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapPolygon> must be used inside <AmapMap>.')

const overlayOptions = computed(() => ({
  path: props.path,
  visible: props.visible,
  extData: props.extData,
  ...props.options,
}))

function normalizePath(AMapInstance: typeof AMap | undefined, path: PolygonPath): any {
  if (!Array.isArray(path))
    return []

  const convertPoint = (point: LngLatLike) => AMapInstance ? toLngLat(AMapInstance, point) ?? point : point

  if (!path.length)
    return []

  const first = path[0] as any
  if (Array.isArray(first) && typeof first[0] !== 'number') {
    return (path as LngLatLike[][]).map(segment => segment.map(point => convertPoint(point)))
  }

  return (path as LngLatLike[]).map(point => convertPoint(point))
}

const overlayApi = context
  ? useOverlay(() => context.map.value, overlayOptions, ({ AMap, map, options }) => {
      const { path, visible, map: _ignoredMap, ...rest } = options as any
      const polygon = new AMap.Polygon({
        ...rest,
        path: normalizePath(AMap, path),
      })
      polygon.setMap(map)
      if (visible === false)
        polygon.hide()
      return polygon
    }, (polygon, options) => {
      const { path, visible, map: _ignored, ...rest } = options as any
      polygon.setOptions(rest)
      if (path) {
        const AMapInstance = loader.get()
        polygon.setPath(normalizePath(AMapInstance, path) as any)
      }
      if (visible == null)
        return
      if (visible)
        polygon.show()
      else
        polygon.hide()
    })
  : null

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (overlayApi) {
  watch(overlayApi.overlay, (value) => {
    if (value)
      emit('ready', value)
  })
}

eventBindings.forEach(({ event, handler }) => overlayApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => overlayApi?.off(event, handler))
  overlayApi?.destroy()
})

defineExpose({
  polygon: overlayApi?.overlay,
})
</script>

<template />
