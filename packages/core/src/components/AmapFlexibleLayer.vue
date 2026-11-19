<script setup lang="ts">
import type { FlexibleCreateTile } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useFlexibleLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapFlexibleLayer' })

const props = withDefaults(defineProps<{
  createTile: FlexibleCreateTile
  cacheSize?: number
  tileSize?: 64 | 128 | 256
  zooms?: [number, number]
  opacity?: number
  visible?: boolean
  zIndex?: number
}>(), {
  visible: true,
  opacity: 1,
  zIndex: 4,
  tileSize: 256,
})

const emit = defineEmits<{ ready: [layer: AMap.TileLayer.Flexible] }>()
const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapFlexibleLayer> must be used inside <AmapMap>.')

const { overlay: layer, reload } = useFlexibleLayer(() => context?.map.value, props)
watch(layer, (value) => {
  if (value)
    emit('ready', value)
})
defineExpose({ layer, reload })
</script>

<template>
  <span v-if="false" />
</template>
