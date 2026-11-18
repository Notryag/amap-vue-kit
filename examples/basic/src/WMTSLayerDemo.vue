<script setup lang="ts">
import { AmapMap, AmapWMTSLayer } from '@amap-vue/core'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const url = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi'
const center: [number, number] = [-109.5, 38.7]
const zooms: [number, number] = [2, 8]
const layer = ref('BlueMarble_NextGeneration')
const visible = ref(true)
const params = computed(() => ({
  Layer: layer.value,
  Version: '1.0.0',
  Style: 'default',
  Format: 'image/jpeg',
  TileMatrixSet: 'GoogleMapsCompatible_Level8',
}))
</script>

<template>
  <div v-if="props.enabled">
    <div class="wmts-actions">
      <label>
        NASA 影像
        <select v-model="layer">
          <option value="BlueMarble_NextGeneration">蓝色星球</option>
          <option value="BlueMarble_ShadedRelief_Bathymetry">地形与海底地形</option>
        </select>
      </label>
      <label><input v-model="visible" type="checkbox"> 显示影像</label>
    </div>
    <AmapMap class="wmts-map" :center="center" :zoom="5">
      <AmapWMTSLayer :url="url" :params="params" :zooms="zooms" :opacity="0.8" :visible="visible" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览 WMTS 图层。
  </p>
</template>

<style scoped>
.wmts-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.wmts-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
