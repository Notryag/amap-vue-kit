<script setup lang="ts">
import type { FlexibleCreateTile } from '@amap-vue/hooks'
import { AmapFlexibleLayer, AmapMap } from '@amap-vue/core'
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const center: [number, number] = [116.3975, 39.9115]
const layer = ref<InstanceType<typeof AmapFlexibleLayer> | null>(null)
const visible = ref(true)
const color = ref('#7c3aed')
const tileSize = 256

const createTile: FlexibleCreateTile = (x, y, z, success, fail) => {
  const canvas = document.createElement('canvas')
  canvas.width = tileSize
  canvas.height = tileSize
  const context = canvas.getContext('2d')
  if (!context) {
    fail()
    return
  }

  if ((x + y) % 2 === 0) {
    context.fillStyle = `${color.value}25`
    context.fillRect(0, 0, tileSize, tileSize)
  }
  context.strokeStyle = color.value
  context.lineWidth = 2
  context.strokeRect(1, 1, tileSize - 2, tileSize - 2)
  context.fillStyle = color.value
  context.fillRect(10, 10, 145, 24)
  context.font = '13px monospace'
  context.fillStyle = '#ffffff'
  context.fillText(`${z} / ${x} / ${y}`, 17, 26)
  success(canvas)
}

watch(color, () => layer.value?.reload())
</script>

<template>
  <div v-if="props.enabled">
    <div class="flexible-actions">
      <label>
        网格配色
        <select v-model="color">
          <option value="#7c3aed">紫色</option>
          <option value="#047857">绿色</option>
        </select>
      </label>
      <label><input v-model="visible" type="checkbox"> 显示瓦片网格</label>
    </div>
    <AmapMap class="flexible-map" :center="center" :zoom="13">
      <AmapFlexibleLayer ref="layer" :create-tile="createTile" :tile-size="tileSize" :z-index="120" :visible="visible" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览自定义瓦片。
  </p>
</template>

<style scoped>
.flexible-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.flexible-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
