<script setup lang="ts">
import type { UseTrafficLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useTrafficLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapTrafficLayer',
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  autoRefresh: Boolean,
  interval: Number,
  opacity: Number,
  zIndex: Number,
  options: {
    type: Object as PropType<Partial<AMap.TileLayer.Traffic.Options>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [layer: AMap.TileLayer.Traffic]
}>()

export interface TrafficLayerProps {
  visible?: boolean
  autoRefresh?: boolean
  interval?: number
  opacity?: number
  zIndex?: number
  options?: Partial<AMap.TileLayer.Traffic.Options>
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapTrafficLayer> must be used inside <AmapMap>.')

const layerOptions = computed<UseTrafficLayerOptions>(() => {
  const base: UseTrafficLayerOptions = {
    ...props.options,
    visible: props.visible,
  }
  if (props.autoRefresh != null)
    base.autoRefresh = props.autoRefresh
  if (props.interval != null)
    base.interval = props.interval
  if (props.opacity != null)
    base.opacity = props.opacity
  if (props.zIndex != null)
    base.zIndex = props.zIndex
  return base
})

const layerApi = context ? useTrafficLayer(() => context.map.value, layerOptions) : null
const layer = layerApi?.overlay ?? shallowRef<AMap.TileLayer.Traffic | null>(null)

if (layerApi) {
  watch(layer, (value) => {
    if (value)
      emit('ready', value)
  }, { immediate: true })
}

onBeforeUnmount(() => {
  layerApi?.destroy()
})

defineExpose({
  layer,
})
</script>

<template>
  <span v-if="false" />
</template>
