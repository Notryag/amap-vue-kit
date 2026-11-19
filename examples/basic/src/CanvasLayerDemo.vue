<script setup lang="ts">
import type { CanvasLayerBounds } from '@amap-vue/hooks'
import { AmapCanvasLayer, AmapMap } from '@amap-vue/core'
import { onMounted, ref, shallowRef, watch } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const center: [number, number] = [116.3975, 39.9115]
const bounds: CanvasLayerBounds = [
  [116.38, 39.90],
  [116.415, 39.923],
]
const canvas = shallowRef<HTMLCanvasElement | null>(null)
const layer = ref<InstanceType<typeof AmapCanvasLayer> | null>(null)
const visible = ref(true)
const color = ref('#7c3aed')

function draw(element: HTMLCanvasElement) {
  const context = element.getContext('2d')
  if (!context)
    return

  const { width, height } = element
  context.clearRect(0, 0, width, height)
  context.fillStyle = `${color.value}40`
  context.fillRect(0, 0, width, height)
  context.strokeStyle = color.value
  context.lineWidth = 6
  context.strokeRect(3, 3, width - 6, height - 6)
  context.beginPath()
  context.moveTo(width / 2, 0)
  context.lineTo(width / 2, height)
  context.moveTo(0, height / 2)
  context.lineTo(width, height / 2)
  context.stroke()
}

onMounted(() => {
  const element = document.createElement('canvas')
  element.width = 512
  element.height = 384
  draw(element)
  canvas.value = element
})

watch(color, () => {
  if (canvas.value) {
    draw(canvas.value)
    layer.value?.refresh()
  }
})
</script>

<template>
  <div v-if="props.enabled">
    <div class="canvas-actions">
      <label>
        画布配色
        <select v-model="color">
          <option value="#7c3aed">紫色</option>
          <option value="#059669">绿色</option>
        </select>
      </label>
      <label><input v-model="visible" type="checkbox"> 显示画布</label>
    </div>
    <AmapMap class="canvas-map" :center="center" :zoom="13" view-mode="3D">
      <AmapCanvasLayer ref="layer" :canvas="canvas" :bounds="bounds" :visible="visible" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览 Canvas 图层。
  </p>
</template>

<style scoped>
.canvas-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.canvas-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
