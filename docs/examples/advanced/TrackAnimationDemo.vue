<script setup lang="ts">
import { useMarker, usePolyline } from '@amap-vue/hooks'
import { loader } from '@amap-vue/shared'
import { ref } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

const path: [number, number][] = [
  [116.397, 39.908],
  [116.405, 39.912],
  [116.417, 39.908],
  [116.423, 39.915],
]

const playing = ref(false)

const { container, hasKey, map, ready } = useHookDemoMap(() => ({
  center: path[0],
  zoom: 13,
}))

const _polyline = usePolyline(() => map.value, () => ({
  path,
  strokeColor: '#06b6d4',
  strokeWeight: 4,
}))

const marker = useMarker(() => map.value, () => ({
  position: path[0],
  icon: {
    image: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
    size: [32, 16],
    anchor: 'center',
  },
}))

ready(async (mapInstance) => {
  await loader.load({ plugins: ['AMap.MoveAnimation'] })
  mapInstance.plugin(['AMap.MoveAnimation'])
})

function start() {
  if (!marker.marker.value)
    return
  playing.value = true
  marker.marker.value.moveAlong(path, { duration: 8000, autoRotation: true })
}

function pause() {
  if (!marker.marker.value)
    return
  playing.value = false
  marker.marker.value.pauseMove?.()
}

function reset() {
  pause()
  marker.marker.value?.stopMove?.()
  marker.setPosition(path[0])
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the track animation.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <button type="button" :disabled="playing" @click="start">
          Start
        </button>
        <button type="button" :disabled="!playing" @click="pause">
          Pause
        </button>
        <button type="button" @click="reset">
          Reset
        </button>
      </div>
    </template>
  </div>
</template>
