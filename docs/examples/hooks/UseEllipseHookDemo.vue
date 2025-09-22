<script setup lang="ts">
import { useEllipse } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const center = ref<[number, number]>([116.406, 39.912])
const radiusX = ref(900)
const radiusY = ref(500)
const strokeColor = ref('#fd7e14')
const fillOpacity = ref(0.3)

const options = computed(() => ({
  center: center.value,
  radius: [radiusX.value, radiusY.value] as [number, number],
  strokeColor: strokeColor.value,
  strokeWeight: 2,
  fillColor: strokeColor.value,
  fillOpacity: fillOpacity.value,
}))

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: center.value,
  zoom: 13,
}))

useEllipse(() => map.value, options)
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useEllipse</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Major axis (m)
          <input v-model.number="radiusX" type="range" min="400" max="1600" step="50">
        </label>
        <label>
          Minor axis (m)
          <input v-model.number="radiusY" type="range" min="300" max="1200" step="50">
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
