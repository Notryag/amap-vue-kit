<script setup lang="ts">
import { useCircle } from '@amap-vue/hooks'
import { ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const center = ref<[number, number]>([116.397, 39.908])
const radius = ref(800)
const fillOpacity = ref(0.2)
const strokeColor = ref('#f97316')

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: center.value,
  zoom: 12,
}))

useCircle(() => map.value, () => ({
  center: center.value,
  radius: radius.value,
  fillOpacity: fillOpacity.value,
  fillColor: '#f97316',
  strokeColor: strokeColor.value,
  strokeWeight: 2,
}))

function increaseRadius() {
  radius.value = Math.min(radius.value + 200, 2000)
}

function decreaseRadius() {
  radius.value = Math.max(radius.value - 200, 200)
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      配置 <code>VITE_AMAP_KEY</code> 后预览 <code>useCircle</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <button type="button" @click="decreaseRadius">
          − 半径
        </button>
        <div>半径：{{ radius }} m</div>
        <button type="button" @click="increaseRadius">
          + 半径
        </button>
        <label>
          描边
          <input v-model="strokeColor" type="color">
        </label>
        <label>
          填充透明度
          <input v-model.number="fillOpacity" type="range" min="0" max="0.8" step="0.05">
        </label>
      </div>
    </template>
  </div>
</template>
