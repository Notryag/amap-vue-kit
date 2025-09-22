<script setup lang="ts">
import { useOverlayGroup } from '@amap-vue/hooks'
import { loader } from '@amap-vue/shared'
import { ref, watch } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const count = ref(20)
const visible = ref(true)
const overlays = ref<AMap.Marker[]>([])
const allMarkers = ref<AMap.Marker[]>([])

const { container, hasKey, map, ready } = useHookDemoMap(() => ({
  center: [116.4, 39.91],
  zoom: 12,
}))

ready(async () => {
  const AMapInstance = loader.get() ?? await loader.load()
  if (!AMapInstance)
    return
  const markers = Array.from({ length: 80 }, (_, index) => new AMapInstance.Marker({
    position: [116.37 + Math.random() * 0.06, 39.89 + Math.random() * 0.06],
    extData: { id: index },
  }))
  allMarkers.value = markers
  overlays.value = markers.slice(0, count.value)
})

watch(count, (value) => {
  overlays.value = allMarkers.value.slice(0, value)
})

useOverlayGroup(() => map.value, () => ({
  overlays: overlays.value,
  visible: visible.value,
}))

function shuffleMarkers() {
  overlays.value = [...overlays.value].sort(() => Math.random() - 0.5)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useOverlayGroup</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Markers: {{ count }}
          <input v-model.number="count" type="range" min="5" max="60" step="5">
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
        <button type="button" @click="shuffleMarkers">
          Shuffle order
        </button>
      </div>
    </template>
  </div>
</template>
