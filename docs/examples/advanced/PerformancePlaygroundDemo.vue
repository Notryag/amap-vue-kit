<script setup lang="ts">
import { useOverlayGroup } from '@amap-vue/hooks'
import { loader } from '@amap-vue/shared'
import { ref, watch } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

const batches = ref(10)
const overlays = ref<AMap.Marker[]>([])
const allMarkers = ref<AMap.Marker[]>([])

const { container, hasKey, map, ready } = useHookDemoMap(() => ({
  center: [116.4, 39.91],
  zoom: 11,
}))

ready(async () => {
  const AMapInstance = loader.get() ?? await loader.load()
  const markers = Array.from({ length: 1000 }, (_, index) => new AMapInstance.Marker({
    position: [116.35 + Math.random() * 0.1, 39.86 + Math.random() * 0.1],
    extData: { id: index },
  }))
  allMarkers.value = markers
  overlays.value = markers.slice(0, batches.value * 10)
})

watch(batches, (value) => {
  overlays.value = allMarkers.value.slice(0, value * 10)
})

const overlayGroup = useOverlayGroup(() => map.value, () => ({
  overlays: overlays.value,
}))

function clear() {
  overlays.value = []
  overlayGroup.clearOverlays()
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to explore the performance tuning tips.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Batches (10 markers each)
          <input v-model.number="batches" type="range" min="5" max="60">
        </label>
        <div>Total markers: {{ overlays.length }}</div>
        <button type="button" @click="clear">
          Clear overlays
        </button>
      </div>
    </template>
  </div>
</template>
