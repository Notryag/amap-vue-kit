<script setup lang="ts">
import type { MarkerClusterPoint } from '@amap-vue/hooks'

import { useMarkerClusterer } from '@amap-vue/hooks'
import { ref, watch } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const { container, hasKey, map } = useHookDemoMap({ plugins: ['AMap.MarkerCluster'] })

const points = ref<MarkerClusterPoint[]>(generatePoints(150))
const visible = ref(true)
const lastClick = ref<string>('—')

const cluster = useMarkerClusterer(() => map.value, () => ({
  points: points.value,
  gridSize: 80,
  visible: visible.value,
}))

cluster.on('click', (event: any) => {
  const count = event?.cluster?.getMarkers?.()?.length ?? 0
  lastClick.value = `${count} markers` as string
})

watch(points, (value) => {
  cluster.setPoints(value)
})

watch(visible, (value) => {
  if (value)
    cluster.show()
  else
    cluster.hide()
})

function generatePoints(count: number): MarkerClusterPoint[] {
  const items: MarkerClusterPoint[] = []
  for (let index = 0; index < count; index++) {
    const lng = 116.35 + Math.random() * 0.7
    const lat = 39.82 + Math.random() * 0.7
    items.push({ position: [Number(lng.toFixed(6)), Number(lat.toFixed(6))] })
  }
  return items
}

function regenerate() {
  points.value = generatePoints(150)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useMarkerClusterer</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
        <button type="button" @click="regenerate">
          Regenerate points
        </button>
        <div>Last click: {{ lastClick }}</div>
      </div>
    </template>
  </div>
</template>
