<template />

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue'
import type { PropType } from 'vue'
import { useOverlay } from '@amap-vue/hooks'
import { amapMapInjectionKey, type LngLatLike, type MapInjectionContext, loader, toLngLat, warn } from '@amap-vue/shared'

defineOptions({
  name: 'AmapCircle'
})

const props = defineProps({
  center: {
    type: [Array, Object] as PropType<LngLatLike>,
    required: true
  },
  radius: {
    type: Number,
    required: true
  },
  options: {
    type: Object as PropType<Partial<AMap.CircleOptions>>,
    default: () => ({})
  },
  visible: {
    type: Boolean,
    default: true
  },
  extData: null as any
})

const emit = defineEmits<{
  ready: [circle: AMap.Circle]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapCircle> must be used inside <AmapMap>.')

const overlayOptions = computed(() => ({
  center: props.center,
  radius: props.radius,
  visible: props.visible,
  extData: props.extData,
  ...props.options
}))

const overlayApi = context
  ? useOverlay(() => context.map.value, overlayOptions, ({ AMap, map, options }) => {
      const { center, radius, visible, map: _ignoredMap, ...rest } = options as any
      const circle = new AMap.Circle({
        ...rest,
        center: center ? toLngLat(AMap, center) ?? center : undefined,
        radius
      })
      circle.setMap(map)
      if (visible === false)
        circle.hide()
      return circle
    }, (circle, options) => {
      const { center, radius, visible, map: _ignored, ...rest } = options as any
      circle.setOptions(rest)
      if (center) {
        const AMapInstance = loader.get()
        circle.setCenter((AMapInstance ? toLngLat(AMapInstance, center) ?? center : center) as any)
      }
      if (typeof radius === 'number')
        circle.setRadius(radius)
      if (visible == null)
        return
      if (visible)
        circle.show()
      else
        circle.hide()
    })
  : null

const eventBindings: Array<{ event: string; handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) }
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
  circle: overlayApi?.overlay
})
</script>
