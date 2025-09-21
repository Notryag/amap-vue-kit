<script setup lang="ts">
import type { UseScaleOptions } from '@amap-vue/hooks'
import type { MapInjectionContext, PixelLike } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useScale } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapScale',
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  position: String as PropType<string>,
  offset: {
    type: [Array, Object] as PropType<PixelLike>,
    default: undefined,
  },
  options: {
    type: Object as PropType<Partial<UseScaleOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [control: any]
}>()

export interface ScaleProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  options?: Partial<UseScaleOptions>
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapScale> must be used inside <AmapMap>.')

const controlOptions = computed<UseScaleOptions>(() => {
  const base: UseScaleOptions = {
    ...props.options,
    visible: props.visible,
  }
  if (props.position != null)
    base.position = props.position
  if (props.offset != null)
    base.offset = props.offset
  return base
})

const controlApi = context ? useScale(() => context.map.value, controlOptions) : null
const control = controlApi?.control ?? shallowRef<any>(null)

if (controlApi) {
  watch(control, (value) => {
    if (value)
      emit('ready', value)
  }, { immediate: true })
}

onBeforeUnmount(() => {
  controlApi?.destroy()
})

defineExpose({
  control,
})
</script>

<template>
  <span v-if="false" />
</template>
