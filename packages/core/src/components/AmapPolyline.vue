<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'
import { usePolyline } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

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

const polylineApi = context ? usePolyline(() => context.map.value, overlayOptions) : null
const polyline = polylineApi?.overlay ?? shallowRef<AMap.Polyline | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (polylineApi) {
  watch(polyline, (value) => {
    if (value)
      emit('ready', value)
  })
}

eventBindings.forEach(({ event, handler }) => polylineApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => polylineApi?.off(event, handler))
  polylineApi?.destroy()
})

defineExpose({
  polyline,
})
</script>

<template>
  <span v-if="false" />
</template>
