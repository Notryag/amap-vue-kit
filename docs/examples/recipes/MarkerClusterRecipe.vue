<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { onBeforeUnmount, ref, watch } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

const gridSize = ref(80)
const averageCenter = ref(true)
const cluster = ref<AMap.MarkerClusterer | null>(null)

const { container, hasKey, ready } = useHookDemoMap(() => ({
  center: [116.4, 39.91],
  zoom: 11,
}))

ready(async (mapInstance) => {
  const AMapInstance = loader.get() ?? await loader.load()
  const points = Array.from({ length: 200 }, () => new AMapInstance.Marker({
    position: [116.35 + Math.random() * 0.1, 39.87 + Math.random() * 0.1],
  }))
  mapInstance.plugin(['AMap.MarkerClusterer'], () => {
    cluster.value = new (AMapInstance as any).MarkerClusterer(mapInstance, points, {
      gridSize: gridSize.value,
      averageCenter: averageCenter.value,
    })
  })
})

watch([gridSize, averageCenter], () => {
  const instance = cluster.value
  if (!instance)
    return
  instance.setGridSize(gridSize.value)
  instance.setAverageCenter?.(averageCenter.value)
})

onBeforeUnmount(() => {
  cluster.value?.setMap(null as any)
  cluster.value = null
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview marker clustering.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Grid size
          <input v-model.number="gridSize" type="range" min="40" max="120" step="10">
        </label>
        <label>
          <input v-model="averageCenter" type="checkbox">
          Average cluster center
        </label>
      </div>
    </template>
  </div>
</template>
