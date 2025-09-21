<template />

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { PropType } from 'vue'
import { useMarker } from '@amap-vue/hooks'
import { amapMapInjectionKey, type LngLatLike, type MapInjectionContext, warn } from '@amap-vue/shared'

defineOptions({
  name: 'AmapMarker'
})

const props = defineProps({
  position: {
    type: [Array, Object] as PropType<LngLatLike>,
    required: true
  },
  icon: [String, Object] as PropType<string | AMap.Icon>,
  label: [String, Object] as PropType<string | AMap.MarkerLabelOptions>,
  draggable: Boolean,
  zIndex: Number,
  extData: null as any,
  offset: [Array, Object] as PropType<AMap.Pixel | [number, number]>,
  visible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits<{
  ready: [marker: AMap.Marker]
  click: [event: any]
  dragend: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapMarker> must be used inside <AmapMap>.')

const options = computed(() => ({
  position: props.position,
  icon: props.icon,
  label: props.label,
  draggable: props.draggable,
  zIndex: props.zIndex,
  extData: props.extData,
  offset: props.offset,
  visible: props.visible
}))

const markerApi = context ? useMarker(() => context.map.value, options) : null
const marker = markerApi?.marker ?? shallowRef<AMap.Marker | null>(null)

const eventBindings: Array<{ event: string; handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'dragend', handler: event => emit('dragend', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) }
]

if (markerApi)
  eventBindings.forEach(({ event, handler }) => markerApi.on(event, handler))

let readyEmitted = false

watch(marker, (value) => {
  if (value && !readyEmitted) {
    readyEmitted = true
    emit('ready', value)
  }
})

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => markerApi?.off(event, handler))
  markerApi?.destroy()
})

defineExpose({
  marker
})
</script>
