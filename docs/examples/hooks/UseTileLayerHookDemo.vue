<script setup lang="ts">
import { useRoadNetLayer, useSatelliteLayer, useTileLayer, useTrafficLayer } from '@amap-vue/hooks'
import { ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const showBase = ref(true)
const showTraffic = ref(true)
const showRoadNet = ref(false)
const showSatellite = ref(false)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.397, 39.908],
  zoom: 11,
}))

useTileLayer(() => map.value, () => ({ visible: showBase.value }))
useTrafficLayer(() => map.value, () => ({ visible: showTraffic.value, autoRefresh: true }))
useRoadNetLayer(() => map.value, () => ({ visible: showRoadNet.value }))
useSatelliteLayer(() => map.value, () => ({ visible: showSatellite.value }))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview tile layer hooks.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="showBase" type="checkbox">
          Base tiles
        </label>
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
