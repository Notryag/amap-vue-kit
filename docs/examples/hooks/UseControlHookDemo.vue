<script setup lang="ts">
import { useControlBar, useMapType, useScale, useToolBar } from '@amap-vue/hooks'
import { ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const showToolBar = ref(true)
const showScale = ref(true)
const showControlBar = ref(false)
const showMapType = ref(false)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: [116.397, 39.908],
  zoom: 12,
}))

useToolBar(() => map.value, () => ({ visible: showToolBar.value }))
useScale(() => map.value, () => ({ visible: showScale.value }))
useControlBar(() => map.value, () => ({ position: { top: '80px', right: '10px' }, visible: showControlBar.value }))
useMapType(() => map.value, () => ({ visible: showMapType.value }))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview control hooks.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="showToolBar" type="checkbox">
          ToolBar
        </label>
        <label>
          <input v-model="showScale" type="checkbox">
          Scale
        </label>
        <label>
          <input v-model="showControlBar" type="checkbox">
          ControlBar
        </label>
        <label>
          <input v-model="showMapType" type="checkbox">
          MapType
        </label>
      </div>
    </template>
  </div>
</template>
