<script setup lang="ts">
import { useEditorPolygon, usePolygon } from '@amap-vue/hooks'
import { onBeforeUnmount, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const coordinates = ref<[number, number][]>([
  [116.37, 39.9],
  [116.4, 39.9],
  [116.42, 39.92],
  [116.39, 39.93],
])

const editing = ref(false)
const vertexCount = ref(coordinates.value.length)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.395, 39.91],
  zoom: 13,
}))

const polygon = usePolygon(() => map.value, () => ({
  path: coordinates.value,
  strokeColor: '#722ed1',
  strokeWeight: 3,
  fillColor: 'rgba(114, 46, 209, 0.25)',
  extData: { id: 'editable-polygon' },
}))

const editor = useEditorPolygon(() => map.value, () => ({
  target: polygon.overlay.value,
  active: editing.value,
}))

function updateVertexCount() {
  const path = polygon.overlay.value?.getPath?.()
  vertexCount.value = Array.isArray(path) ? path.length : coordinates.value.length
}

editor.on('adjust', updateVertexCount)
editor.on('end', () => {
  editing.value = false
  updateVertexCount()
})

function randomisePolygon() {
  coordinates.value = Array.from({ length: 4 }, (_, index) => {
    const baseLng = 116.36 + index * 0.025
    const baseLat = 39.89 + index * 0.01
    return [Number((baseLng + Math.random() * 0.02).toFixed(6)), Number((baseLat + Math.random() * 0.02).toFixed(6))]
  })
  vertexCount.value = coordinates.value.length
}

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview the polygon editor hook.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <div>Vertices: {{ vertexCount }}</div>
        <button type="button" @click="editing = !editing">
          {{ editing ? 'Finish editing' : 'Edit polygon' }}
        </button>
        <button type="button" @click="randomisePolygon">
          Randomise polygon
        </button>
      </div>
    </template>
  </div>
</template>
