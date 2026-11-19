<script setup lang="ts">
import type { VectorOverlay } from '@amap-vue/hooks'
import { AmapMap, AmapVectorLayer } from '@amap-vue/core'
import { loader } from '@amap-vue/shared'
import { ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const center: [number, number] = [116.3995, 39.909]
const layer = ref<InstanceType<typeof AmapVectorLayer> | null>(null)
const main = shallowRef<VectorOverlay[]>([])
const extra = shallowRef<VectorOverlay[]>([])
const initialVisible = ref(false)
const extraVisible = ref(false)
const visible = ref(true)
const count = ref(0)

function initialize() {
  const sdk = loader.get()
  if (!sdk)
    return
  main.value = [
    new sdk.Polygon({
      path: [
        [116.392, 39.911],
        [116.395, 39.9135],
        [116.399, 39.9115],
        [116.396, 39.909],
      ],
      fillColor: '#0e7490',
      fillOpacity: 0.45,
      strokeColor: '#0e7490',
    }),
    new sdk.Polyline({
      path: [
        [116.396, 39.909],
        [116.399, 39.9065],
        [116.404, 39.908],
        [116.4055, 39.911],
      ],
      strokeColor: '#5b21b6',
      strokeWeight: 5,
    }),
  ]
  extra.value = [
    new sdk.CircleMarker({
      center: [116.396, 39.909],
      radius: 8,
      fillColor: '#b45309',
      fillOpacity: 1,
      strokeColor: '#ffffff',
    }),
    new sdk.CircleMarker({
      center: [116.4055, 39.911],
      radius: 8,
      fillColor: '#b45309',
      fillOpacity: 1,
      strokeColor: '#ffffff',
    }),
  ]
  addMain()
}

function addMain() {
  layer.value?.add(main.value)
  initialVisible.value = true
  updateCount()
}

function togglePoints() {
  if (extraVisible.value)
    layer.value?.remove(extra.value)
  else
    layer.value?.add(extra.value)
  extraVisible.value = !extraVisible.value
  updateCount()
}

function clear() {
  layer.value?.clear()
  initialVisible.value = false
  extraVisible.value = false
  updateCount()
}

function updateCount() {
  count.value = [
    ...main.value,
    ...extra.value,
  ].filter(vector => layer.value?.has(vector)).length
}
</script>

<template>
  <div v-if="props.enabled">
    <div class="vector-actions">
      <button type="button" :disabled="!main.length || initialVisible" @click="addMain">
        添加路线和区域
      </button>
      <button type="button" :disabled="!extra.length" @click="togglePoints">
        {{ extraVisible ? '移除两个点' : '添加两个点' }}
      </button>
      <button type="button" :disabled="!count" @click="clear">
        清空
      </button>
      <label><input v-model="visible" type="checkbox"> 显示图层</label>
      <span role="status">{{ count }} 个覆盖物</span>
    </div>
    <AmapMap class="vector-map" :center="center" :zoom="15">
      <AmapVectorLayer ref="layer" :visible="visible" @ready="initialize" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览矢量图层。
  </p>
</template>

<style scoped>
.vector-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.vector-actions button {
  border: 1px solid currentColor;
  border-radius: 6px;
  padding: 4px 10px;
}

.vector-actions button:disabled {
  opacity: 0.5;
}

.vector-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
