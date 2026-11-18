<script setup lang="ts">
import type { ShallowRef } from 'vue'
import type { LocaPulseLineStyle, PulseLineItem } from '../composables/useLocaPulseLineLayer'
import type { RenderScheduleHandle } from '../render-scheduler'
import type { LocaContainer, LocaPulseLineLayerOptions } from '../types'
import { inject, watch } from 'vue'
import { useLocaPulseLineLayer } from '../composables/useLocaPulseLineLayer'
import { cancelRenderFrame, scheduleRenderFrame } from '../render-scheduler'

defineOptions({ name: 'AmapLocaPulseLineLayer' })

const props = defineProps<{
  data: PulseLineItem[]
  layerStyle?: LocaPulseLineStyle
  /** Native constructor options for the layer. */
  options?: LocaPulseLineLayerOptions
}>()

const containerRef = inject<ShallowRef<LocaContainer | null> | null>('amapLocaContainer', null)
if (!containerRef)
  throw new Error('[amap-vue] <AmapLocaPulseLineLayer> must be used inside an <AmapLocaProvider>.')

watch(containerRef, (container, _, onCleanup) => {
  if (!container)
    return

  const api = useLocaPulseLineLayer(container, props.options)
  let pendingRender: RenderScheduleHandle | null = null

  function scheduleRender() {
    if (pendingRender != null)
      cancelRenderFrame(pendingRender)
    pendingRender = scheduleRenderFrame(() => {
      pendingRender = null
      api.render()
    })
  }

  api.setData(props.data)
  api.setStyle({ ...props.layerStyle })
  api.addTo()
  scheduleRender()

  const stopData = watch(() => props.data, (data) => {
    api.setData(data)
    scheduleRender()
  }, { deep: true })

  const stopStyle = watch(() => props.layerStyle, (style) => {
    api.setStyle({ ...style })
    scheduleRender()
  }, { deep: true })

  onCleanup(() => {
    stopData()
    stopStyle()
    if (pendingRender != null)
      cancelRenderFrame(pendingRender)
    api.destroy()
  })
}, { immediate: true, flush: 'sync' })
</script>

<template>
  <slot />
</template>
