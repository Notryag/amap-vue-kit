<script setup lang="ts">
import { AmapContextMenu, AmapMap } from '@amap-vue/core'
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center: [number, number] = [116.397, 39.908]
const map = shallowRef<AMap.Map | null>(null)
let menuPosition: [number, number] | AMap.LngLat = center

function rememberPosition(event: { lnglat: AMap.LngLat }) {
  menuPosition = event.lnglat
}

const menuItems = computed(() => [
  {
    text: '放大',
    handler: () => map.value?.zoomIn?.(),
  },
  {
    text: '缩小',
    handler: () => map.value?.zoomOut?.(),
  },
  {
    text: 'Center here',
    handler: () => map.value?.setCenter(menuPosition),
  },
])

function handleReady(instance: AMap.Map) {
  map.value?.off('rightclick', rememberPosition)
  map.value = instance
  instance.on('rightclick', rememberPosition)
}

onBeforeUnmount(() => map.value?.off('rightclick', rememberPosition))

const menuRef = shallowRef<InstanceType<typeof AmapContextMenu> | null>(null)

function openAtCenter() {
  menuPosition = center
  menuRef.value?.open(center)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      配置 <code>VITE_AMAP_KEY</code> 后预览右键菜单。
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
