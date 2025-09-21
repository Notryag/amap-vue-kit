<script setup lang="ts">
import type { UseHeatMapOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useHeatMap } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapHeatMap',
})

const props = defineProps({
  data: {
    type: Array as PropType<AMap.HeatMapDataPoint[]>,
    default: () => [],
  },
  max: Number,
  radius: Number,
  gradient: {
    type: Object as PropType<Record<string, string> | undefined>,
    default: undefined,
  },
  opacity: {
    type: Array as PropType<[number, number] | undefined>,
    default: undefined,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.HeatMapOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [heatMap: AMap.HeatMap]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapHeatMap> must be used inside <AmapMap>.')

const heatMapOptions = computed<UseHeatMapOptions>(() => {
  const base: UseHeatMapOptions = {
    ...props.options,
    visible: props.visible,
  }
  if (props.radius != null)
    base.radius = props.radius
  if (props.gradient)
    base.gradient = props.gradient
  if (props.opacity)
    base.opacity = props.opacity
  if (props.max != null)
    base.max = props.max
  if (props.data)
    base.data = props.data
  return base
})

const heatMapApi = mapContext ? useHeatMap(() => mapContext.map.value, heatMapOptions) : null
const heatMap = heatMapApi?.overlay ?? shallowRef<AMap.HeatMap | null>(null)

if (heatMapApi) {
  watch(heatMap, (value) => {
    if (value)
      emit('ready', value)
  }, { immediate: true })
}

function setDataSet(dataSet: AMap.HeatMapDataSet) {
  heatMapApi?.setDataSet(dataSet)
}

function addDataPoint(point: AMap.HeatMapDataPoint) {
  heatMapApi?.addDataPoint(point)
}

function show() {
  heatMapApi?.show()
}

function hide() {
  heatMapApi?.hide()
}

function setOptions(options: Partial<AMap.HeatMapOptions>) {
  heatMapApi?.setOptions(options)
}

onBeforeUnmount(() => {
  heatMapApi?.destroy()
})

defineExpose({
  heatMap,
  setDataSet,
  addDataPoint,
  show,
  hide,
  setOptions,
})
</script>

<template>
  <span v-if="false" />
</template>
