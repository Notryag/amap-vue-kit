<script setup lang="ts">
import { useLabelsLayer } from '@amap-vue/hooks'
import { loader } from '@amap-vue/shared'
import { onBeforeUnmount, ref, watch } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const opacity = ref(0.85)
const visible = ref(true)
const count = ref(4)
const palette = ref<'brand' | 'muted'>('brand')

const labelMeta = [
  { name: 'Forbidden City', coords: [116.397, 39.918], color: '#0ea5e9' },
  { name: 'Tiananmen', coords: [116.403, 39.915], color: '#6366f1' },
  { name: 'Jingshan Park', coords: [116.397, 39.923], color: '#22c55e' },
  { name: 'National Museum', coords: [116.414, 39.913], color: '#f97316' },
  { name: 'Beihai Park', coords: [116.383, 39.924], color: '#14b8a6' },
]

const markers = ref<AMap.LabelMarker[]>([])

const { container, hasKey, map, ready } = useHookDemoMap(() => ({
  center: [116.4, 39.915],
  zoom: 13,
}), { plugins: ['AMap.LabelsLayer'] })

const labelsLayer = useLabelsLayer(() => map.value, () => ({
  opacity: opacity.value,
  visible: visible.value,
  zIndex: 120,
}))

ready(async () => {
  const AMapInstance = loader.get() ?? await loader.load({ plugins: ['AMap.LabelsLayer'] })
  if (!AMapInstance)
    return
  const created = labelMeta.map(meta => new (AMapInstance as any).LabelMarker({
    position: meta.coords,
    text: {
      content: meta.name,
      direction: 'right',
      style: {
        fillColor: meta.color,
        fontSize: 12,
        fontWeight: 600,
        padding: [2, 6],
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        borderRadius: 6,
        borderColor: 'transparent',
      },
    },
    icon: {
      image: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/icon/iconfont-explore.png',
      size: [22, 22],
      anchor: 'center',
    },
  }))
  markers.value = created
  labelsLayer.add(created.slice(0, count.value))
})

watch(count, (value) => {
  labelsLayer.clear()
  labelsLayer.add(markers.value.slice(0, value))
})

watch(palette, (mode) => {
  markers.value.forEach((marker, index) => {
    const meta = labelMeta[index]
    marker.setText({
      content: meta.name,
      direction: 'right',
      style: {
        fillColor: mode === 'brand' ? meta.color : '#334155',
        fontSize: 12,
        fontWeight: mode === 'brand' ? 600 : 500,
        padding: [2, 6],
        backgroundColor: mode === 'brand' ? 'rgba(15,23,42,0.85)' : 'rgba(241,245,249,0.92)',
        borderRadius: 6,
        borderColor: 'transparent',
        color: mode === 'brand' ? '#ecfeff' : '#0f172a',
      },
    })
  })
})

onBeforeUnmount(() => {
  markers.value.forEach(marker => marker.destroy?.())
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useLabelsLayer</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Labels: {{ count }}
          <input v-model.number="count" type="range" min="2" max="5" step="1">
        </label>
        <label>
          Opacity
          <input v-model.number="opacity" type="range" min="0.4" max="1" step="0.05">
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
        <label>
          Palette
          <select v-model="palette">
            <option value="brand">Brand colors</option>
            <option value="muted">Muted</option>
          </select>
        </label>
      </div>
    </template>
  </div>
</template>
