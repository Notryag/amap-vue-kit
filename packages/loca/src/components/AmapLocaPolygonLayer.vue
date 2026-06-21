<script setup lang="ts">
import type { ShallowRef } from 'vue'
import type { PolygonSource } from '../composables/useLocaPolygonLayer'
import type { RenderScheduleHandle } from '../render-scheduler'
import type {
  LocaContainer,
  LocaLayerStyle,
  LocaPolygonLayerOptions,
} from '../types'
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { useLocaPolygonLayer } from '../composables/useLocaPolygonLayer'
import { cancelRenderFrame, scheduleRenderFrame } from '../render-scheduler'

interface PolygonLayerProps {
  source: PolygonSource
  style?: LocaLayerStyle
  layerStyle?: LocaLayerStyle
  options?: LocaPolygonLayerOptions
  events?: Record<string, (event: any) => void>
  autoRender?: boolean
}

defineOptions({
  name: 'AmapLocaPolygonLayer',
})

const props = withDefaults(defineProps<PolygonLayerProps>(), {
  autoRender: true,
})

const containerRef = inject<ShallowRef<LocaContainer | null> | null>('amapLocaContainer', null)
if (!containerRef)
  throw new Error('[amap-vue] <AmapLocaPolygonLayer> must be used inside an <AmapLocaProvider>.')

const layerApi = useLocaPolygonLayer(() => containerRef.value ?? null, props.options)

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
  () => props.source,
  (value) => {
    layerApi.setData(value)
    scheduleRender()
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
  () => props.options,
  (value) => {
    if (!value)
      return
    const instance = layerApi.ensureLayer()
    if (instance.setOptions)
      instance.setOptions(value)
  },
  { immediate: true, deep: true },
)

let registeredEvents = new Map<string, (payload: any) => void>()
watch(
  () => props.events,
  (value) => {
    registeredEvents.forEach((handler, type) => {
      layerApi.off(type, handler)
    })
    registeredEvents = new Map()
    if (value) {
      Object.entries(value).forEach(([type, handler]) => {
        if (typeof handler === 'function') {
          layerApi.on(type, handler)
          registeredEvents.set(type, handler)
        }
      })
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
  registeredEvents.forEach((handler, type) => {
    layerApi.off(type, handler)
  })
  registeredEvents.clear()
  layerApi.destroy()
})
</script>

<template>
  <slot />
</template>
