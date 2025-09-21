<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'
import { useOverlay } from '@amap-vue/hooks'
import { amapMapInjectionKey, loader, toLngLat, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, watch } from 'vue'

defineOptions({
  name: 'AmapPolyline',
})

const props = defineProps({
  path: {
    type: Array as PropType<LngLatLike[]>,
    required: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.PolylineOptions>>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: true,
  },
  extData: null as any,
})

const emit = defineEmits<{
  ready: [polyline: AMap.Polyline]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

export interface PolylineProps {
  path: LngLatLike[]
  options?: Partial<AMap.PolylineOptions>
  visible?: boolean
  extData?: any
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapPolyline> must be used inside <AmapMap>.')

const overlayOptions = computed(() => ({
  path: props.path,
  visible: props.visible,
  extData: props.extData,
  ...props.options,
}))

const overlayApi = context
  ? useOverlay(() => context.map.value, overlayOptions, ({ AMap, map, options }) => {
      const { path, visible, map: _ignoredMap, ...rest } = options as any
      const polyline = new AMap.Polyline({
        ...rest,
        path: (path ?? []).map(item => toLngLat(AMap, item) ?? item),
      })
      polyline.setMap(map)
      if (visible === false)
        polyline.hide()
      return polyline
    }, (polyline, options) => {
      const { path, visible, map: _ignored, ...rest } = options as any
      polyline.setOptions(rest)
      if (path) {
        const AMapInstance = loader.get()
        const resolvedPath = path.map((item: LngLatLike) => AMapInstance ? toLngLat(AMapInstance, item) ?? item : item)
        polyline.setPath(resolvedPath as any)
      }
      if (visible == null)
        return
      if (visible)
        polyline.show()
      else
        polyline.hide()
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
  polyline: overlayApi?.overlay,
})
</script>

<template />
