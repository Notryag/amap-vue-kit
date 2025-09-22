<script setup lang="ts">
import { useMassMarkers } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const count = ref(500)
const palette = ref<'orange' | 'blue'>('orange')

const points = computed(() => Array.from({ length: count.value }, () => ({
  lnglat: [116.35 + Math.random() * 0.1, 39.87 + Math.random() * 0.1],
  name: 'Point',
})))

const style = computed<AMap.MassMarkersStyleOptions>(() => palette.value === 'orange'
  ? {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/icon/iconfont-location.png',
      size: [16, 16],
      anchor: [8, 8],
    }
  : {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/icon/iconfont-spot.png',
      size: [16, 16],
      anchor: [8, 8],
    })

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.4, 39.91],
  zoom: 12,
}))

useMassMarkers(() => map.value, () => ({
  data: points.value,
  style: style.value,
  options: { zIndex: 120 },
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useMassMarkers</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Points: {{ count }}
          <input v-model.number="count" type="range" min="100" max="1000" step="100">
        </label>
        <label>
          Palette
          <select v-model="palette">
            <option value="orange">Orange</option>
            <option value="blue">Blue</option>
          </select>
        </label>
      </div>
    </template>
  </div>
</template>
