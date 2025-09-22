<script setup lang="ts">
import { AmapInfoWindow, AmapMap, AmapMarker } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = ref<[number, number]>([116.397, 39.908])
const markerPosition = ref<[number, number]>([116.397, 39.908])
const draggable = ref(true)
const showLabel = ref(true)
const showInfo = ref(false)
const useCustomContent = ref(false)

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

const markerAnchor = computed<AMap.MarkerAnchor | undefined>(() => (
  useCustomContent.value ? 'bottom-center' : undefined
))

const markerOffset = computed<AMap.Pixel | [number, number] | undefined>(() => (
  useCustomContent.value ? [0, -36] : undefined
))
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
            :label="showLabel && !useCustomContent
              ? { content: 'Drag me', direction: 'top', offset: [0, -20] }
              : undefined"
            :anchor="markerAnchor"
            :offset="markerOffset"
            @dragend="onDragEnd"
            @click="showInfo = !showInfo"
          >
            <div v-if="useCustomContent" class="marker-demo__card">
              <span class="marker-demo__icon">📍</span>
              <div class="marker-demo__body">
                <strong>Custom marker</strong>
                <small>{{ markerPosition[0].toFixed(3) }}, {{ markerPosition[1].toFixed(3) }}</small>
              </div>
            </div>
          </AmapMarker>
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
        <label>
          <input v-model="useCustomContent" type="checkbox">
          Custom HTML
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

<style scoped>
.marker-demo__card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 12px;
  background: rgba(0, 122, 255, 0.9);
  color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
}

.marker-demo__icon {
  font-size: 18px;
}

.marker-demo__body {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.marker-demo__body small {
  font-size: 11px;
  opacity: 0.8;
}
</style>
