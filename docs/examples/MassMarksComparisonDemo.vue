<script setup lang="ts">
import { AmapLabelMarker, AmapLabelsLayer, AmapMap } from '@amap-vue/core'
import { useMassMarkers } from '@amap-vue/hooks'
import { loader } from '@amap-vue/shared'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.MassMarks'] })

const center: [number, number] = [116.397, 39.908]
const map = shallowRef<AMap.Map | null>(null)

const mode = ref<'mass' | 'labels' | 'both'>('mass')
const count = ref(600)

const categories = ['Cafe', 'Office', 'Park']

function generatePoints(size: number) {
  return Array.from({ length: size }, (_, index) => {
    const lng = 116.32 + Math.random() * 0.18
    const lat = 39.85 + Math.random() * 0.16
    return {
      id: `pt-${index}`,
      lnglat: [Number(lng.toFixed(6)), Number(lat.toFixed(6))] as [number, number],
      category: categories[index % categories.length],
      styleIndex: index % 2,
    }
  })
}

const dataset = ref(generatePoints(count.value))

watch(count, (value) => {
  dataset.value = generatePoints(value)
})

const mass = useMassMarkers(() => map.value, () => ({
  data: dataset.value.map(point => ({
    lnglat: point.lnglat,
    name: point.category,
    style: point.styleIndex,
  })),
  style: [
    {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/icon/iconfont-location.png',
      anchor: [8, 8],
      size: [16, 16],
    },
    {
      url: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/icon/iconfont-spot.png',
      anchor: [8, 8],
      size: [20, 20],
    },
  ],
  options: { zIndex: 110 },
}))

const labelPalette = ['#1677ff', '#fa8c16', '#13c2c2']

const labelPoints = computed(() => {
  const limit = Math.min(dataset.value.length, 400)
  return dataset.value.slice(0, limit).map((point, index) => ({
    id: point.id,
    position: point.lnglat,
    text: {
      content: point.category,
      direction: 'top' as const,
      offset: [0, -18] as [number, number],
      style: {
        padding: '2px 6px',
        borderRadius: '10px',
        fontSize: '11px',
        color: '#fff',
        background: labelPalette[index % labelPalette.length],
      },
    },
  }))
})

watch([mode, map, () => mass.mass.value], ([value, mapInstance]) => {
  const instance = mass.mass.value
  if (!instance)
    return
  const shouldShow = value === 'mass' || value === 'both'
  instance.setMap(shouldShow ? mapInstance ?? null : null)
}, { immediate: true })

onBeforeUnmount(() => {
  mass.destroy()
})

function handleReady(instance: AMap.Map) {
  map.value = instance
  const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
  if (key)
    loader.config({ key })
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to compare mass markers with labels.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="11" @ready="handleReady">
          <AmapLabelsLayer :visible="mode !== 'mass'">
            <AmapLabelMarker
              v-for="point in labelPoints"
              :key="point.id"
              :position="point.position"
              :text="point.text"
            />
          </AmapLabelsLayer>
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Points: {{ count }}
          <input v-model.number="count" type="range" min="200" max="2000" step="100">
        </label>
        <label>
          Render mode
          <select v-model="mode">
            <option value="mass">Mass markers</option>
            <option value="labels">Labels layer</option>
            <option value="both">Show both</option>
          </select>
        </label>
        <p class="muted">
          Labels layer renders up to 400 sampled points for readability; mass markers always draw the full dataset.
        </p>
      </div>
    </template>
  </div>
</template>
