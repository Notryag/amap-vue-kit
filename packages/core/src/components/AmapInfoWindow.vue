<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'
import { useInfoWindow } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapInfoWindow',
})

const props = defineProps({
  position: [Array, Object] as PropType<LngLatLike | undefined>,
  isOpen: {
    type: Boolean,
    default: false,
  },
  offset: [Array, Object] as PropType<AMap.Pixel | [number, number]>,
  anchor: String as PropType<AMap.InfoWindowAnchor | undefined>,
  isCustom: Boolean,
  content: [String, Object] as PropType<string | HTMLElement | null>,
})

const emit = defineEmits<{
  ready: [infoWindow: AMap.InfoWindow]
  open: [event: any]
  close: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapInfoWindow> must be used inside <AmapMap>.')

const contentRef = shallowRef<HTMLDivElement | null>(null)

const resolvedContent = computed(() => {
  if (props.content !== undefined && props.content !== null)
    return props.content
  return contentRef.value
})

const options = computed(() => ({
  position: props.position,
  open: props.isOpen,
  offset: props.offset,
  anchor: props.anchor,
  isCustom: props.isCustom,
  content: resolvedContent.value,
}))

const infoWindowApi = context ? useInfoWindow(() => context.map.value, options) : null
const infoWindow = infoWindowApi?.infoWindow ?? shallowRef<AMap.InfoWindow | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'open', handler: event => emit('open', event) },
  { event: 'close', handler: event => emit('close', event) },
]

eventBindings.forEach(({ event, handler }) => infoWindowApi?.on(event, handler))

let readyEmitted = false

watch(infoWindow, (value) => {
  if (value && !readyEmitted) {
    readyEmitted = true
    emit('ready', value)
  }
})

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => infoWindowApi?.off(event, handler))
  infoWindowApi?.destroy()
})

defineExpose({
  infoWindow,
})
</script>

<template>
  <div v-if="props.content == null" ref="contentRef" class="amap-vue-infowindow-content">
    <slot />
  </div>
</template>

<style scoped>
.amap-vue-infowindow-content {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>
