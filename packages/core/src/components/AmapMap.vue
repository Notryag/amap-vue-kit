<script setup lang="ts">
import type { LngLatLike, LoaderOptions, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'
import { useMap } from '@amap-vue/hooks'
import { amapMapInjectionKey } from '@amap-vue/shared'
import { computed, onBeforeUnmount, provide, shallowRef } from 'vue'

defineOptions({
  name: 'AmapMap',
})

const props = defineProps({
  center: {
    type: [Array, Object] as PropType<LngLatLike | undefined>,
    default: undefined,
  },
  zoom: Number,
  viewMode: String as PropType<AMap.MapViewMode>,
  theme: String,
  pitch: Number,
  rotation: Number,
  mapStyle: String,
  plugins: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  loaderOptions: {
    type: Object as PropType<Partial<LoaderOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [map: AMap.Map]
  moveend: [event: any]
  click: [event: any]
  complete: [event: any]
  error: [event: any]
}>()

const containerRef = shallowRef<HTMLDivElement | null>(null)

const mapOptions = computed(() => ({
  center: props.center,
  zoom: props.zoom,
  viewMode: props.viewMode,
  theme: props.theme,
  pitch: props.pitch,
  rotation: props.rotation,
  mapStyle: props.mapStyle,
  plugins: props.plugins,
  loaderOptions: props.loaderOptions,
  container: containerRef.value,
}))

const { map, ready, on, off, destroy } = useMap(mapOptions, containerRef)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'moveend', handler: event => emit('moveend', event) },
  { event: 'click', handler: event => emit('click', event) },
  { event: 'complete', handler: event => emit('complete', event) },
  { event: 'error', handler: event => emit('error', event) },
]

eventBindings.forEach(({ event, handler }) => on(event, handler))

ready((instance) => {
  emit('ready', instance)
})

provide<MapInjectionContext>(amapMapInjectionKey, {
  map,
  ready,
})

const exposedMap = {
  get value() {
    return map.value
  },
  set value(val: AMap.Map | null) {
    map.value = val
  },
}

defineExpose({
  map: exposedMap,
})

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => off(event, handler))
  destroy()
})
</script>

<template>
  <div ref="containerRef" class="amap-vue-map">
    <slot />
  </div>
</template>

<style scoped>
.amap-vue-map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
