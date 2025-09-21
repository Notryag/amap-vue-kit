<script setup lang="ts">
import { computed, ref } from 'vue'

type LngLatTuple = [number, number]

const center = ref<LngLatTuple>([116.397428, 39.90923])
const initialCenter: LngLatTuple = [...center.value] as LngLatTuple
const zoom = ref(12)
const infoOpen = ref(true)
const markerDraggable = ref(true)
const showPolyline = ref(true)
const showPolygon = ref(false)
const showCircle = ref(false)
const circleRadius = ref(600)

const hasKey = computed(() => Boolean(import.meta.env.VITE_AMAP_KEY))

const polylinePath: LngLatTuple[] = [
  [116.391312, 39.907415],
  [116.397428, 39.90923],
  [116.402199, 39.915599],
  [116.410333, 39.914884],
]

const polygonPath: LngLatTuple[] = [
  [116.394226, 39.913723],
  [116.40507, 39.918988],
  [116.411302, 39.909955],
  [116.403112, 39.90399],
]

const polylineStyle = {
  strokeColor: '#2563eb',
  strokeWeight: 4,
  strokeOpacity: 0.9,
  lineJoin: 'round',
  lineCap: 'round',
} as const

const polygonStyle = {
  strokeColor: '#1d4ed8',
  strokeWeight: 2,
  fillColor: '#2563eb',
  fillOpacity: 0.08,
} as const

const circleStyle = {
  strokeColor: '#f97316',
  strokeWeight: 2,
  strokeOpacity: 0.8,
  fillColor: '#fb923c',
  fillOpacity: 0.12,
} as const

const centerText = computed(() => {
  const [lng, lat] = center.value
  return `${lng.toFixed(6)}, ${lat.toFixed(6)}`
})

function resetView() {
  center.value = [...initialCenter] as LngLatTuple
  zoom.value = 12
  infoOpen.value = true
}

function stepZoom(delta: number) {
  zoom.value = Math.min(18, Math.max(3, zoom.value + delta))
}

function nudge(lngDelta: number, latDelta: number) {
  const [lng, lat] = center.value
  center.value = [
    Number((lng + lngDelta).toFixed(6)),
    Number((lat + latDelta).toFixed(6)),
  ] as LngLatTuple
}

function handleMapMoveend(event: any) {
  const map = event?.target as AMap.Map | undefined
  const currentCenter = map?.getCenter?.()
  if (currentCenter)
    center.value = [Number(currentCenter.getLng().toFixed(6)), Number(currentCenter.getLat().toFixed(6))] as LngLatTuple

  const currentZoom = map?.getZoom?.()
  if (typeof currentZoom === 'number')
    zoom.value = Math.round(currentZoom)
}

function handleMarkerDragend(event: any) {
  const { lnglat } = event ?? {}
  if (lnglat)
    center.value = [Number(lnglat.lng.toFixed(6)), Number(lnglat.lat.toFixed(6))] as LngLatTuple
}

function updateCircleRadius(step: number) {
  circleRadius.value = Math.min(2000, Math.max(100, circleRadius.value + step))
}
</script>

