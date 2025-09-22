<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const center = ref<[number, number]>([116.397, 39.908])
const zoom = ref(11)
const viewMode = ref<AMap.MapViewMode>('2D')
const theme = ref<'default' | 'dark'>('default')

const { container, hasKey, on, ready, setTheme, setViewMode } = useHookDemoMap(() => ({
  center: center.value,
  zoom: zoom.value,
  viewMode: viewMode.value,
}))

ready((instance) => {
  instance.on('moveend', () => {
    const next = instance.getCenter()
    center.value = [Number(next.getLng().toFixed(5)), Number(next.getLat().toFixed(5))]
  })
  instance.on('zoomchange', () => {
    zoom.value = Math.round(instance.getZoom())
  })
})

on('complete', () => {
  if (theme.value === 'dark')
    setTheme('amap://styles/dark')
})

const themeLabel = computed(() => theme.value === 'default' ? 'Default' : 'Dark (night)')

function flyTo(point: [number, number], nextZoom: number) {
  center.value = point
  zoom.value = nextZoom
}

function toggleTheme() {
  theme.value = theme.value === 'default' ? 'dark' : 'default'
  setTheme(theme.value === 'default' ? undefined : 'amap://styles/dark')
}

function toggleViewMode() {
  viewMode.value = viewMode.value === '2D' ? '3D' : '2D'
  setViewMode(viewMode.value)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useMap</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <div>Center: {{ center[0].toFixed(3) }}, {{ center[1].toFixed(3) }}</div>
        <div>Zoom: {{ zoom }}</div>
        <button type="button" @click="() => flyTo([116.397, 39.918], 14)">
          Fly to Jingshan Park
        </button>
        <button type="button" @click="toggleTheme">
          Theme: {{ themeLabel }}
        </button>
        <button type="button" @click="toggleViewMode">
          View mode: {{ viewMode }}
        </button>
      </div>
    </template>
  </div>
</template>
