<script setup lang="ts">
import { AmapMap, AmapWMSLayer } from '@amap-vue/core'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const url = 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi'
const center: [number, number] = [-109.5, 38.7]
const layer = ref('BlueMarble_ShadedRelief_Bathymetry')
const opacity = ref(0.8)
const visible = ref(true)
const params = computed(() => ({
  LAYERS: layer.value,
  VERSION: '1.3.0',
  FORMAT: 'image/png',
}))
</script>

<template>
  <div v-if="props.enabled">
    <div class="wms-actions">
      <label>
        NASA 影像
        <select v-model="layer">
          <option value="BlueMarble_ShadedRelief_Bathymetry">地形与海底地形</option>
          <option value="BlueMarble_NextGeneration">蓝色星球</option>
        </select>
      </label>
      <label>不透明度 <input v-model.number="opacity" type="range" min="0" max="1" step="0.1"></label>
      <label><input v-model="visible" type="checkbox"> 显示影像</label>
    </div>
    <AmapMap class="wms-map" :center="center" :zoom="5">
      <AmapWMSLayer :url="url" :params="params" :opacity="opacity" :visible="visible" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览 WMS 图层。
  </p>
</template>

<style scoped>
.wms-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.wms-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
