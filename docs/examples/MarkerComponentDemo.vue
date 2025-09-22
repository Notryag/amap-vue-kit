<script setup lang="ts">
import { AmapInfoWindow, AmapMap, AmapMarker } from '@amap-vue/core'
import { ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = ref<[number, number]>([116.397, 39.908])
const markerPosition = ref<[number, number]>([116.397, 39.908])
const draggable = ref(true)
const showLabel = ref(true)
const showInfo = ref(false)

function onDragEnd(event: any) {
  const lnglat = event?.lnglat
  const lng = typeof lnglat?.getLng === 'function' ? lnglat.getLng() : lnglat?.lng
  const lat = typeof lnglat?.getLat === 'function' ? lnglat.getLat() : lnglat?.lat
  if (typeof lng === 'number' && typeof lat === 'number')
    markerPosition.value = [Number(lng.toFixed(6)), Number(lat.toFixed(6))]
}

function resetMarker() {
  markerPosition.value = [...center.value]
  showInfo.value = false
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview the live marker.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="13">
          <AmapMarker
            :position="markerPosition"
            :draggable="draggable"
            :label="showLabel ? { content: 'Drag me', direction: 'top', offset: [0, -20] } : undefined"
            @dragend="onDragEnd"
            @click="showInfo = !showInfo"
          />
          <AmapInfoWindow
            v-if="showInfo"
            :is-open="true"
            :position="markerPosition"
            anchor="bottom-center"
          >
            <div style="min-width: 160px">
              <strong>Marker position</strong>
              <div>{{ markerPosition[0].toFixed(4) }}, {{ markerPosition[1].toFixed(4) }}</div>
            </div>
          </AmapInfoWindow>
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="draggable" type="checkbox">
          Draggable
        </label>
        <label>
          <input v-model="showLabel" type="checkbox">
          Label
        </label>
        <button type="button" @click="showInfo = !showInfo">
          Toggle info window
        </button>
        <button type="button" @click="resetMarker">
          Reset position
        </button>
      </div>
    </template>
  </div>
</template>
