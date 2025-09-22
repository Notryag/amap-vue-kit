<script setup lang="ts">
import { useHeatMap } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

const radius = ref(30)
const max = ref(80)
const gradientType = ref<'warm' | 'cool'>('warm')

const basePoints = [
  [116.397, 39.908, 50],
  [116.405, 39.912, 70],
  [116.388, 39.905, 40],
  [116.414, 39.91, 65],
  [116.398, 39.9, 30],
]

const dataset = computed(() => basePoints.map(([lng, lat, count]) => ({ lng, lat, count })))
const gradient = computed(() => gradientType.value === 'warm'
  ? { 0.4: '#fb923c', 0.7: '#f97316', 1: '#ef4444' }
  : { 0.4: '#38bdf8', 0.7: '#6366f1', 1: '#c084fc' })

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.404, 39.912],
  zoom: 12,
}), { plugins: ['AMap.HeatMap'] })

useHeatMap(() => map.value, () => ({
  data: dataset.value,
  radius: radius.value,
  max: max.value,
  gradient: gradient.value,
  visible: true,
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the heatmap recipe.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Radius
          <input v-model.number="radius" type="range" min="20" max="60">
        </label>
        <label>
          Max intensity
          <input v-model.number="max" type="range" min="40" max="100">
        </label>
        <label>
          Palette
          <select v-model="gradientType">
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
          </select>
        </label>
      </div>
    </template>
  </div>
</template>
