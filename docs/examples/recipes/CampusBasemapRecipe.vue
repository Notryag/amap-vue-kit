<script setup lang="ts">
import { useImageLayer, useTileLayer } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

const overlay = ref<'plan' | 'heat'>('plan')
const opacity = ref(0.8)
const showBaseTiles = ref(false)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [121.49856, 31.23944],
  zoom: 17,
  viewMode: '3D',
}))

useTileLayer(() => map.value, () => ({ visible: showBaseTiles.value }))

const layerOptions = computed(() => overlay.value === 'plan'
  ? {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay.png',
      bounds: [
        [121.49693, 31.23863],
        [121.50019, 31.24022],
      ],
    }
  : {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay-heat.png',
      bounds: [
        [121.49593, 31.23833],
        [121.49979, 31.24052],
      ],
    })

useImageLayer(() => map.value, () => ({
  ...layerOptions.value,
  opacity: opacity.value,
  visible: true,
  zIndex: 150,
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the campus basemap recipe.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Overlay
          <select v-model="overlay">
            <option value="plan">Illustrated plan</option>
            <option value="heat">Heat overlay</option>
          </select>
        </label>
        <label>
          Opacity
          <input v-model.number="opacity" type="range" min="0.4" max="1" step="0.05">
        </label>
        <label>
          <input v-model="showBaseTiles" type="checkbox">
          Show base tiles
        </label>
      </div>
    </template>
  </div>
</template>
