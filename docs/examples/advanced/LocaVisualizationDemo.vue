<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { onBeforeUnmount, ref } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

const locaContainer = ref<any>(null)
const scatterLayer = ref<any>(null)

const sampleData = [
  { lnglat: [116.397, 39.908], value: 80 },
  { lnglat: [116.405, 39.912], value: 60 },
  { lnglat: [116.388, 39.905], value: 45 },
  { lnglat: [116.414, 39.91], value: 70 },
]

const { container, hasKey, ready } = useHookDemoMap(() => ({
  center: [116.404, 39.912],
  zoom: 12,
  viewMode: '3D',
}), { loaderOptions: { loca: true } })

async function setupLoca(mapInstance: AMap.Map) {
  await loader.load()
  await loader.load({ loca: true })
  const Loca = (window as any).Loca
  if (!Loca)
    return

  const container = new Loca.Container({ map: mapInstance })
  locaContainer.value = container
  const scatter = new Loca.ScatterLayer({ container, zIndex: 200 })
  scatterLayer.value = scatter
  scatter.setData(sampleData, {
    lnglat: 'lnglat',
    value: 'value',
  })
  scatter.setOptions({
    style: {
      radius: 12,
      unit: 'px',
      color: (item: any) => (item.value > 65 ? '#f97316' : '#60a5fa'),
      borderColor: 'rgba(15, 23, 42, 0.5)',
      borderWidth: 1,
    },
  })
  scatter.render()
}

ready(async (mapInstance) => {
  if (mapInstance)
    await setupLoca(mapInstance)
})

onBeforeUnmount(() => {
  scatterLayer.value?.destroy()
  scatterLayer.value = null
  locaContainer.value?.destroy?.()
  locaContainer.value = null
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the Loca visualization.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        Loca renders data-driven scatter points with WebGL. Increase the dataset to visualise hotspots without creating thousands
        of DOM nodes.
      </div>
    </template>
  </div>
</template>
