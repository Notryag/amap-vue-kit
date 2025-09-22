<script setup lang="ts">
import { useMarker } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const markerPosition = ref<[number, number]>([116.397, 39.908])
const draggable = ref(true)
const showLabel = ref(true)

const { container, hasKey, map } = useHookDemoMap()

const marker = useMarker(() => map.value, () => ({
  position: markerPosition.value,
  draggable: draggable.value,
  label: showLabel.value
    ? { content: 'Drag me', direction: 'top', offset: [0, -20] }
    : undefined,
}))

marker.on('dragend', (event: any) => {
  const lnglat = event?.lnglat
  const lng = typeof lnglat?.getLng === 'function' ? lnglat.getLng() : lnglat?.lng
  const lat = typeof lnglat?.getLat === 'function' ? lnglat.getLat() : lnglat?.lat
  if (typeof lng === 'number' && typeof lat === 'number')
    markerPosition.value = [Number(lng.toFixed(6)), Number(lat.toFixed(6))]
})

const markerCoords = computed(() => `${markerPosition.value[0].toFixed(4)}, ${markerPosition.value[1].toFixed(4)}`)

function resetMarker() {
  markerPosition.value = [116.397, 39.908]
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useMarker</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <div>Marker: {{ markerCoords }}</div>
        <label>
          <input v-model="draggable" type="checkbox">
          Draggable
        </label>
        <label>
          <input v-model="showLabel" type="checkbox">
          Label
        </label>
        <button type="button" @click="resetMarker">
          Reset
        </button>
      </div>
    </template>
  </div>
</template>
