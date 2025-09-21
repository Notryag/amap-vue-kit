<script setup lang="ts">
import type { UseControlBarOptions } from '@amap-vue/hooks'
import type { MapInjectionContext, PixelLike } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useControlBar } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapControlBar',
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
  showZoomBar: Boolean,
  showControlButton: Boolean,
  options: {
    type: Object as PropType<Partial<UseControlBarOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [control: any]
}>()

export interface ControlBarProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  showZoomBar?: boolean
  showControlButton?: boolean
  options?: Partial<UseControlBarOptions>
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapControlBar> must be used inside <AmapMap>.')

const controlOptions = computed<UseControlBarOptions>(() => {
  const base: UseControlBarOptions = {
    ...props.options,
    visible: props.visible,
  }
  if (props.position != null)
    base.position = props.position
  if (props.offset != null)
    base.offset = props.offset
  if (props.showZoomBar != null)
    base.showZoomBar = props.showZoomBar
  if (props.showControlButton != null)
    base.showControlButton = props.showControlButton
  return base
})

const controlApi = context ? useControlBar(() => context.map.value, controlOptions) : null
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
