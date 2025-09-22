<script setup lang="ts">
import { AmapMap, AmapPolyline } from '@amap-vue/core'
import { computed, ref, watch } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const basePath: [number, number][] = [
  [116.384, 39.925],
  [116.403, 39.92],
  [116.421, 39.915],
  [116.437, 39.92],
]

const path = ref(basePath)
const color = ref('#4b8bff')
const weight = ref(5)
const dash = ref(false)

const options = computed(() => ({
  strokeColor: color.value,
  strokeWeight: weight.value,
  strokeStyle: dash.value ? 'dashed' : 'solid',
  showDir: dash.value,
}))

watch(dash, (value) => {
  if (value)
    weight.value = Math.max(weight.value, 6)
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the polyline.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="[116.405, 39.92]" :zoom="12">
          <AmapPolyline :path="path" :options="options" />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Color
          <input v-model="color" type="color">
        </label>
        <label>
          Width
          <input v-model.number="weight" type="range" min="2" max="12">
        </label>
        <label>
          <input v-model="dash" type="checkbox">
          Show direction arrows
        </label>
      </div>
    </template>
  </div>
</template>
