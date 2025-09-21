<script setup lang="ts">
import type { UseTileLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useTileLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapTileLayer',
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: Number,
  zIndex: Number,
  tileUrl: {
    type: [String, Function] as PropType<string | ((x: number, y: number, level: number) => string)>,
    default: undefined,
  },
  getTileUrl: {
    type: Function as PropType<(x: number, y: number, level: number) => string>,
    default: undefined,
  },
  options: {
    type: Object as PropType<Partial<AMap.TileLayerOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [layer: AMap.TileLayer]
}>()

export interface TileLayerProps {
  visible?: boolean
  opacity?: number
  zIndex?: number
  tileUrl?: string | ((x: number, y: number, level: number) => string)
  getTileUrl?: (x: number, y: number, level: number) => string
  options?: Partial<AMap.TileLayerOptions>
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapTileLayer> must be used inside <AmapMap>.')

const layerOptions = computed<UseTileLayerOptions>(() => {
  const base: UseTileLayerOptions = {
    ...props.options,
    visible: props.visible,
  }
  if (props.opacity != null)
    base.opacity = props.opacity
  if (props.zIndex != null)
    base.zIndex = props.zIndex
  if (props.tileUrl)
    base.tileUrl = props.tileUrl
  if (props.getTileUrl)
    base.getTileUrl = props.getTileUrl
  return base
})

const layerApi = context ? useTileLayer(() => context.map.value, layerOptions) : null
const layer = layerApi?.overlay ?? shallowRef<AMap.TileLayer | null>(null)

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
