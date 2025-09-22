<script setup lang="ts">
import { AmapMap, AmapRectangle } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = ref<[number, number]>([116.397, 39.908])
const width = ref(0.06)
const height = ref(0.04)
const strokeColor = ref('#20c997')
const fillOpacity = ref(0.35)

const bounds = computed(() => {
  const [lng, lat] = center.value
  const halfWidth = width.value / 2
  const halfHeight = height.value / 2
  return [
    [Number((lng - halfWidth).toFixed(6)), Number((lat - halfHeight).toFixed(6))],
    [Number((lng + halfWidth).toFixed(6)), Number((lat + halfHeight).toFixed(6))],
  ] as [[number, number], [number, number]]
})

const options = computed(() => ({
  strokeColor: strokeColor.value,
  strokeWeight: 2,
  fillColor: strokeColor.value,
  fillOpacity: fillOpacity.value,
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the rectangle overlay.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="12">
          <AmapRectangle :bounds="bounds" :options="options" />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Width Δλ
          <input v-model.number="width" type="range" min="0.02" max="0.12" step="0.005">
        </label>
        <label>
          Height Δφ
          <input v-model.number="height" type="range" min="0.02" max="0.1" step="0.005">
        </label>
        <label>
          Stroke
          <input v-model="strokeColor" type="color">
        </label>
        <label>
          Fill opacity
          <input v-model.number="fillOpacity" type="range" min="0" max="0.8" step="0.05">
        </label>
      </div>
    </template>
  </div>
</template>
