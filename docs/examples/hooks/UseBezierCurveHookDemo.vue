<script setup lang="ts">
import type { BezierCurvePath } from '@amap-vue/shared'
import { useBezierCurve } from '@amap-vue/hooks'
import { ref, watch } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const { container, hasKey, map } = useHookDemoMap({ plugins: ['AMap.BezierCurve'], zoom: 12 })

const path = ref<BezierCurvePath>([
  [
    [116.35, 39.9],
    [116.36, 39.93],
    [116.39, 39.95],
    [116.42, 39.96],
  ],
])

const curve = useBezierCurve(() => map.value, () => ({
  path: path.value,
  strokeColor: '#13c2c2',
  strokeWeight: 4,
}))

watch(path, (value) => {
  curve.setPath(value)
})

function reverse() {
  path.value = path.value.slice().reverse().map(segment => segment.slice().reverse())
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useBezierCurve</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <button type="button" @click="reverse">
          Reverse path
        </button>
      </div>
    </template>
  </div>
</template>
