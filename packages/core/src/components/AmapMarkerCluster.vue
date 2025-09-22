<script setup lang="ts">
import type { MarkerClusterPoint } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useMarkerClusterer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapMarkerCluster',
})

const props = defineProps({
  points: Array as PropType<MarkerClusterPoint[] | undefined>,
  markers: Array as PropType<AMap.Marker[] | undefined>,
  visible: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.MarkerClusterOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [cluster: AMap.MarkerCluster]
  click: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapMarkerCluster> must be used inside <AmapMap>.')

const clusterOptions = computed(() => ({
  points: props.points,
  markers: props.markers,
  visible: props.visible,
  ...props.options,
}))

const clusterApi = context ? useMarkerClusterer(() => context.map.value, clusterOptions) : null
const cluster = clusterApi?.cluster ?? shallowRef<AMap.MarkerCluster | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
]

if (clusterApi) {
  watch(cluster, (value) => {
    if (value)
      emit('ready', value)
  })
  eventBindings.forEach(({ event, handler }) => clusterApi.on(event, handler))
}

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => clusterApi?.off(event, handler))
  clusterApi?.destroy()
})

defineExpose({
  cluster,
})
</script>

<template>
  <span v-if="false" />
</template>
