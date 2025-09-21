<script setup lang="ts">
import type { UseTileLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useSatelliteLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapSatelliteLayer',
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
  ready: [layer: AMap.TileLayer.Satellite]
}>()

export interface SatelliteLayerProps {
  visible?: boolean
  opacity?: number
  zIndex?: number
  options?: Partial<AMap.TileLayerOptions>
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapSatelliteLayer> must be used inside <AmapMap>.')

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

const layerApi = context ? useSatelliteLayer(() => context.map.value, layerOptions) : null
const layer = layerApi?.overlay ?? shallowRef<AMap.TileLayer.Satellite | null>(null)

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
