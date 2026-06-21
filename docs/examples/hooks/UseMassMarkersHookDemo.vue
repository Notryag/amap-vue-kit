<script setup lang="ts">
import type { MassDataLike, MassMarkersStyleLike } from '@amap-vue/hooks'
import { useMassMarkers } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const count = ref(500)
const palette = ref<'orange' | 'blue'>('orange')

const points = computed<MassDataLike[]>(() => Array.from({ length: count.value }, () => ({
  lnglat: [116.35 + Math.random() * 0.1, 39.87 + Math.random() * 0.1] as [number, number],
  name: '点位',
})))

const style = computed<MassMarkersStyleLike>(() => palette.value === 'orange'
  ? {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/icon/iconfont-location.png',
      size: [16, 16],
      anchor: [8, 8] as any,
    }
  : {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/icon/iconfont-spot.png',
      size: [16, 16],
      anchor: [8, 8] as any,
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
      配置 <code>VITE_AMAP_KEY</code> 后预览 <code>useMassMarkers</code>。
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          点位数量：{{ count }}
          <input v-model.number="count" type="range" min="100" max="1000" step="100">
        </label>
        <label>
          配色
          <select v-model="palette">
            <option value="orange">橙色</option>
            <option value="blue">蓝色</option>
          </select>
        </label>
      </div>
    </template>
  </div>
</template>
