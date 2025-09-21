<script setup lang="ts">
import type { UseTileLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useRoadNetLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapRoadNetLayer',
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: Number,
  zIndex: Number,
  options: {
    type: Object as PropType<Partial<AMap.TileLayerOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [layer: AMap.TileLayer.RoadNet]
}>()

export interface RoadNetLayerProps {
  visible?: boolean
  opacity?: number
  zIndex?: number
  options?: Partial<AMap.TileLayerOptions>
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapRoadNetLayer> must be used inside <AmapMap>.')

const layerOptions = computed<UseTileLayerOptions>(() => {
  const base: UseTileLayerOptions = {
    ...props.options,
    visible: props.visible,
  }
  if (props.opacity != null)
    base.opacity = props.opacity
  if (props.zIndex != null)
    base.zIndex = props.zIndex
  return base
})

const layerApi = context ? useRoadNetLayer(() => context.map.value, layerOptions) : null
const layer = layerApi?.overlay ?? shallowRef<AMap.TileLayer.RoadNet | null>(null)

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
