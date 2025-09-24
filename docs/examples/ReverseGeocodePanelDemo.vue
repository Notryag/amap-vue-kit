<script setup lang="ts">
import { AmapMap, AmapMarker, AmapReverseGeocodePanel } from '@amap-vue/core'
import { ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

useDemoLoader({ plugins: ['AMap.Geocoder'] })

const panelRef = ref<any>(null)
const position = ref<[number, number] | null>([116.397, 39.909])
const address = ref('天安门广场')

function handleMapClick(event: any) {
  const lnglat = event?.lnglat
  if (!lnglat)
    return
  position.value = [Number(lnglat.lng.toFixed(6)), Number(lnglat.lat.toFixed(6))]
  panelRef.value?.reverse(position.value)
}

function searchAddress() {
  panelRef.value?.search(address.value)
}
</script>

<template>
  <div class="amap-demo amap-demo--split">
    <div class="amap-demo__map">
      <AmapMap :center="position ?? [116.397, 39.909]" :zoom="13" @click="handleMapClick">
        <AmapMarker v-if="position" :position="position" />
      </AmapMap>
    </div>
    <div class="amap-demo__sidebar">
      <label>
        地址关键字
        <input v-model="address" placeholder="输入地址关键字">
      </label>
      <button type="button" @click="searchAddress">
        搜索地址
      </button>
      <AmapReverseGeocodePanel ref="panelRef" :position="position" />
    </div>
  </div>
</template>
