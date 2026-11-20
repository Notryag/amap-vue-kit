<script setup lang="ts">
import type { LayerGroupMember, UseLayerGroupOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useLayerGroup } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapLayerGroup' })

const props = withDefaults(defineProps<{
  options?: UseLayerGroupOptions
  layers?: readonly LayerGroupMember[]
  visible?: boolean
}>(), { visible: undefined })

const emit = defineEmits<{ ready: [group: AMap.LayerGroup] }>()
const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapLayerGroup> must be used inside <AmapMap>.')

const {
  overlay: group,
  addLayers,
  removeLayers,
  clearLayers,
  getLayers,
  hasLayer,
  setOptions,
  on,
  off,
} = useLayerGroup(() => context?.map.value, () => ({
  layers: props.layers ?? props.options?.layers,
  visible: props.visible ?? props.options?.visible,
}))

watch(group, (value) => {
  if (value)
    emit('ready', value)
})

defineExpose({
  group,
  addLayers,
  removeLayers,
  clearLayers,
  getLayers,
  hasLayer,
  setOptions,
  on,
  off,
})
</script>

<template>
  <span v-if="false" />
</template>
