<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { computed, reactive, ref } from 'vue'

const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
if (key)
  loader.config({ key })

const center: [number, number] = [116.397, 39.908]
const hasKey = computed(() => Boolean(key))
const showHeatMap = ref(true)
const radius = ref(32)
const gradientKey = ref<'sunset' | 'ocean' | 'default'>('sunset')

const gradients = reactive<Record<'sunset' | 'ocean' | 'default', Record<string, string> | undefined>>({
  sunset: {
    '0.2': '#4c6ef5',
    '0.5': '#ff922b',
    '0.8': '#f03e3e',
    '1.0': '#c2255c',
  },
  ocean: {
    '0.2': '#64dfdf',
    '0.5': '#48bfe3',
    '0.8': '#5390d9',
    '1.0': '#6930c3',
  },
  default: undefined,
})

const gradient = computed(() => gradients[gradientKey.value])

const points: AMap.HeatMapDataPoint[] = [
  { lng: 116.397, lat: 39.908, count: 90 },
  { lng: 116.388, lat: 39.913, count: 55 },
  { lng: 116.406, lat: 39.92, count: 65 },
  { lng: 116.4, lat: 39.903, count: 40 },
  { lng: 116.409, lat: 39.905, count: 80 },
  { lng: 116.393, lat: 39.917, count: 50 },
]
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to see the live demo.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="12">
          <AmapHeatMap
            v-if="showHeatMap"
            :data="points"
            :radius="radius"
            :gradient="gradient"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="showHeatMap" type="checkbox">
          Show heat map
        </label>
        <label>
          Radius
          <select v-model.number="radius">
            <option :value="28">28 px</option>
            <option :value="32">32 px</option>
            <option :value="40">40 px</option>
          </select>
        </label>
        <label>
          Gradient
          <select v-model="gradientKey">
            <option value="sunset">Sunset</option>
            <option value="ocean">Ocean</option>
            <option value="default">Default</option>
          </select>
        </label>
      </div>
    </template>
  </div>
</template>
