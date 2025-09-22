<script setup lang="ts">
import { useHeatMap } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const radius = ref(28)
const intensity = ref(1)
const palette = ref<'cool' | 'warm'>('warm')

const basePoints: AMap.HeatMapDataPoint[] = [
  { lng: 116.397, lat: 39.908, count: 80 },
  { lng: 116.41, lat: 39.912, count: 60 },
  { lng: 116.392, lat: 39.9, count: 45 },
  { lng: 116.405, lat: 39.92, count: 72 },
  { lng: 116.415, lat: 39.905, count: 55 },
]

const gradient = computed(() => (palette.value === 'cool'
  ? { 0.3: '#38bdf8', 0.6: '#6366f1', 1: '#c084fc' }
  : { 0.3: '#fde047', 0.6: '#f97316', 1: '#ef4444' }))

const dataset = computed(() => basePoints.map(point => ({
  ...point,
  count: Math.min(100, Math.round(point.count * intensity.value)),
})))

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.404, 39.912],
  zoom: 12,
}), { plugins: ['AMap.HeatMap'] })

useHeatMap(() => map.value, () => ({
  data: dataset.value,
  radius: radius.value,
  gradient: gradient.value,
  max: 100,
  visible: true,
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useHeatMap</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Radius
          <input v-model.number="radius" type="range" min="12" max="60">
        </label>
        <label>
          Intensity
          <input v-model.number="intensity" type="range" min="0.5" max="1.5" step="0.1">
        </label>
        <label>
          Palette
          <select v-model="palette">
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
          </select>
        </label>
      </div>
    </template>
  </div>
</template>
