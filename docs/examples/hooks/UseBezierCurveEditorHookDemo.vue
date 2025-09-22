<script setup lang="ts">
import type { BezierCurvePath } from '@amap-vue/shared'
import { useBezierCurve, useEditorBezierCurve } from '@amap-vue/hooks'
import { onBeforeUnmount, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const segments = ref<BezierCurvePath>([
  [
    [116.36, 39.9],
    [116.37, 39.93],
    [116.39, 39.94],
    [116.41, 39.92],
  ],
])

const editing = ref(false)

const { container, hasKey, map } = useHookDemoMap({ plugins: ['AMap.BezierCurve'] })

const curve = useBezierCurve(() => map.value, () => ({
  path: segments.value,
  strokeColor: '#13c2c2',
  strokeWeight: 4,
}))

const editor = useEditorBezierCurve(() => map.value, () => ({
  target: curve.overlay.value,
  active: editing.value,
}))

editor.on('end', () => {
  editing.value = false
})

function randomisePath() {
  segments.value = [
    [
      [116.35 + Math.random() * 0.05, 39.89 + Math.random() * 0.02],
      [116.37 + Math.random() * 0.05, 39.91 + Math.random() * 0.03],
      [116.39 + Math.random() * 0.05, 39.93 + Math.random() * 0.03],
      [116.41 + Math.random() * 0.05, 39.9 + Math.random() * 0.03],
    ],
  ]
}

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview the bezier editor hook.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <button type="button" @click="editing = !editing">
          {{ editing ? 'Finish editing' : 'Edit curve' }}
        </button>
        <button type="button" @click="randomisePath">
          Randomise path
        </button>
        <p class="muted">
          Drag control points while editing is enabled.
        </p>
      </div>
    </template>
  </div>
</template>
