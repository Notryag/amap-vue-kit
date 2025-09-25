<script setup lang="ts">
import { AmapMap, AmapMarker, AmapPlaceSearch } from '@amap-vue/core'
import { computed, ref, shallowRef } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.PlaceSearch'] })

const keyword = ref('美食')
const pois = shallowRef<AMap.PlaceSearchPoi[]>([])
const selected = shallowRef<AMap.PlaceSearchPoi | null>(null)

function normaliseLngLat(value: any): [number, number] | null {
  if (!value)
    return null
  if (typeof value.getLng === 'function' && typeof value.getLat === 'function')
    return [Number(value.getLng()), Number(value.getLat())]
  if (Array.isArray(value) && value.length >= 2)
    return [Number(value[0]), Number(value[1])]
  if (typeof value.lng === 'number' && typeof value.lat === 'number')
    return [Number(value.lng), Number(value.lat)]
  return null
}

const mapCenter = computed<[number, number]>(() => normaliseLngLat(selected.value?.location) ?? [116.397, 39.909])
const markerPois = computed(() =>
  pois.value
    .map(poi => ({ poi, position: normaliseLngLat(poi.location) as [number, number] | null }))
    .filter((entry): entry is { poi: AMap.PlaceSearchPoi, position: [number, number] } => Array.isArray(entry.position)),
)

function handleSearch(payload: { result: AMap.PlaceSearchResult | null }) {
  pois.value = payload.result?.poiList?.pois ?? []
  if (pois.value.length && !selected.value)
    selected.value = pois.value[0] ?? null
}

function handleSelect(poi: AMap.PlaceSearchPoi) {
  selected.value = poi
}
</script>

<template>
  <div class="amap-demo amap-demo--split">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>AmapPlaceSearch</code>.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="mapCenter" :zoom="selected ? 15 : 12">
          <AmapMarker
            v-for="item in markerPois"
            :key="item.poi.id ?? item.poi.name"
            :position="item.position"
            @click="handleSelect(item.poi)"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__sidebar">
        <AmapPlaceSearch v-model="keyword" @search="handleSearch" @select="handleSelect" />
        <section v-if="selected" class="amap-demo__card">
          <h4>选中地点</h4>
          <p class="amap-demo__primary">
            {{ selected?.name }}
          </p>
          <p class="amap-demo__muted">
            {{ [selected?.district, selected?.address].filter(Boolean).join(' · ') || '—' }}
          </p>
        </section>
      </div>
    </template>
  </div>
</template>
