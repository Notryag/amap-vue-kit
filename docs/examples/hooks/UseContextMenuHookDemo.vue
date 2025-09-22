<script setup lang="ts">
import { useContextMenu } from '@amap-vue/hooks'
import { onBeforeUnmount, watch } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const center: [number, number] = [116.397, 39.908]
const { container, hasKey, map } = useHookDemoMap(() => ({
  center,
  zoom: 12,
}))

const menu = useContextMenu(() => map.value, () => ({
  items: [
    { text: 'Zoom in', handler: () => map.value?.zoomIn?.() },
    { text: 'Zoom out', handler: () => map.value?.zoomOut?.() },
  ],
}))

function handleRightClick(event: any) {
  const lnglat = event?.lnglat as AMap.LngLat | undefined
  if (lnglat)
    void menu.open(lnglat)
}

watch(() => map.value, (instance, previous) => {
  previous?.off?.('rightclick', handleRightClick)
  instance?.on?.('rightclick', handleRightClick)
}, { immediate: true })

onBeforeUnmount(() => {
  map.value?.off?.('rightclick', handleRightClick)
  menu.destroy()
})

function openAtCenter() {
  menu.open(center)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useContextMenu</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <button type="button" @click="openAtCenter">
          Open at center
        </button>
        <p class="muted">
          Right-click the map to show the menu.
        </p>
      </div>
    </template>
  </div>
</template>
