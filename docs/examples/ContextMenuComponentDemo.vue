<script setup lang="ts">
import { AmapContextMenu, AmapMap } from '@amap-vue/core'
import { computed, shallowRef } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center: [number, number] = [116.397, 39.908]
const map = shallowRef<AMap.Map | null>(null)

const menuItems = computed(() => [
  {
    text: 'Zoom in',
    handler: () => map.value?.zoomIn?.(),
  },
  {
    text: 'Zoom out',
    handler: () => map.value?.zoomOut?.(),
  },
  {
    text: 'Center here',
    handler: (event: any) => {
      const lnglat = event?.lnglat as AMap.LngLat | undefined
      if (lnglat)
        map.value?.setCenter?.(lnglat)
    },
  },
])

function handleReady(instance: AMap.Map) {
  map.value = instance
}

const menuRef = shallowRef<InstanceType<typeof AmapContextMenu> | null>(null)

function openAtCenter() {
  menuRef.value?.open(center)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the context menu.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="12" @ready="handleReady">
          <AmapContextMenu ref="menuRef" :items="menuItems" />
        </AmapMap>
      </div>
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
