<script setup lang="ts">
import { AmapGeoJSONLayer, AmapMap } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

useDemoLoader()

const geojson = ref({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Demo Polygon' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.37, 39.9],
            [116.39, 39.92],
            [116.43, 39.91],
            [116.41, 39.88],
            [116.37, 39.9],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Marker' },
      geometry: {
        type: 'Point',
        coordinates: [116.404, 39.915],
      },
    },
  ],
})

const options = computed(() => ({
  getPolygon: (_feature: any, path: AMap.LngLat[]) => new AMap.Polygon({
    path,
    strokeColor: '#10b981',
    strokeWeight: 2,
    fillColor: 'rgba(16, 185, 129, 0.18)',
  }),
  getMarker: (_feature: any, position: AMap.LngLat) => new AMap.Marker({
    position,
    label: { content: 'POI', direction: 'top' },
  }),
}))

function toggleSecondPoint() {
  const collection = geojson.value
  const index = collection.features.findIndex(feature => feature.properties?.name === 'Marker')
  if (index >= 0) {
    collection.features.splice(index, 1)
  }
  else {
    collection.features.push({
      type: 'Feature',
      properties: { name: 'Marker' },
      geometry: { type: 'Point', coordinates: [116.404, 39.915] },
    })
  }
  geojson.value = { ...collection, features: [...collection.features] }
}
</script>

<template>
  <div class="amap-demo">
    <div class="amap-demo__map">
      <AmapMap :center="[116.397, 39.909]" :zoom="12">
        <AmapGeoJSONLayer :data="geojson" :options="options" />
      </AmapMap>
    </div>
    <div class="amap-demo__toolbar">
      <button type="button" @click="toggleSecondPoint">
        Toggle marker feature
      </button>
      <div>Features: {{ geojson.features.length }}</div>
    </div>
  </div>
</template>
