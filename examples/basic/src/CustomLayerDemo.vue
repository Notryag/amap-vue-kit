<script setup lang="ts">
import type { CustomLayerRenderContext } from '@amap-vue/hooks'
import { AmapCustomLayer, AmapMap } from '@amap-vue/core'
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const center: [number, number] = [116.3975, 39.9115]
const points: [number, number][] = [
  center,
  [116.382, 39.921],
  [116.418, 39.908],
]
const layer = ref<InstanceType<typeof AmapCustomLayer> | null>(null)
const radius = ref(12)

function draw({ canvas, map }: CustomLayerRenderContext) {
  const size = map.getSize()
  const width = size.getWidth()
  const height = size.getHeight()
  const ratio = window.devicePixelRatio || 1
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.style.pointerEvents = 'none'
  const pixelWidth = Math.round(width * ratio)
  const pixelHeight = Math.round(height * ratio)
  if (canvas.width !== pixelWidth)
    canvas.width = pixelWidth
  if (canvas.height !== pixelHeight)
    canvas.height = pixelHeight

  const context = canvas.getContext('2d')
  if (!context)
    return

  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#d946ef'
  context.strokeStyle = '#ffffff'
  context.lineWidth = 2
  for (const point of points) {
    const pixel = map.lngLatToContainer(point)
    context.beginPath()
    context.arc(pixel.getX(), pixel.getY(), radius.value, 0, Math.PI * 2)
    context.fill()
    context.stroke()
  }
}

watch(radius, () => layer.value?.redraw())
</script>

<template>
  <div v-if="props.enabled">
    <label>圆点半径 {{ radius }} px <input v-model.number="radius" type="range" min="6" max="30"></label>
    <AmapMap class="custom-map" :center="center" :zoom="13" view-mode="2D">
      <AmapCustomLayer ref="layer" :render="draw" always-render />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览自定义图层。
  </p>
</template>

<style scoped>
.custom-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
  margin-top: 8px;
}
</style>
