<script setup lang="ts">
import { AmapLayerGroup, AmapMap } from '@amap-vue/core'
import { loader } from '@amap-vue/shared'
import { computed, ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const center: [number, number] = [116.397, 39.908]
const roads = shallowRef<AMap.TileLayer.RoadNet>()
const satellite = shallowRef<AMap.TileLayer.Satellite>()
const includeSatellite = ref(true)
const visible = ref(true)
const layers = computed(() => {
  if (!roads.value || !satellite.value)
    return []
  return includeSatellite.value
    ? [satellite.value, roads.value]
    : [roads.value]
})

function initialize() {
  const AMap = loader.get()
  if (AMap && !roads.value) {
    satellite.value = new AMap.TileLayer.Satellite({ zIndex: 10 })
    roads.value = new AMap.TileLayer.RoadNet({ zIndex: 11 })
  }
}
</script>

<template>
  <div v-if="props.enabled">
    <div class="group-actions">
      <label><input v-model="visible" type="checkbox"> 显示整个图层组</label>
      <label><input v-model="includeSatellite" type="checkbox"> 包含卫星图层</label>
      <span role="status">{{ layers.length }} 个图层</span>
    </div>
    <AmapMap class="group-map" :center="center" :zoom="14" @ready="initialize">
      <AmapLayerGroup :layers="layers" :visible="visible" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览图层分组。
  </p>
</template>

<style scoped>
.group-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  margin-bottom: 8px;
}

.group-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
