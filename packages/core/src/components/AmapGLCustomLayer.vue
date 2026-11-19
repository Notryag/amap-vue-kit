<script setup lang="ts">
import type { UseGLCustomLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useGLCustomLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapGLCustomLayer' })

const props = withDefaults(defineProps<{
  init?: UseGLCustomLayerOptions['init']
  render: UseGLCustomLayerOptions['render']
  visible?: boolean
  opacity?: number
  zIndex?: number
  zooms?: [number, number]
}>(), {
  visible: true,
  opacity: 1,
  zIndex: 120,
})

const emit = defineEmits<{ ready: [layer: AMap.GLCustomLayer] }>()
const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapGLCustomLayer> must be used inside <AmapMap>.')

const { overlay: layer, redraw } = useGLCustomLayer(() => context?.map.value, props)
watch(layer, (value) => {
  if (value)
    emit('ready', value)
})
defineExpose({ layer, redraw })
</script>

<template>
  <span v-if="false" />
</template>
