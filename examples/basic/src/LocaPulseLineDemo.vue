<script setup lang="ts">
import type { PulseLineItem } from '@amap-vue/loca'
import { AmapMap } from '@amap-vue/core'
import { AmapLocaProvider, AmapLocaPulseLineLayer } from '@amap-vue/loca'
import { ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})
const map = shallowRef<AMap.Map | null>(null)
const duration = ref(2200)

const routes: PulseLineItem[] = [
  {
    path: [
      [116.38, 39.905],
      [116.395, 39.905],
      [116.395, 39.921],
      [116.42, 39.921],
    ],
  },
  {
    path: [
      [116.383, 39.928],
      [116.409, 39.928],
      [116.409, 39.909],
      [116.425, 39.909],
    ],
  },
]
</script>

<template>
  <div>
    <p v-if="!props.enabled">
      配置 <code>VITE_AMAP_KEY</code> 后预览脉冲轨迹线。
    </p>
    <template v-else>
      <AmapMap
        class="pulse-map"
        :center="[116.403, 39.917]"
        :zoom="13"
        view-mode="3D"
        :loader-options="{ loca: true }"
        @ready="map = $event"
      >
        <AmapLocaProvider v-if="map" :map="map" animate>
          <AmapLocaPulseLineLayer
            :data="routes"
            :layer-style="{
              lineWidth: 5,
              headColor: '#2563eb',
              trailColor: 'rgba(37, 99, 235, 0.12)',
              interval: 0.5,
              duration,
            }"
          />
        </AmapLocaProvider>
      </AmapMap>
      <label>
        脉冲时长 {{ duration }} ms
        <input v-model.number="duration" type="range" min="800" max="4000" step="200">
      </label>
    </template>
  </div>
</template>

<style scoped>
.pulse-map {
  width: 100%;
  height: clamp(260px, 45vw, 360px);
}
</style>
