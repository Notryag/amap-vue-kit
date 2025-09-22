<script setup lang="ts">
import { useTileLayer } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

const provider = ref<'amap' | 'osm'>('amap')
const opacity = ref(1)

const tileUrl = computed(() => provider.value === 'osm'
  ? 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
  : undefined)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.397, 39.908],
  zoom: 12,
}))

useTileLayer(() => map.value, () => ({
  visible: provider.value === 'amap',
}))

useTileLayer(() => map.value, () => ({
  tileUrl: tileUrl.value,
  opacity: opacity.value,
  visible: provider.value === 'osm',
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview custom tile switching.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Provider
          <select v-model="provider">
            <option value="amap">AMap vector</option>
            <option value="osm">OpenStreetMap</option>
          </select>
        </label>
        <label v-if="provider === 'osm'">
          Opacity
          <input v-model.number="opacity" type="range" min="0.4" max="1" step="0.05">
        </label>
      </div>
    </template>
  </div>
</template>
