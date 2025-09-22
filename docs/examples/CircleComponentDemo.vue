<script setup lang="ts">
import { AmapCircle, AmapMap } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = ref<[number, number]>([116.397, 39.908])
const radius = ref(800)
const strokeColor = ref('#ff6b6b')
const fillOpacity = ref(0.2)

const options = computed(() => ({
  strokeColor: strokeColor.value,
  strokeWeight: 2,
  fillColor: '#ff6b6b',
  fillOpacity: fillOpacity.value,
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
      Provide <code>VITE_AMAP_KEY</code> to preview the circle.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="12">
          <AmapCircle :center="center" :radius="radius" :options="options" />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <button type="button" @click="decreaseRadius">
          − Radius
        </button>
        <div>Radius: {{ radius }} m</div>
        <button type="button" @click="increaseRadius">
          + Radius
        </button>
        <label>
          Stroke
          <input v-model="strokeColor" type="color">
        </label>
        <label>
          Fill opacity
          <input v-model.number="fillOpacity" type="range" min="0" max="0.8" step="0.05">
        </label>
      </div>
    </template>
  </div>
</template>
