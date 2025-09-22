<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useElasticMarker } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapElasticMarker',
})

const props = defineProps({
  position: {
    type: [Array, Object] as PropType<LngLatLike>,
    required: true,
  },
  styles: Object as PropType<AMap.ElasticMarkerStyles>,
  zoomStyleMapping: Object as PropType<Record<number, number> | undefined>,
  visible: {
    type: Boolean,
    default: true,
  },
  extData: null as any,
  options: {
    type: Object as PropType<Partial<AMap.ElasticMarkerOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [marker: AMap.ElasticMarker]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapElasticMarker> must be used inside <AmapMap>.')

const markerOptions = computed(() => ({
  position: props.position,
  styles: props.styles,
  zoomStyleMapping: props.zoomStyleMapping,
  visible: props.visible,
  extData: props.extData,
  ...props.options,
}))

const markerApi = context ? useElasticMarker(() => context.map.value, markerOptions) : null
const elasticMarker = markerApi?.overlay ?? shallowRef<AMap.ElasticMarker | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (markerApi) {
  watch(elasticMarker, (value) => {
    if (value)
      emit('ready', value)
  })
}

eventBindings.forEach(({ event, handler }) => markerApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => markerApi?.off(event, handler))
  markerApi?.destroy()
})

defineExpose({
  elasticMarker,
})
</script>

<template>
  <span v-if="false" />
</template>
