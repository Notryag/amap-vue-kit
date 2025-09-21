<template>
  <div ref="contentRef" class="amap-vue-infowindow-content">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { PropType } from 'vue'
import { amapMapInjectionKey, type LngLatLike, type MapInjectionContext, toLngLat, toPixel, loader, warn } from '@amap-vue/shared'

defineOptions({
  name: 'AmapInfoWindow'
})

const props = defineProps({
  position: [Array, Object] as PropType<LngLatLike | undefined>,
  isOpen: {
    type: Boolean,
    default: false
  },
  offset: [Array, Object] as PropType<AMap.Pixel | [number, number]>
})

const emit = defineEmits<{
  ready: [infoWindow: AMap.InfoWindow]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapInfoWindow> must be used inside <AmapMap>.')

const contentRef = shallowRef<HTMLDivElement | null>(null)
const infoWindow = shallowRef<AMap.InfoWindow | null>(null)
const currentMap = shallowRef<AMap.Map | null>(null)
let pendingOpen = props.isOpen

context?.ready((map) => {
  currentMap.value = map
  createInfoWindow()
})

watch(contentRef, (el) => {
  if (infoWindow.value && el)
    infoWindow.value.setContent(el)
})

watch([contentRef, currentMap], () => {
  if (currentMap.value && contentRef.value)
    createInfoWindow()
})

watch(() => props.offset, (offset) => {
  if (!infoWindow.value)
    return
  const AMap = loader.get()
  if (AMap && offset)
    infoWindow.value.setOffset(toPixel(AMap, offset) as any)
}, { deep: true })

watch(() => props.position, (position) => {
  if (!infoWindow.value || !position)
    return
  const AMap = loader.get()
  const lnglat = AMap ? toLngLat(AMap, position) : position
  if (typeof infoWindow.value.setPosition === 'function')
    infoWindow.value.setPosition(lnglat as any)
  if (props.isOpen)
    openWindow()
}, { deep: true })

watch(() => props.isOpen, (open) => {
  pendingOpen = open
  if (!infoWindow.value)
    return
  if (open)
    openWindow()
  else
    infoWindow.value.close()
}, { immediate: true })

async function createInfoWindow() {
  if (infoWindow.value || !contentRef.value || !currentMap.value)
    return

  try {
    const AMap = await loader.load()
    const instance = new AMap.InfoWindow({
      content: contentRef.value,
      offset: props.offset ? toPixel(AMap, props.offset) : undefined
    })
    infoWindow.value = instance
    emit('ready', instance)
    if (pendingOpen)
      openWindow()
  }
  catch (error) {
    warn(error instanceof Error ? error.message : String(error))
  }
}

function openWindow() {
  if (!infoWindow.value || !currentMap.value || !props.position)
    return
  const AMap = loader.get()
  const lnglat = AMap ? toLngLat(AMap, props.position) : props.position
  infoWindow.value.open(currentMap.value, lnglat as any)
}

onBeforeUnmount(() => {
  infoWindow.value?.close()
})

defineExpose({
  infoWindow
})
</script>

<style scoped>
.amap-vue-infowindow-content {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>
