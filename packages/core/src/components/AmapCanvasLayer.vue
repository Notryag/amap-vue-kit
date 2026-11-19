<script setup lang="ts">
import type { CanvasLayerBounds } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useCanvasLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapCanvasLayer' })

const props = withDefaults(defineProps<{
  canvas: HTMLCanvasElement | null
  bounds: CanvasLayerBounds
  zooms?: [number, number]
  opacity?: number
  visible?: boolean
  zIndex?: number
}>(), {
  visible: true,
  opacity: 1,
  zIndex: 6,
})

const emit = defineEmits<{ ready: [layer: AMap.CanvasLayer] }>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapCanvasLayer> must be used inside <AmapMap>.')

const { overlay: layer, refresh } = useCanvasLayer(() => context?.map.value, props)
watch(layer, (value) => {
  if (value)
    emit('ready', value)
})

defineExpose({ layer, refresh })
</script>

<template>
  <span v-if="false" />
</template>
