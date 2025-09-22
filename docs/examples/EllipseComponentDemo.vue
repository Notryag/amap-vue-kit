<script setup lang="ts">
import { AmapEllipse, AmapMap } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = ref<[number, number]>([116.406, 39.912])
const radiusX = ref(900)
const radiusY = ref(500)
const strokeColor = ref('#fd7e14')
const fillOpacity = ref(0.3)

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
      Provide <code>VITE_AMAP_KEY</code> to preview the ellipse overlay.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="13">
          <AmapEllipse :center="center" :radius="[radiusX, radiusY]" :options="options" />
        </AmapMap>
      </div>
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
