<script setup lang="ts">
import { useOverlay } from '@amap-vue/hooks'
import { ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const fillColor = ref('#22c55e44')
const strokeColor = ref('#16a34a')
const visible = ref(true)
const bounds = ref<[[number, number], [number, number]]>([
  [116.39, 39.905],
  [116.42, 39.925],
])

let lastAMap: typeof AMap | null = null

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.405, 39.915],
  zoom: 13,
}))

useOverlay(
  () => map.value,
  () => ({
    bounds: bounds.value,
    fillColor: fillColor.value,
    strokeColor: strokeColor.value,
    strokeWeight: 2,
    visible: visible.value,
  }),
  ({ AMap, map: mapInstance, options }) => {
    lastAMap = AMap
    const rectangle = new AMap.Rectangle({
      strokeWeight: options.strokeWeight,
      strokeColor: options.strokeColor,
      fillColor: options.fillColor,
    })
    rectangle.setMap(mapInstance)
    if (options.bounds)
      rectangle.setBounds(new AMap.Bounds(options.bounds[0], options.bounds[1]))
    if (options.visible === false)
      rectangle.hide()
    return rectangle
  },
  (rectangle, options) => {
    rectangle.setOptions({
      strokeWeight: options.strokeWeight,
      strokeColor: options.strokeColor,
      fillColor: options.fillColor,
    })
    if (options.bounds && lastAMap)
      rectangle.setBounds(new lastAMap.Bounds(options.bounds[0], options.bounds[1]))
    if (options.visible === false)
      rectangle.hide()
    else
      rectangle.show()
  },
)

function moveNorth() {
  const [[westLng, southLat], [eastLng, northLat]] = bounds.value
  const delta = 0.002
  bounds.value = [
    [westLng, southLat + delta],
    [eastLng, northLat + delta],
  ]
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useOverlay</code>.
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
          Visible
        </label>
        <button type="button" @click="moveNorth">
          Move north
        </button>
      </div>
    </template>
  </div>
</template>
