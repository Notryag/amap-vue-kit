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
      配置 <code>VITE_AMAP_KEY</code> 后预览瓦片图层 hooks。
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="showBase" type="checkbox">
          基础瓦片
        </label>
        <label>
          <input v-model="showTraffic" type="checkbox">
          实时路况
        </label>
        <label>
          <input v-model="showRoadNet" type="checkbox">
          路网
        </label>
        <label>
          <input v-model="showSatellite" type="checkbox">
          卫星影像
        </label>
      </div>
    </template>
  </div>
</template>
