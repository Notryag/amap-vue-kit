<script setup lang="ts">
import { useInfoWindow, useMarker } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from '../hooks/useHookDemoMap'

interface Place {
  id: number
  name: string
  address: string
  position: [number, number]
}

const places: Place[] = [
  { id: 1, name: 'North Gate Café', address: '12 Chaoyangmen W St', position: [116.396923, 39.90816] },
  { id: 2, name: 'Library', address: '88 Workers Stadium Rd', position: [116.40021, 39.90986] },
  { id: 3, name: 'Rooftop Garden', address: '22 Jinbao St', position: [116.40137, 39.90745] },
]

const activeId = ref<number | null>(places[0]?.id ?? null)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: places[0]?.position ?? [116.397428, 39.90923],
  zoom: 14,
}))

const markers = places.map(place =>
  useMarker(() => map.value, () => ({
    position: place.position,
    extData: place,
  })),
)

const infoWindow = useInfoWindow(() => map.value, () => ({
  offset: [0, -28],
  isCustom: false,
}))

markers.forEach((marker, index) => {
  marker.on('click', () => focusPlace(places[index].id))
})

const activePlace = computed(() => places.find(place => place.id === activeId.value) ?? null)

function focusPlace(id: number) {
  activeId.value = id
  const place = places.find(item => item.id === id)
  if (!place)
    return
  infoWindow.setContent(`<div class=\"poi-card\"><strong>${place.name}</strong><div>${place.address}</div></div>`)
  infoWindow.setPosition(place.position)
  infoWindow.open()
}

function clearSelection() {
  activeId.value = null
  infoWindow.close()
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the linked info windows recipe.
    </div>
    <template v-else>
      <div class="poi-layout">
        <ul class="poi-list">
          <li
            v-for="place in places"
            :key="place.id"
            :class="{ active: place.id === activeId }"
            @mouseenter="focusPlace(place.id)"
            @focusin="focusPlace(place.id)"
          >
            <h4>{{ place.name }}</h4>
            <p>{{ place.address }}</p>
          </li>
        </ul>
        <div ref="container" class="poi-map" />
      </div>
      <div class="amap-demo__toolbar">
        <div v-if="activePlace">
          Active: {{ activePlace.name }}
        </div>
        <button type="button" :disabled="!activePlace" @click="clearSelection">
          Clear selection
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.poi-layout {
  display: flex;
  gap: 16px;
}

.poi-list {
  width: 220px;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.poi-list li {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f6f8fb;
  cursor: pointer;
  transition: background 0.2s ease;
}

.poi-list li.active {
  background: #e3f2ff;
}

.poi-map {
  flex: 1;
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
