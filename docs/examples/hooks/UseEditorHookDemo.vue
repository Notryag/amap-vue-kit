<script setup lang="ts">
import { useCircle, useEditorCircle } from '@amap-vue/hooks'
import { ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const center = ref<[number, number]>([116.397, 39.908])
const radius = ref(600)
const editing = ref(false)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: center.value,
  zoom: 13,
}))

const circle = useCircle(() => map.value, () => ({
  center: center.value,
  radius: radius.value,
  strokeColor: '#f97316',
  fillColor: '#f9731644',
  strokeWeight: 2,
  extData: { id: 'demo-circle' },
}))

const editor = useEditorCircle(() => map.value, () => ({
  target: 'demo-circle',
  active: editing.value,
}))

editor.on('adjust', () => {
  const target = circle.overlay.value
  if (!target)
    return
  const nextCenter = target.getCenter()
  center.value = [Number(nextCenter.getLng().toFixed(6)), Number(nextCenter.getLat().toFixed(6))]
  radius.value = Math.round(target.getRadius())
})

editor.on('end', () => {
  editing.value = false
})

function randomizeCircle() {
  const lng = 116.38 + Math.random() * 0.04
  const lat = 39.9 + Math.random() * 0.04
  center.value = [Number(lng.toFixed(6)), Number(lat.toFixed(6))]
  radius.value = 400 + Math.round(Math.random() * 400)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview editor hooks.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <div>Center: {{ center[0].toFixed(3) }}, {{ center[1].toFixed(3) }}</div>
        <div>Radius: {{ radius }} m</div>
        <button type="button" @click="editing = !editing">
          {{ editing ? 'Finish editing' : 'Edit circle' }}
        </button>
        <button type="button" @click="randomizeCircle">
          Randomize
        </button>
      </div>
    </template>
  </div>
</template>
