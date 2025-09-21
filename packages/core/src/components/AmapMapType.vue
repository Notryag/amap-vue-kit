<script setup lang="ts">
import type { UseMapTypeOptions } from '@amap-vue/hooks'
import type { MapInjectionContext, PixelLike } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useMapType } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapMapType',
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
  defaultType: Number,
  showTraffic: Boolean,
  showRoad: Boolean,
  options: {
    type: Object as PropType<Partial<UseMapTypeOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [control: any]
}>()

export interface MapTypeProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  defaultType?: number
  showTraffic?: boolean
  showRoad?: boolean
  options?: Partial<UseMapTypeOptions>
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapMapType> must be used inside <AmapMap>.')

const controlOptions = computed<UseMapTypeOptions>(() => {
  const base: UseMapTypeOptions = {
    ...props.options,
    visible: props.visible,
  }
  if (props.position != null)
    base.position = props.position
  if (props.offset != null)
    base.offset = props.offset
  if (props.defaultType != null)
    base.defaultType = props.defaultType
  if (props.showTraffic != null)
    base.showTraffic = props.showTraffic
  if (props.showRoad != null)
    base.showRoad = props.showRoad
  return base
})

const controlApi = context ? useMapType(() => context.map.value, controlOptions) : null
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
