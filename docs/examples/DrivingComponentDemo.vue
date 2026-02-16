<script setup lang="ts">
import { AmapDriving, AmapMap } from '@amap-vue/core'
import { shallowRef } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.Driving'] })

const center: [number, number] = [116.397, 39.908]
const origin = '天安门'
const destination = '故宫'

const map = shallowRef<AMap.Map | null>(null)

function handleReady(instance: AMap.Map) {
  map.value = instance
}
</script>

<template>
  <div class="amap-demo amap-demo--split">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>AmapDriving</code>.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="13" @ready="handleReady" />
      </div>
      <div class="amap-demo__sidebar">
        <AmapDriving :map="map" :origin="origin" :destination="destination" />
        <p class="amap-demo__muted">
          默认以“天安门”到“故宫”作为起终点，可在表单内重新输入并规划路线。
        </p>
      </div>
    </template>
  </div>
</template>