<template>
  <main class="playground">
    <aside class="sidebar">
      <header class="header">
        <h1>AMap Vue Kit Playground</h1>
        <p>Adjust props, toggle overlays, and test interactions while iterating locally.</p>
      </header>

      <section class="card">
        <h2>View controls</h2>
        <dl class="metrics">
          <div>
            <dt>Center</dt>
            <dd>{{ centerText }}</dd>
          </div>
          <div>
            <dt>Zoom</dt>
            <dd>{{ zoom }}</dd>
          </div>
        </dl>
        <div class="button-row">
          <button type="button" @click="resetView">
            Reset view
          </button>
          <button type="button" @click="stepZoom(1)">
            Zoom in
          </button>
          <button type="button" @click="stepZoom(-1)">
            Zoom out
          </button>
        </div>
        <div class="nudge-grid">
          <button type="button" @click="nudge(0, 0.01)">
            Move north
          </button>
          <div class="nudge-center">
            <button type="button" @click="nudge(-0.01, 0)">
              Move west
            </button>
            <button type="button" @click="nudge(0.01, 0)">
              Move east
            </button>
          </div>
          <button type="button" @click="nudge(0, -0.01)">
            Move south
          </button>
        </div>
        <label class="toggle">
          <input v-model="markerDraggable" type="checkbox">
          <span>Draggable marker</span>
        </label>
        <label class="toggle">
          <input v-model="infoOpen" type="checkbox">
          <span>Info window open</span>
        </label>
      </section>

      <section class="card">
        <h2>Overlays</h2>
        <label class="toggle">
          <input v-model="showPolyline" type="checkbox">
          <span>Show polyline path</span>
        </label>
        <label class="toggle">
          <input v-model="showPolygon" type="checkbox">
          <span>Show polygon area</span>
        </label>
        <label class="toggle">
          <input v-model="showCircle" type="checkbox">
          <span>Show circle radius</span>
        </label>
        <div v-if="showCircle" class="radius-controls">
          <span>Radius: {{ circleRadius }} m</span>
          <div class="button-row">
            <button type="button" @click="updateCircleRadius(-100)">
              -100 m
            </button>
            <button type="button" @click="updateCircleRadius(100)">
              +100 m
            </button>
          </div>
        </div>
      </section>

      <section class="card notice">
        <h2>API key</h2>
        <p v-if="hasKey">
          Using key from <code>.env.local</code>. Restart the dev server after changing it.
        </p>
        <p v-else>
          Add <code>VITE_AMAP_KEY</code> to <code>.env.local</code> to load the live JSAPI map. Without it the container shows a
          placeholder.
        </p>
      </section>
    </aside>

    <section class="map-container">
      <div v-if="!hasKey" class="map-placeholder">
        <strong>No API key detected.</strong>
        <p>
          Set <code>VITE_AMAP_KEY</code> to explore the interactive map. The controls on the left still update component props.
        </p>
      </div>
      <AmapMap
        v-else
        class="map"
        :center="center"
        :zoom="zoom"
        :pitch="40"
        view-mode="3D"
        @moveend="handleMapMoveend"
      >
        <AmapMarker
          :position="center"
          :draggable="markerDraggable"
          @click="infoOpen = true"
          @dragend="handleMarkerDragend"
        />
        <AmapInfoWindow :position="center" :is-open="infoOpen" @close="infoOpen = false">
          <div class="info-window">
            <h3>Playground ready</h3>
            <p>
              Drag the marker or use the controls to experiment with overlays and map events. This view mirrors the behaviour of
              the published components.
            </p>
          </div>
        </AmapInfoWindow>
        <AmapPolyline v-if="showPolyline" :path="polylinePath" :options="polylineStyle" />
        <AmapPolygon v-if="showPolygon" :path="polygonPath" :options="polygonStyle" />
        <AmapCircle v-if="showCircle" :center="center" :radius="circleRadius" :options="circleStyle" />
      </AmapMap>
    </section>
  </main>
</template>

<style scoped>
.playground {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  background: #f1f5f9;
  color: #0f172a;
}

.sidebar {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.75));
  backdrop-filter: blur(12px);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.header p {
  margin: 0.75rem 0 0;
  line-height: 1.5;
  color: #475569;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.1rem 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 45px -28px rgba(15, 23, 42, 0.45);
}

.card h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.metrics div {
  background: rgba(15, 23, 42, 0.04);
  border-radius: 12px;
  padding: 0.75rem;
}

.metrics dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  margin: 0 0 0.25rem;
}

.metrics dd {
  margin: 0;
  font-family: 'Menlo', 'Fira Code', 'SFMono-Regular', monospace;
  font-size: 0.9rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.button-row button {
  border: none;
  border-radius: 9999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: #2563eb;
  cursor: pointer;
  transition: background 0.2s ease;
}

.button-row button:hover {
  background: #1d4ed8;
}

.nudge-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.nudge-center {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.nudge-grid button {
  border: none;
  border-radius: 12px;
  padding: 0.55rem 0.75rem;
  font-weight: 600;
  color: #1e293b;
  background: rgba(148, 163, 184, 0.18);
  cursor: pointer;
  transition: background 0.2s ease;
}

.nudge-grid button:hover {
  background: rgba(59, 130, 246, 0.25);
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #334155;
}

.toggle input {
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
}

.radius-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #1e293b;
}

.notice {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.25);
}

.notice p {
  margin: 0;
  color: #1e293b;
  line-height: 1.6;
}

.map-container {
  position: relative;
  background: #0f172a;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.map {
  width: 100%;
  height: 100vh;
}

.map-placeholder {
  margin: auto;
  max-width: 360px;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.9);
  color: #e2e8f0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map-placeholder strong {
  font-size: 1.1rem;
}

.map-placeholder code {
  background: rgba(148, 163, 184, 0.2);
  padding: 0.2rem 0.35rem;
  border-radius: 6px;
}

.info-window {
  min-width: 220px;
}

.info-window h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.info-window p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

@media (max-width: 960px) {
  .playground {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }

  .map {
    height: 70vh;
  }
}
</style>
