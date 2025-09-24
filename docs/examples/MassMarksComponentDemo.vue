<script setup lang="ts">
import { AmapMap, AmapMassMarks } from '@amap-vue/core'
import { ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.MassMarks'] })

const center: [number, number] = [116.397, 39.908]
const count = ref(800)
const data = ref(createData(count.value))

const style = [
  {
    url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
    anchor: [6, 6],
    size: [12, 12],
  },
  {
    url: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',
    anchor: [6, 6],
    size: [12, 12],
  },
]

function createData(total: number) {
  const items: Array<{ lnglat: [number, number], style: number }> = []
  for (let index = 0; index < total; index++) {
    const lng = center[0] + (Math.random() - 0.5) * 1.2
    const lat = center[1] + (Math.random() - 0.5) * 1.2
    items.push({
      lnglat: [Number(lng.toFixed(6)), Number(lat.toFixed(6))],
      style: index % style.length,
    })
  }
  return items
}

function regenerate() {
  data.value = createData(count.value)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview mass markers.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="11">
          <AmapMassMarks :data="data" :style="style" :options="{ zooms: [3, 19] }" />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Points
          <select v-model.number="count" @change="regenerate">
            <option :value="400">400</option>
            <option :value="800">800</option>
            <option :value="1500">1500</option>
          </select>
        </label>
        <button type="button" @click="regenerate">
          Shuffle points
        </button>
        <div>Total markers: {{ data.length }}</div>
      </div>
    </template>
  </div>
</template>
