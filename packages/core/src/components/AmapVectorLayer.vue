<script setup lang="ts">
import type { UseVectorLayerOptions, VectorOverlay } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useVectorLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapVectorLayer' })

const props = withDefaults(defineProps<{
  options?: UseVectorLayerOptions
  overlays?: readonly VectorOverlay[]
  visible?: boolean
  zIndex?: number
}>(), { visible: undefined })

const emit = defineEmits<{ ready: [layer: AMap.VectorLayer] }>()
const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapVectorLayer> must be used inside <AmapMap>.')

const { overlay: layer, add, remove, clear, has, query, getBounds } = useVectorLayer(() => context?.map.value, () => ({
  ...props.options,
  overlays: props.overlays ?? props.options?.overlays,
  visible: props.visible ?? props.options?.visible,
  zIndex: props.zIndex ?? props.options?.zIndex,
}))

watch(layer, (value) => {
  if (value)
    emit('ready', value)
})

defineExpose({
  layer,
  add,
  remove,
  clear,
  has,
  query,
  getBounds,
})
</script>

<template>
  <span v-if="false" />
</template>
