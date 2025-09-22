<script setup lang="ts">
import { AmapMap, AmapPolygon } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const polygonPath = ref<[[number, number], [number, number], [number, number], [number, number]]>([
  [116.384, 39.925],
  [116.421, 39.925],
  [116.43, 39.905],
  [116.39, 39.905],
])

const fillColor = ref('#1abc9c55')
const strokeColor = ref('#16a085')
const visible = ref(true)

const options = computed(() => ({
  fillColor: fillColor.value,
  strokeColor: strokeColor.value,
  strokeWeight: 3,
  fillOpacity: 0.35,
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the polygon.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="[116.405, 39.914]" :zoom="12">
          <AmapPolygon v-if="visible" :path="polygonPath" :options="options" />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Fill
          <input v-model="fillColor" type="color">
        </label>
        <label>
          Stroke
          <input v-model="strokeColor" type="color">
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
      </div>
    </template>
  </div>
</template>
