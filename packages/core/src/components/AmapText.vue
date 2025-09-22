<script setup lang="ts">
import type { LngLatLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useText } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapText',
})

const props = defineProps({
  position: {
    type: [Array, Object] as PropType<LngLatLike>,
    required: true,
  },
  text: String,
  style: Object as PropType<Record<string, any> | undefined>,
  offset: [Array, Object] as PropType<AMap.Pixel | [number, number]>,
  anchor: String as PropType<AMap.MarkerAnchor | undefined>,
  zIndex: Number,
  extData: null as any,
  visible: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.TextOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [text: AMap.Text]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
  dragend: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapText> must be used inside <AmapMap>.')

const textOptions = computed(() => ({
  position: props.position,
  text: props.text,
  style: props.style,
  offset: props.offset,
  anchor: props.anchor,
  zIndex: props.zIndex,
  extData: props.extData,
  visible: props.visible,
  ...props.options,
}))

const textApi = context ? useText(() => context.map.value, textOptions) : null
const text = textApi?.overlay ?? shallowRef<AMap.Text | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
  { event: 'dragend', handler: event => emit('dragend', event) },
]

if (textApi) {
  watch(text, (value) => {
    if (value)
      emit('ready', value)
  })
}

eventBindings.forEach(({ event, handler }) => textApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => textApi?.off(event, handler))
  textApi?.destroy()
})

defineExpose({
  text,
})
</script>

<template>
  <span v-if="false" />
</template>
