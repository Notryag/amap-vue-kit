<script setup lang="ts">
import type { UseRangingToolOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useRangingTool } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapRangingTool' })

const props = defineProps<{
  options?: AMap.RangingToolOptions
  loadOptions?: UseRangingToolOptions['loadOptions']
}>()

const emit = defineEmits<{
  ready: [tool: AMap.RangingTool]
  addnode: [event: AMap.RangingToolEventMap['addnode']]
  removenode: [event: AMap.RangingToolEventMap['removenode']]
  end: [event: AMap.RangingToolEventMap['end']]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!mapContext)
  warn('<AmapRangingTool> must be used inside <AmapMap>.')

const { tool, active, start, stop } = useRangingTool(() => mapContext?.map.value, () => ({
  options: props.options,
  loadOptions: props.loadOptions,
  onAddNode: event => emit('addnode', event),
  onRemoveNode: event => emit('removenode', event),
  onEnd: event => emit('end', event),
}))

watch(tool, (instance) => {
  if (instance)
    emit('ready', instance)
})

defineExpose({ tool, active, start, stop })
</script>

<template>
  <slot :tool="tool" :active="active" :start="start" :stop="stop" />
</template>
