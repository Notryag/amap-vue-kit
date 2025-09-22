<script setup lang="ts">
import type { BoundsLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useRectangle } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapRectangle',
})

const props = defineProps({
  bounds: {
    type: [Array, Object] as PropType<BoundsLike>,
    required: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.RectangleOptions>>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: true,
  },
  extData: null as any,
})

const emit = defineEmits<{
  ready: [rectangle: AMap.Rectangle]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapRectangle> must be used inside <AmapMap>.')

const overlayOptions = computed(() => ({
  bounds: props.bounds,
  visible: props.visible,
  extData: props.extData,
  ...props.options,
}))

const rectangleApi = context ? useRectangle(() => context.map.value, overlayOptions) : null
const rectangle = rectangleApi?.overlay ?? shallowRef<AMap.Rectangle | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (rectangleApi) {
  watch(rectangle, (value) => {
    if (value)
      emit('ready', value)
  })
}

eventBindings.forEach(({ event, handler }) => rectangleApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => rectangleApi?.off(event, handler))
  rectangleApi?.destroy()
})

defineExpose({
  rectangle,
})
</script>

<template>
  <span v-if="false" />
</template>
