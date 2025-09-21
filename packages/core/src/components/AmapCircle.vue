<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'
import { useCircle } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapCircle',
})

const props = defineProps({
  center: {
    type: [Array, Object] as PropType<LngLatLike>,
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.CircleOptions>>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: true,
  },
  extData: null as any,
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
  ...props.options,
}))

const circleApi = context ? useCircle(() => context.map.value, overlayOptions) : null
const circle = circleApi?.overlay ?? shallowRef<AMap.Circle | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (circleApi) {
  watch(circle, (value) => {
    if (value)
      emit('ready', value)
  })
}

eventBindings.forEach(({ event, handler }) => circleApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => circleApi?.off(event, handler))
  circleApi?.destroy()
})

defineExpose({
  circle,
})
</script>

<template />
