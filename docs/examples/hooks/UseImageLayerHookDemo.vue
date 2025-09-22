<script setup lang="ts">
import { useImageLayer } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const mode = ref<'footprints' | 'heat'>('footprints')
const opacity = ref(0.75)
const visible = ref(true)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.397, 39.908],
  zoom: 12,
}))

const layerOptions = computed(() => mode.value === 'footprints'
  ? {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay.png',
      bounds: [
        [116.357, 39.903],
        [116.412, 39.949],
      ],
    }
  : {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay-heat.png',
      bounds: [
        [116.365, 39.897],
        [116.418, 39.946],
      ],
    })

useImageLayer(() => map.value, () => ({
  ...layerOptions.value,
  opacity: opacity.value,
  visible: visible.value,
  zIndex: 120,
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useImageLayer</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Overlay
          <select v-model="mode">
            <option value="footprints">Footprints</option>
            <option value="heat">Heatmap overlay</option>
          </select>
        </label>
        <label>
          Opacity
          <input v-model.number="opacity" type="range" min="0.2" max="1" step="0.05">
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
      </div>
    </template>
  </div>
</template>
