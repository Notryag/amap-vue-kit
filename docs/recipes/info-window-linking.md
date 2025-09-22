# Linked Info Windows

Synchronize a POI list with markers and info windows so hovering or clicking highlights a single location. The pattern relies on reactive state instead of imperative DOM queries, which keeps the UI in sync on both desktop and mobile.

```vue
<script setup lang="ts">
import { useInfoWindow, useMap, useMarker } from '@amap-vue/hooks'
import { ref, watch } from 'vue'

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

const container = ref<HTMLDivElement | null>(null)
const activeId = ref<number | null>(places[0]?.id ?? null)

const { map, ready } = useMap(() => ({
  container,
  center: places[0]?.position ?? [116.397428, 39.90923],
  zoom: 14,
}))

const markers = places.map(place =>
  useMarker(() => map.value, {
    position: place.position,
    extData: place,
    title: place.name,
  }),
)

const infoWindow = useInfoWindow(() => map.value, {
  offset: [0, -28],
  isCustom: false,
})

function focusPlace(id: number) {
  activeId.value = id
}

watch(activeId, (id) => {
  if (id == null) {
    infoWindow.close()
    return
  }

  const place = places.find(item => item.id === id)
  if (!place)
    return

  infoWindow.setContent(
    `<div class="poi-card"><h4>${place.name}</h4><p>${place.address}</p></div>`,
  )
  infoWindow.setPosition(place.position)
  infoWindow.open()
}, { immediate: true })

ready(() => {
  markers.forEach((marker, index) => {
    marker.on('click', () => focusPlace(places[index].id))
  })
})
</script>

<template>
  <div class="layout">
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
    <div ref="container" class="map" />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  gap: 16px;
}

.poi-list {
  width: 220px;
  list-style: none;
  padding: 0;
  margin: 0;
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

.map {
  flex: 1;
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
```

The watcher keeps the info window and marker in sync regardless of whether the user hovers over the list, taps a marker, or navigates with keyboard focus. Remember to call `infoWindow.close()` when the selection becomes `null` to hide the overlay.

## Tips

- Store additional metadata in `extData` so clicking the marker can update other UI such as detail panels.
- Debounce `focusPlace` when syncing with fast-moving inputs (like list scrolling) to avoid spamming info window updates.
- On mobile, trigger `focusPlace` on `click` or `touchstart` instead of hover-only events so the interaction works without a mouse.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
