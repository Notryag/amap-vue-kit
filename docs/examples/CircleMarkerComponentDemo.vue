<script setup lang="ts">
import { AmapCircleMarker, AmapMap } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = ref<[number, number]>([116.397, 39.908])
const radius = ref(12)
const highlight = ref(false)

const options = computed(() => ({
  strokeColor: highlight.value ? '#fa541c' : '#1677ff',
  strokeWeight: 2,
  fillColor: highlight.value ? 'rgba(250, 84, 28, 0.45)' : 'rgba(22, 119, 255, 0.45)',
  fillOpacity: 0.6,
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>&lt;AmapCircleMarker&gt;</code>.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="14">
          <AmapCircleMarker
            :center="center"
            :radius="radius"
            :options="options"
            :visible="true"
            @click="highlight = !highlight"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Radius
          <input v-model.number="radius" type="range" min="4" max="30">
        </label>
        <label>
          <input v-model="highlight" type="checkbox">
          Highlight
        </label>
      </div>
    </template>
  </div>
</template>
