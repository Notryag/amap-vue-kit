<script setup lang="ts">
import { usePolygon } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const vertices = ref<([number, number])[]>([
  [116.39, 39.92],
  [116.41, 39.92],
  [116.42, 39.91],
  [116.4, 39.9],
])
const fillColor = ref('#2dd4bf66')
const strokeColor = ref('#0f766e')
const visible = ref(true)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.405, 39.915],
  zoom: 12,
}))

usePolygon(() => map.value, () => ({
  path: vertices.value,
  fillColor: fillColor.value,
  strokeColor: strokeColor.value,
  fillOpacity: 0.4,
  strokeWeight: 3,
  visible: visible.value,
}))

const area = computed(() => vertices.value.length)
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      配置 <code>VITE_AMAP_KEY</code> 后预览 <code>usePolygon</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Fill
          <input v-model="fillColor" type="color">
        </label>
        <label>
          Stroke
          <input v-model="strokeColor" type="color">
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          显示
        </label>
        <div>Vertices: {{ area }}</div>
      </div>
    </template>
  </div>
</template>
