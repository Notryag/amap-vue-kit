<script setup lang="ts">
import { useGeocoder } from '@amap-vue/hooks'
import { computed, ref, shallowRef } from 'vue'
import { useDemoLoader } from '../useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.Geocoder'] })

const geocoder = useGeocoder()

const address = ref('天安门广场')
const city = ref('北京')
const lng = ref(116.397)
const lat = ref(39.909)
const loading = ref(false)
const error = ref<string | null>(null)
const locationResult = shallowRef<AMap.GeocoderResult | null>(null)
const reverseResult = shallowRef<AMap.GeocoderResult | null>(null)

const locationEntry = computed(() => locationResult.value?.geocodes?.[0] ?? null)
const reverseEntry = computed(() => reverseResult.value?.regeocode ?? null)

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

function displayLngLat(value: any) {
  const coords = normaliseLngLat(value)
  if (!coords)
    return '—'
  return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`
}

async function searchAddress() {
  if (!address.value)
    return
  loading.value = true
  error.value = null
  try {
    const result = await geocoder.getLocation(address.value, city.value || undefined)
    locationResult.value = result
    if (result?.geocodes?.length) {
      const coords = normaliseLngLat(result.geocodes[0]?.location)
      if (coords) {
        lng.value = Number(coords[0].toFixed(6))
        lat.value = Number(coords[1].toFixed(6))
      }
    }
    if (!result)
      error.value = '未找到匹配的地址。'
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
  finally {
    loading.value = false
  }
}

async function reverseLookup() {
  loading.value = true
  error.value = null
  try {
    const result = await geocoder.getAddress([Number(lng.value), Number(lat.value)])
    reverseResult.value = result
    if (!result)
      error.value = '未查询到对应的地址。'
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useGeocoder</code>.
    </div>
    <template v-else>
      <div class="amap-demo__panel">
        <div class="amap-demo__form">
          <label>
            地址
            <input v-model="address" placeholder="输入地址关键字">
          </label>
          <label>
            城市
            <input v-model="city" placeholder="可选，例如：北京">
          </label>
          <button type="button" :disabled="loading" @click="searchAddress">
            正向地理编码
          </button>
        </div>
        <div class="amap-demo__form">
          <label>
            经度
            <input v-model.number="lng" type="number" step="0.000001">
          </label>
          <label>
            纬度
            <input v-model.number="lat" type="number" step="0.000001">
          </label>
          <button type="button" :disabled="loading" @click="reverseLookup">
            逆地理编码
          </button>
        </div>
        <p v-if="loading" class="amap-demo__status">
          查询中…
        </p>
        <p v-else-if="error" class="amap-demo__status amap-demo__status--error">
          {{ error }}
        </p>
        <div v-else class="amap-demo__results">
          <section v-if="locationEntry" class="amap-demo__card">
            <h4>正向结果</h4>
            <p class="amap-demo__primary">
              {{ locationEntry.formattedAddress }}
            </p>
            <p class="amap-demo__muted">
              {{ displayLngLat(locationEntry.location) }}
            </p>
          </section>
          <section v-if="reverseEntry" class="amap-demo__card">
            <h4>逆向结果</h4>
            <p class="amap-demo__primary">
              {{ reverseEntry.formattedAddress }}
            </p>
            <ul class="amap-demo__list">
              <li>省份：{{ reverseEntry.addressComponent?.province }}</li>
              <li>城市：{{ reverseEntry.addressComponent?.city || reverseEntry.addressComponent?.province }}</li>
              <li>区县：{{ reverseEntry.addressComponent?.district }}</li>
              <li v-if="reverseEntry.pois?.length">
                附近 POI：{{ reverseEntry.pois[0]?.name }}
              </li>
            </ul>
          </section>
          <p v-if="!locationEntry && !reverseEntry" class="amap-demo__muted">
            输入信息后点击按钮进行查询。
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.amap-demo__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.25rem;
}

.amap-demo__form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
}

.amap-demo__form label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
}

.amap-demo__form input {
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 0.35rem 0.5rem;
}

.amap-demo__form button {
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  border: 1px solid transparent;
  background: var(--vp-c-brand-1);
  color: white;
  cursor: pointer;
}

.amap-demo__form button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.amap-demo__status {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.amap-demo__status--error {
  color: var(--vp-c-danger-1);
}

.amap-demo__results {
  display: grid;
  gap: 0.75rem;
}

.amap-demo__card {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: var(--vp-c-bg-soft);
}

.amap-demo__card h4 {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
}

.amap-demo__primary {
  font-weight: 600;
}

.amap-demo__muted {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.amap-demo__list {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
</style>
