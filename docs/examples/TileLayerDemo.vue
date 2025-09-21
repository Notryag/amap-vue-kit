<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { computed, ref } from 'vue'

const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
if (key)
  loader.config({ key })

const center: [number, number] = [116.397, 39.908]
const zoom = 11
const showTraffic = ref(true)
const showRoadNet = ref(false)
const showSatellite = ref(false)
const hasKey = computed(() => Boolean(key))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to see the live demo.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="zoom">
          <AmapTrafficLayer v-if="showTraffic" auto-refresh />
          <AmapRoadNetLayer v-if="showRoadNet" />
          <AmapSatelliteLayer v-if="showSatellite" />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="showTraffic" type="checkbox">
          Traffic
        </label>
        <label>
          <input v-model="showRoadNet" type="checkbox">
          Road net
        </label>
        <label>
          <input v-model="showSatellite" type="checkbox">
          Satellite
        </label>
      </div>
    </template>
  </div>
</template>
