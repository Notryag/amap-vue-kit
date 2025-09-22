<script setup lang="ts">
import type { MarkerClusterPoint } from '@amap-vue/hooks'
import { AmapMap, AmapMarkerCluster } from '@amap-vue/core'
import { ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.MarkerCluster'] })

const center: MarkerClusterPoint['position'] = [116.397, 39.908]
const points = ref<MarkerClusterPoint[]>(generatePoints(200))
const visible = ref(true)

function generatePoints(count: number): MarkerClusterPoint[] {
  const items: MarkerClusterPoint[] = []
  for (let index = 0; index < count; index++) {
    const lng = center[0] + (Math.random() - 0.5) * 0.6
    const lat = center[1] + (Math.random() - 0.5) * 0.6
    items.push({
      position: [Number(lng.toFixed(6)), Number(lat.toFixed(6))],
      extData: { id: index },
    })
  }
  return items
}

function regenerate() {
  points.value = generatePoints(200)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview marker clustering.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="11">
          <AmapMarkerCluster
            :points="points"
            :visible="visible"
            :options="{ gridSize: 80 }"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
        <button type="button" @click="regenerate">
          Regenerate points
        </button>
        <div>Total points: {{ points.length }}</div>
      </div>
    </template>
  </div>
</template>
