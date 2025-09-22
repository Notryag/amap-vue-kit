<script setup lang="ts">
import { useInfoWindow, useMarker } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const markerPosition = ref<[number, number]>([116.404, 39.915])
const isOpen = ref(true)
const isCustom = ref(false)
const anchor = ref<AMap.InfoWindowAnchor>('top-center')
const anchors: AMap.InfoWindowAnchor[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: markerPosition.value,
  zoom: 13,
}))

const marker = useMarker(() => map.value, () => ({
  position: markerPosition.value,
}))

marker.on('click', () => {
  isOpen.value = !isOpen.value
})

const infoWindow = useInfoWindow(() => map.value, () => ({
  position: markerPosition.value,
  open: isOpen.value,
  anchor: anchor.value,
  isCustom: isCustom.value,
  offset: [0, -20],
  content: isCustom.value
    ? '<div style="padding:8px 12px;background:#1e293b;color:white;border-radius:6px">Custom chrome ✨</div>'
    : `<div style="padding:8px 12px">\n        <strong>useInfoWindow</strong>\n        <div>Click the marker to toggle this bubble.</div>\n      </div>`,
}))

infoWindow.on('open', () => {
  isOpen.value = true
})

infoWindow.on('close', () => {
  isOpen.value = false
})

const anchorLabel = computed(() => anchor.value.replace('-', ' '))

function toggleAnchor() {
  const index = anchors.indexOf(anchor.value)
  anchor.value = anchors[(index + 1) % anchors.length]
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useInfoWindow</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <button type="button" @click="isOpen = !isOpen">
          {{ isOpen ? 'Close window' : 'Open window' }}
        </button>
        <label>
          <input v-model="isCustom" type="checkbox">
          Custom chrome
        </label>
        <button type="button" @click="toggleAnchor">
          Anchor: {{ anchorLabel }}
        </button>
      </div>
    </template>
  </div>
</template>
