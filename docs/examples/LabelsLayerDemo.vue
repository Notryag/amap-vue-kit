<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { computed, reactive, ref } from 'vue'

const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
if (key)
  loader.config({ key })

const center: [number, number] = [116.397, 39.908]
const hasKey = computed(() => Boolean(key))
const showLayer = ref(true)
const avoidCollision = ref(true)

const points = reactive([
  {
    id: 1,
    position: [116.397, 39.908] as [number, number],
    label: 'Tiananmen',
  },
  {
    id: 2,
    position: [116.4065, 39.9147] as [number, number],
    label: 'National Museum',
  },
  {
    id: 3,
    position: [116.4036, 39.9163] as [number, number],
    label: 'Forbidden City',
  },
  {
    id: 4,
    position: [116.3883, 39.9131] as [number, number],
    label: 'Great Hall',
  },
])

function textOptions(label: string): AMap.LabelMarkerTextOptions {
  return {
    content: label,
    direction: 'top',
    offset: [0, -12],
    style: {
      fontSize: 12,
      fillColor: '#111827',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      padding: [2, 6],
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderRadius: 4,
    },
  }
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to see the live demo.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="13">
          <AmapLabelsLayer :visible="showLayer" :collision="avoidCollision">
            <AmapLabelMarker
              v-for="point in points"
              :key="point.id"
              :position="point.position"
              :text="textOptions(point.label)"
            />
          </AmapLabelsLayer>
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="showLayer" type="checkbox">
          Show labels
        </label>
        <label>
          <input v-model="avoidCollision" type="checkbox">
          Collision avoidance
        </label>
      </div>
    </template>
  </div>
</template>
