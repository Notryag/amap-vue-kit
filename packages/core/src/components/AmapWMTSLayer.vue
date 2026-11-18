<script setup lang="ts">
import type { UseWMTSLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useWMTSLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapWMTSLayer' })

const props = withDefaults(defineProps<{
  url: string
  params: UseWMTSLayerOptions['params']
  blend?: boolean
  tileSize?: number
  zooms?: [number, number]
  opacity?: number
  visible?: boolean
  zIndex?: number
}>(), { visible: true, blend: undefined })

const emit = defineEmits<{
  ready: [layer: AMap.TileLayer.WMTS]
  complete: [event: unknown]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapWMTSLayer> must be used inside <AmapMap>.')

const { overlay: layer, on, reload } = useWMTSLayer(() => context?.map.value, props)
on('complete', event => emit('complete', event))
watch(layer, (value) => {
  if (value)
    emit('ready', value)
})

defineExpose({ layer, reload })
</script>

<template>
  <span v-if="false" />
</template>
