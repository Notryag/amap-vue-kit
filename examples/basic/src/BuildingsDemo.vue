<script setup lang="ts">
import { AmapBuildings, AmapMap } from '@amap-vue/core'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const center: [number, number] = [116.465, 39.914]
const options: AMap.BuildingsOptions = { heightFactor: 1.2 }
const area: [number, number][] = [
  [116.46, 39.908],
  [116.471, 39.908],
  [116.471, 39.919],
  [116.46, 39.919],
  [116.46, 39.908],
]
const palettes = {
  blue: { roof: '#60a5fa', wall: '#1d4ed8' },
  orange: { roof: '#fdba74', wall: '#c2410c' },
}
const palette = ref<keyof typeof palettes>('blue')
const visible = ref(true)
const layerStyle = computed<AMap.BuildingsStyle>(() => ({
  areas: [
    {
      path: area,
      color1: palettes[palette.value].roof,
      color2: palettes[palette.value].wall,
      rejectTexture: true,
    },
  ],
}))
</script>

<template>
  <div v-if="props.enabled">
    <div class="buildings-actions">
      <label>
        楼块配色
        <select v-model="palette">
          <option value="blue">蓝色</option>
          <option value="orange">橙色</option>
        </select>
      </label>
      <label><input v-model="visible" type="checkbox"> 显示楼块</label>
    </div>
    <AmapMap
      class="buildings-map"
      :center="center"
      :zoom="17"
      :pitch="48"
      :rotation="-20"
      view-mode="3D"
      :show-building-block="false"
      map-style="amap://styles/light"
    >
      <AmapBuildings :options="options" :layer-style="layerStyle" :visible="visible" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览 3D 楼块。
  </p>
</template>

<style scoped>
.buildings-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.buildings-map {
  width: 100%;
  height: clamp(310px, 50vw, 450px);
}
</style>
