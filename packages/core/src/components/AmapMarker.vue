<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'
import { useMarker } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { Comment, computed, inject, onBeforeUnmount, shallowRef, useSlots, watch } from 'vue'

defineOptions({
  name: 'AmapMarker',
})

const props = defineProps({
  position: {
    type: [Array, Object] as PropType<LngLatLike>,
    required: true,
  },
  icon: [String, Object] as PropType<string | AMap.Icon>,
  label: [String, Object] as PropType<string | AMap.MarkerLabelOptions>,
  draggable: Boolean,
  zIndex: Number,
  extData: null as any,
  offset: [Array, Object] as PropType<AMap.Pixel | [number, number]>,
  visible: {
    type: Boolean,
    default: true,
  },
  content: [String, Object] as PropType<string | HTMLElement | null>,
  anchor: String as PropType<AMap.MarkerAnchor | undefined>,
  isCustom: {
    type: Boolean,
    default: undefined,
  },
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

const contentRef = shallowRef<HTMLDivElement | null>(null)
const slots = useSlots()

const slotHasContent = computed(() => {
  if (!slots.default)
    return false
  const content = slots.default()
  return content.some((node) => {
    if (node.type === Comment)
      return false
    if (typeof node.children === 'string')
      return node.children.trim().length > 0
    return true
  })
})

const resolvedContent = computed(() => {
  if (props.content !== undefined)
    return props.content
  return slotHasContent.value ? contentRef.value : null
})

const shouldUseCustomContent = computed(() => {
  if (typeof props.isCustom === 'boolean')
    return props.isCustom
  const content = resolvedContent.value
  if (content == null)
    return undefined
  return typeof content !== 'string'
})

const options = computed(() => ({
  position: props.position,
  icon: props.icon,
  label: props.label,
  draggable: props.draggable,
  zIndex: props.zIndex,
  extData: props.extData,
  offset: props.offset,
  visible: props.visible,
  content: resolvedContent.value,
  anchor: props.anchor,
  isCustom: shouldUseCustomContent.value,
}))

const markerApi = context ? useMarker(() => context.map.value, options) : null
const marker = markerApi?.marker ?? shallowRef<AMap.Marker | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'dragend', handler: event => emit('dragend', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
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
  marker,
})
</script>

<template>
  <div v-if="props.content == null" ref="contentRef" class="amap-vue-marker-content">
    <slot />
  </div>
</template>

<style scoped>
.amap-vue-marker-content {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>
