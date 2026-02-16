<script setup lang="ts">
import { AmapMap, AmapWalking } from '@amap-vue/core'
import { shallowRef } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.Walking'] })

const center: [number, number] = [116.397, 39.908]
const origin = '天安门'
const destination = '景山公园'

const map = shallowRef<AMap.Map | null>(null)

function handleReady(instance: AMap.Map) {
  map.value = instance
}
</script>

<template>
  <div class="amap-demo amap-demo--split">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>AmapWalking</code>.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="14" @ready="handleReady" />
      </div>
      <div class="amap-demo__sidebar">
        <AmapWalking :map="map" :origin="origin" :destination="destination" />
        <p class="amap-demo__muted">
          步行路线支持直接输入地址或 POI 名称。
        </p>
      </div>
    </template>
  </div>
</template>
