<script setup lang="ts">
import type { MapInjectionContext, PolygonPath } from '@amap-vue/shared'
import type { PropType } from 'vue'
import { usePolygon } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapPolygon',
})

const props = defineProps({
  path: {
    type: [Array] as PropType<PolygonPath>,
    required: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.PolygonOptions>>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: true,
  },
  extData: null as any,
})

const emit = defineEmits<{
  ready: [polygon: AMap.Polygon]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapPolygon> must be used inside <AmapMap>.')

const overlayOptions = computed(() => ({
  path: props.path,
  visible: props.visible,
  extData: props.extData,
  ...props.options,
}))

const polygonApi = context ? usePolygon(() => context.map.value, overlayOptions) : null
const polygon = polygonApi?.overlay ?? shallowRef<AMap.Polygon | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (polygonApi) {
  watch(polygon, (value) => {
    if (value)
      emit('ready', value)
  })
}

eventBindings.forEach(({ event, handler }) => polygonApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => polygonApi?.off(event, handler))
  polygonApi?.destroy()
})

defineExpose({
  polygon,
})
</script>

<template>
  <span v-if="false" />
</template>
