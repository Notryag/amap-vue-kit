<script setup lang="ts">
import type { UseWMSLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useWMSLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapWMSLayer' })

const props = withDefaults(defineProps<{
  url: string
  params: UseWMSLayerOptions['params']
  blend?: boolean
  tileSize?: number
  zooms?: [number, number]
  opacity?: number
  visible?: boolean
  zIndex?: number
}>(), { visible: true, blend: undefined })
const emit = defineEmits<{
  ready: [layer: AMap.TileLayer.WMS]
  complete: [event: unknown]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapWMSLayer> must be used inside <AmapMap>.')

const { overlay: layer, on, reload } = useWMSLayer(() => context?.map.value, props)
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
