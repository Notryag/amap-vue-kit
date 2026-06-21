<script setup lang="ts">
import { shallowRef } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

interface LocaDemoPoint {
  lng: number
  lat: number
  value: number
  name: string
}

const sampleData = [
  { lng: 116.397, lat: 39.908, value: 80, name: '前门' },
  { lng: 116.405, lat: 39.912, value: 60, name: '东长安街' },
  { lng: 116.388, lat: 39.905, value: 45, name: '西单' },
  { lng: 116.414, lat: 39.91, value: 70, name: '王府井' },
]

const currentMap = shallowRef<AMap.Map | null>(null)
const pointStyle = {
  radius: 12,
  unit: 'px',
  color: (item: LocaDemoPoint) => item.value > 65 ? '#f97316' : '#2563eb',
  borderColor: 'rgba(15, 23, 42, 0.45)',
  borderWidth: 1,
}

const { container, hasKey, ready } = useHookDemoMap(() => ({
  center: [116.404, 39.912],
  zoom: 12,
  viewMode: '3D',
}), { loaderOptions: { loca: true } })

ready((mapInstance) => {
  currentMap.value = mapInstance
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      配置 <code>VITE_AMAP_KEY</code> 后预览 Loca 可视化。
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <span>Loca 点图层使用 WebGL 渲染数据点，适合城市热区、门店分布和实时态势面板。</span>
      </div>
      <AmapLocaProvider v-if="currentMap" :map="currentMap">
        <AmapLocaPointLayer
          :data="sampleData"
          :layer-style="pointStyle"
        />
      </AmapLocaProvider>
    </template>
  </div>
</template>
