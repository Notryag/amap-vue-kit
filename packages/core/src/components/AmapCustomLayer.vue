<script setup lang="ts">
import type { CustomLayerRenderContext } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useCustomLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapCustomLayer' })

const props = withDefaults(defineProps<{
  render: (context: CustomLayerRenderContext) => void
  zooms?: [number, number]
  opacity?: number
  visible?: boolean
  zIndex?: number
  alwaysRender?: boolean
}>(), {
  visible: true,
  opacity: 1,
  zIndex: 120,
})

const emit = defineEmits<{ ready: [layer: AMap.CustomLayer] }>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapCustomLayer> must be used inside <AmapMap>.')

const { overlay: layer, redraw } = useCustomLayer(() => context?.map.value, props)
watch(layer, (value) => {
  if (value)
    emit('ready', value)
})

defineExpose({ layer, redraw })
</script>

<template>
  <span v-if="false" />
</template>
