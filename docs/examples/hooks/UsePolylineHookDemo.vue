<script setup lang="ts">
import { usePolyline } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const path = ref<([number, number])[]>([
  [116.382, 39.92],
  [116.397, 39.908],
  [116.418, 39.9],
  [116.432, 39.91],
])
const strokeColor = ref('#4b8bff')
const showDirection = ref(false)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.405, 39.91],
  zoom: 12,
}))

usePolyline(() => map.value, () => ({
  path: path.value,
  strokeColor: strokeColor.value,
  strokeWeight: 5,
  showDir: showDirection.value,
}))

const distance = computed(() => path.value.length - 1)
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>usePolyline</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Stroke
          <input v-model="strokeColor" type="color">
        </label>
        <label>
          <input v-model="showDirection" type="checkbox">
          Show direction arrows
        </label>
        <div>Segments: {{ distance }}</div>
      </div>
    </template>
  </div>
</template>
