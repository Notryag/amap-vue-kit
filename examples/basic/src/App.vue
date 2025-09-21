<template>
  <main class="app">
    <h1>AMap Vue Kit Example</h1>
    <p>Interact with the map to explore the declarative API.</p>
    <div class="map-shell">
      <div v-if="!hasKey" class="map-placeholder">
        Set <code>VITE_AMAP_KEY</code> in `.env.local` to load the live JSAPI map.
      </div>
      <AmapMap v-else :center="center" :zoom="zoom" class="map">
        <AmapMarker :position="center" @click="toggleInfo" />
        <AmapInfoWindow :position="center" :is-open="infoOpen">
          <div class="info">
            <h4>Welcome!</h4>
            <p>The marker toggles this info window.</p>
          </div>
        </AmapInfoWindow>
      </AmapMap>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const center = ref<[number, number]>([116.397, 39.908])
const zoom = ref(11)
const infoOpen = ref(true)
const hasKey = computed(() => Boolean(import.meta.env.VITE_AMAP_KEY))

function toggleInfo() {
  infoOpen.value = !infoOpen.value
}
</script>

<style scoped>
.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.map-shell {
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  overflow: hidden;
  min-height: 360px;
}

.map {
  height: 360px;
  width: 100%;
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360px;
  color: #475569;
  background: #f8fafc;
  text-align: center;
  padding: 1.5rem;
}

.info {
  min-width: 180px;
}
</style>
