<script setup lang="ts">
import { useGeolocation } from '@amap-vue/hooks'
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { useDemoLoader } from '../useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.Geolocation'] })

const geolocation = useGeolocation()
const current = shallowRef<AMap.GeolocationResult | null>(null)
const cityInfo = shallowRef<AMap.GeolocationCityInfo | null>(null)
const watchId = ref<number | null>(null)
const log = ref<string[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const isWatching = computed(() => watchId.value !== null)

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

function formatLngLat(value: any) {
  const coords = normaliseLngLat(value)
  if (!coords)
    return '—'
  return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`
}

function pushLog(result: AMap.GeolocationResult, label: string) {
  const coords = formatLngLat(result.position)
  const timestamp = new Date().toLocaleTimeString()
  log.value = [`${timestamp} · ${label}：${coords}`, ...log.value].slice(0, 5)
}

async function locateOnce() {
  loading.value = true
  error.value = null
  try {
    const result = await geolocation.getCurrentPosition()
    current.value = result
    if (result)
      pushLog(result, '单次定位')
    else
      error.value = '定位失败，请重试。'
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
  finally {
    loading.value = false
  }
}

async function startWatch() {
  if (isWatching.value)
    return
  loading.value = true
  error.value = null
  try {
    const id = await geolocation.watchPosition((result) => {
      current.value = result
      pushLog(result, '持续定位')
    })
    if (typeof id === 'number')
      watchId.value = id
    else
      error.value = '无法启动持续定位。'
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
  finally {
    loading.value = false
  }
}

function stopWatch() {
  if (watchId.value === null)
    return
  geolocation.clearWatch(watchId.value)
  watchId.value = null
}

async function lookupCity() {
  error.value = null
  try {
    const info = await geolocation.getCityInfo()
    cityInfo.value = info
    if (!info)
      error.value = '未能获取城市信息。'
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

onBeforeUnmount(() => {
  stopWatch()
  geolocation.destroy()
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useGeolocation</code>.
    </div>
    <template v-else>
      <div class="amap-demo__panel">
        <div class="amap-demo__actions">
          <button type="button" :disabled="loading" @click="locateOnce">
            获取当前位置
          </button>
          <button type="button" :disabled="loading || isWatching" @click="startWatch">
            开始持续定位
          </button>
          <button type="button" :disabled="watchId === null" @click="stopWatch">
            停止持续定位
          </button>
          <button type="button" :disabled="loading" @click="lookupCity">
            查询所在城市
          </button>
        </div>
        <p v-if="loading" class="amap-demo__status">
          定位中…
        </p>
        <p v-else-if="error" class="amap-demo__status amap-demo__status--error">
          {{ error }}
        </p>
        <section v-if="current" class="amap-demo__card">
          <h4>当前定位</h4>
          <p class="amap-demo__primary">
            坐标：{{ formatLngLat(current.position) }}
          </p>
          <ul class="amap-demo__list">
            <li>精度：{{ current.accuracy ?? '—' }} 米</li>
            <li>
              是否在中国境内：{{ typeof current.isConverted === 'boolean' ? (current.isConverted ? '是' : '否') : '未知' }}
            </li>
          </ul>
        </section>
        <section v-if="cityInfo" class="amap-demo__card">
          <h4>城市信息</h4>
          <ul class="amap-demo__list">
            <li>省份：{{ cityInfo.province }}</li>
            <li>城市：{{ cityInfo.city || cityInfo.province }}</li>
            <li>区号：{{ cityInfo.citycode }}</li>
          </ul>
        </section>
        <section class="amap-demo__card">
          <h4>定位日志</h4>
          <ul class="amap-demo__list">
            <li v-if="!log.length" class="amap-demo__muted">
              点击按钮开始获取定位信息。
            </li>
            <li v-for="(entry, index) in log" :key="index">
              {{ entry }}
            </li>
          </ul>
        </section>
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

.amap-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.amap-demo__actions button {
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  border: 1px solid transparent;
  background: var(--vp-c-brand-1);
  color: white;
  cursor: pointer;
}

.amap-demo__actions button[disabled] {
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
