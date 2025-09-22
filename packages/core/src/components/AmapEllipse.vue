<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useEllipse } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapEllipse',
})

const props = defineProps({
  center: {
    type: [Array, Object] as PropType<LngLatLike>,
    required: true,
  },
  radius: {
    type: Array as PropType<[number, number]>,
    required: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.EllipseOptions>>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: true,
  },
  extData: null as any,
})

const emit = defineEmits<{
  ready: [ellipse: AMap.Ellipse]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapEllipse> must be used inside <AmapMap>.')

const overlayOptions = computed(() => ({
  center: props.center,
  radius: props.radius,
  visible: props.visible,
  extData: props.extData,
  ...props.options,
}))

const ellipseApi = context ? useEllipse(() => context.map.value, overlayOptions) : null
const ellipse = ellipseApi?.overlay ?? shallowRef<AMap.Ellipse | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (ellipseApi) {
  watch(ellipse, (value) => {
    if (value)
      emit('ready', value)
  })
}

eventBindings.forEach(({ event, handler }) => ellipseApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => ellipseApi?.off(event, handler))
  ellipseApi?.destroy()
})

defineExpose({
  ellipse,
})
</script>

<template>
  <span v-if="false" />
</template>
