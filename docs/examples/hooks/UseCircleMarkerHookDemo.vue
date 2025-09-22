<script setup lang="ts">
import { useCircleMarker } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const { container, hasKey, map } = useHookDemoMap()

const center = ref<[number, number]>([116.397, 39.908])
const radius = ref(10)
const highlight = ref(false)

const markerOptions = computed(() => ({
  strokeColor: highlight.value ? '#fa541c' : '#1677ff',
  fillColor: highlight.value ? 'rgba(250, 84, 28, 0.4)' : 'rgba(22, 119, 255, 0.4)',
  fillOpacity: 0.6,
}))

const marker = useCircleMarker(() => map.value, () => ({
  center: center.value,
  radius: radius.value,
  options: markerOptions.value,
}))

marker.on('click', () => {
  highlight.value = !highlight.value
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useCircleMarker</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Radius
          <input v-model.number="radius" type="range" min="6" max="30">
        </label>
        <label>
          <input v-model="highlight" type="checkbox">
          Highlight
        </label>
      </div>
    </template>
  </div>
</template>
