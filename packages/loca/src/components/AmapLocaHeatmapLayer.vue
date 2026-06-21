<script setup lang="ts">
import type { ShallowRef } from 'vue'
import type { HeatmapLike } from '../composables/useLocaHeatmapLayer'
import type { RenderScheduleHandle } from '../render-scheduler'
import type { LocaContainer, LocaHeatmapLayerOptions, LocaLayerStyle } from '../types'
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { useLocaHeatmapLayer } from '../composables/useLocaHeatmapLayer'
import { cancelRenderFrame, scheduleRenderFrame } from '../render-scheduler'

interface HeatmapLayerProps {
  data: HeatmapLike[]
  valueField?: string
  style?: LocaLayerStyle<HeatmapLike>
  layerStyle?: LocaLayerStyle<HeatmapLike>
  options?: LocaHeatmapLayerOptions
  autoRender?: boolean
}

defineOptions({
  name: 'AmapLocaHeatmapLayer',
})

const props = withDefaults(defineProps<HeatmapLayerProps>(), {
  valueField: 'value',
  autoRender: true,
})

const containerRef = inject<ShallowRef<LocaContainer | null> | null>('amapLocaContainer', null)
if (!containerRef)
  throw new Error('[amap-vue] <AmapLocaHeatmapLayer> must be used inside an <AmapLocaProvider>.')

const layerApi = useLocaHeatmapLayer(() => containerRef.value ?? null, props.options)

let pendingRender: RenderScheduleHandle | null = null

function scheduleRender() {
  if (!props.autoRender)
    return
  if (pendingRender != null)
    cancelRenderFrame(pendingRender)
  pendingRender = scheduleRenderFrame(() => {
    pendingRender = null
    layerApi.render()
  })
}

watch(
  () => props.data,
  (value) => {
    layerApi.setData(value, props.valueField)
    scheduleRender()
  },
  { immediate: true, deep: true },
)

watch(
  () => props.options,
  (value) => {
    if (value)
      layerApi.updateOptions(value)
  },
  { immediate: true, deep: true },
)

watch(
  () => props.layerStyle ?? props.style,
  (value) => {
    if (value) {
      layerApi.setStyle(value)
      scheduleRender()
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => containerRef.value,
  (value) => {
    if (value) {
      layerApi.addTo(value)
      scheduleRender()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (containerRef.value) {
    layerApi.addTo(containerRef.value)
    scheduleRender()
  }
})

onBeforeUnmount(() => {
  if (pendingRender != null)
    cancelRenderFrame(pendingRender)
  layerApi.destroy()
})
</script>

<template>
  <slot />
</template>
