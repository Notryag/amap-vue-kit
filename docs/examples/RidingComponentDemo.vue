<script setup lang="ts">
import { AmapMap, AmapRiding } from '@amap-vue/core'
import { shallowRef } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.Riding'] })

const center: [number, number] = [116.397, 39.908]
const origin = '天安门'
const destination = '北海公园'

const map = shallowRef<AMap.Map | null>(null)

function handleReady(instance: AMap.Map) {
  map.value = instance
}
</script>

<template>
  <div class="amap-demo amap-demo--split">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>AmapRiding</code>.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="14" @ready="handleReady" />
      </div>
      <div class="amap-demo__sidebar">
        <AmapRiding :map="map" :origin="origin" :destination="destination" />
        <p class="amap-demo__muted">
          骑行路线会自动避开禁止骑行的道路。
        </p>
      </div>
    </template>
  </div>
</template>
