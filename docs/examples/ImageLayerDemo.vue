<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { computed, ref } from 'vue'

type OverlayKey = 'footprints' | 'heatmap'

interface OverlaySource {
  label: string
  url: string
  bounds: [[number, number], [number, number]]
}

const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
if (key)
  loader.config({ key })

const center: [number, number] = [116.397, 39.908]
const hasKey = computed(() => Boolean(key))
const visible = ref(true)
const opacity = ref(0.75)
const activeSource = ref<OverlayKey>('footprints')

const sources: Record<OverlayKey, OverlaySource> = {
  footprints: {
    label: 'Foot traffic heatmap',
    url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay.png',
    bounds: [[116.357, 39.903], [116.412, 39.949]],
  },
  heatmap: {
    label: 'Nighttime lights',
    url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay-heat.png',
    bounds: [[116.365, 39.897], [116.418, 39.946]],
  },
}

const source = computed(() => sources[activeSource.value])
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview the image layer overlay.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="12">
          <AmapImageLayer
            :url="source.url"
            :bounds="source.bounds"
            :opacity="opacity"
            :visible="visible"
            :z-index="130"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Dataset
          <select v-model="activeSource">
            <option value="footprints">{{ sources.footprints.label }}</option>
            <option value="heatmap">{{ sources.heatmap.label }}</option>
          </select>
        </label>
        <label>
          Opacity
          <input v-model.number="opacity" type="range" min="0" max="1" step="0.05">
          <span>{{ Math.round(opacity * 100) }}%</span>
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
      </div>
    </template>
  </div>
</template>
