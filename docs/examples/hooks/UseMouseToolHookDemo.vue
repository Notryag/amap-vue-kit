<script setup lang="ts">
import { useMouseTool } from '@amap-vue/hooks'
import { ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.397, 39.908],
  zoom: 12,
}), { plugins: ['AMap.BezierCurve'] })

const eventLog = ref<string[]>([])

const tool = useMouseTool(() => map.value)

tool.on('draw', (event) => {
  const overlay = event?.obj
  const label = overlay?.constructor?.name ?? 'overlay'
  const time = new Date().toLocaleTimeString()
  eventLog.value = [`${time} · ${label} drawn`, ...eventLog.value].slice(0, 5)
})

function drawCircle() {
  tool.drawCircle({
    fillColor: 'rgba(19, 194, 194, 0.25)',
    strokeColor: '#13c2c2',
  })
}

function drawRectangle() {
  tool.drawRectangle({
    fillColor: 'rgba(82, 196, 26, 0.25)',
    strokeColor: '#52c41a',
  })
}

function drawPolygon() {
  tool.drawPolygon({
    fillColor: 'rgba(250, 140, 22, 0.25)',
    strokeColor: '#fa8c16',
  })
}

function drawPolyline() {
  tool.drawPolyline({
    strokeColor: '#722ed1',
    strokeWeight: 4,
  })
}

function drawBezier() {
  tool.drawBezierCurve({
    strokeColor: '#13c2c2',
    strokeWeight: 4,
  })
}

function drawEllipse() {
  tool.drawEllipse({
    fillColor: 'rgba(247, 89, 171, 0.2)',
    strokeColor: '#f759ab',
  })
}

function stopDrawing() {
  tool.close()
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useMouseTool</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <button type="button" @click="drawCircle">
          Draw circle
        </button>
        <button type="button" @click="drawRectangle">
          Draw rectangle
        </button>
        <button type="button" @click="drawPolygon">
          Draw polygon
        </button>
        <button type="button" @click="drawPolyline">
          Draw polyline
        </button>
        <button type="button" @click="drawBezier">
          Draw bezier
        </button>
        <button type="button" @click="drawEllipse">
          Draw ellipse
        </button>
        <button type="button" @click="stopDrawing">
          Stop drawing
        </button>
      </div>
      <ul class="amap-demo__log">
        <li v-if="!eventLog.length" class="muted">
          Choose a tool, then click and drag on the map to draw.
        </li>
        <li v-for="(message, index) in eventLog" :key="index">
          {{ message }}
        </li>
      </ul>
    </template>
  </div>
</template>
