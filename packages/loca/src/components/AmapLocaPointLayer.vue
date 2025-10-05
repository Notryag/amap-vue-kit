<template>
  <slot />
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'
import type { ShallowRef } from 'vue'
import type { LocaContainer, LocaLayerStyle } from '../types'
import type { PointLike, UseLocaPointLayerOptions } from '../composables/useLocaPointLayer'
import { useLocaPointLayer } from '../composables/useLocaPointLayer'

interface PointLayerProps {
  data: PointLike[]
  lngKey?: string
  latKey?: string
  style?: LocaLayerStyle<PointLike>
  options?: UseLocaPointLayerOptions
  autoRender?: boolean
}

const props = withDefaults(defineProps<PointLayerProps>(), {
  lngKey: 'lng',
  latKey: 'lat',
  autoRender: true,
})

const containerRef = inject<ShallowRef<LocaContainer | null> | null>('amapLocaContainer', null)
if (!containerRef)
  throw new Error('[amap-vue] <AmapLocaPointLayer> must be used inside an <AmapLocaProvider>.')

const layerApi = useLocaPointLayer(() => containerRef.value ?? null, props.options)

let pendingRender: number | null = null
const raf = typeof requestAnimationFrame !== 'undefined'
  ? (cb: FrameRequestCallback) => requestAnimationFrame(cb)
  : (cb: FrameRequestCallback) => window.setTimeout(() => {
    const now = typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now()
    cb(now)
  }, 16)
const caf = typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame : clearTimeout

function scheduleRender() {
  if (!props.autoRender)
    return
  if (pendingRender != null)
    caf(pendingRender)
  pendingRender = raf(() => {
    pendingRender = null
    layerApi.render()
  })
}

watch(
  () => props.data,
  (value) => {
    layerApi.setData(value, props.lngKey, props.latKey)
    scheduleRender()
  },
  { immediate: true, deep: true },
)

watch(
  () => props.style,
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
    caf(pendingRender)
  layerApi.destroy()
})
</script>
