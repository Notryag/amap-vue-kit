<template>
  <slot />
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'
import type { ShallowRef } from 'vue'
import type {
  LocaContainer,
  LocaLayerStyle,
  LocaPolygonLayerOptions,
} from '../types'
import type { PolygonSource } from '../composables/useLocaPolygonLayer'
import { useLocaPolygonLayer } from '../composables/useLocaPolygonLayer'

interface PolygonLayerProps {
  source: PolygonSource
  style?: LocaLayerStyle
  options?: LocaPolygonLayerOptions
  events?: Record<string, (event: any) => void>
  autoRender?: boolean
}

const props = withDefaults(defineProps<PolygonLayerProps>(), {
  autoRender: true,
})

const containerRef = inject<ShallowRef<LocaContainer | null> | null>('amapLocaContainer', null)
if (!containerRef)
  throw new Error('[amap-vue] <AmapLocaPolygonLayer> must be used inside an <AmapLocaProvider>.')

const layerApi = useLocaPolygonLayer(() => containerRef.value ?? null, props.options)

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
  () => props.source,
  (value) => {
    layerApi.setData(value)
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
    caf(pendingRender)
  registeredEvents.forEach((handler, type) => {
    layerApi.off(type, handler)
  })
  registeredEvents.clear()
  layerApi.destroy()
})
</script>
