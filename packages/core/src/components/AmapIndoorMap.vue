<script setup lang="ts">
import type { IndoorBuilding, UseIndoorMapOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useIndoorMap } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapIndoorMap' })

const props = withDefaults(defineProps<{
  options?: UseIndoorMapOptions
  visible?: boolean
  hideFloorBar?: boolean
}>(), {
  visible: undefined,
  hideFloorBar: undefined,
})

const emit = defineEmits<{
  ready: [layer: AMap.IndoorMap]
  buildingChange: [building: IndoorBuilding | null]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapIndoorMap> must be used inside <AmapMap>.')

const { overlay: layer, building, showIndoorMap, showFloor } = useIndoorMap(() => context?.map.value, () => ({
  ...props.options,
  visible: props.visible ?? props.options?.visible,
  hideFloorBar: props.hideFloorBar ?? props.options?.hideFloorBar,
}))

watch(layer, (value) => {
  if (value)
    emit('ready', value)
})
watch(building, value => emit('buildingChange', value))

defineExpose({
  layer,
  building,
  showIndoorMap,
  showFloor,
})
</script>

<template>
  <span v-if="false" />
</template>
