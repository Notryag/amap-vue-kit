<script setup lang="ts">
import { useWeather } from '@amap-vue/hooks'
import { computed, ref, shallowRef, watch } from 'vue'
import { useDemoLoader } from '../useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.Weather'] })

const weather = useWeather()
const city = ref('北京')
const cities = ['北京', '上海', '广州', '深圳', '成都']
const live = shallowRef<AMap.WeatherLiveResult | null>(null)
const forecast = shallowRef<AMap.WeatherForecastResult | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const forecastItems = computed(() => forecast.value?.forecasts ?? [])

async function refresh(target: string = city.value) {
  if (!target)
    return
  loading.value = true
  error.value = null
  try {
    const [liveResult, forecastResult] = await Promise.all([
      weather.getLive(target),
      weather.getForecast(target),
    ])
    live.value = liveResult
    forecast.value = forecastResult
    if (!liveResult && !forecastResult)
      error.value = '未获取到该城市的天气信息。'
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
  finally {
    loading.value = false
  }
}

watch(city, (value) => {
  if (hasKey.value)
    void refresh(value)
})

watch(hasKey, (value) => {
  if (value)
    void refresh(city.value)
}, { immediate: true })
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useWeather</code>.
    </div>
    <template v-else>
      <div class="amap-demo__panel">
        <div class="amap-demo__form">
          <label>
            城市
            <select v-model="city">
              <option v-for="item in cities" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>
          <button type="button" :disabled="loading" @click="refresh()">
            刷新天气
          </button>
        </div>
        <p v-if="loading" class="amap-demo__status">
          正在查询天气…
        </p>
        <p v-else-if="error" class="amap-demo__status amap-demo__status--error">
          {{ error }}
        </p>
        <div class="amap-demo__cards">
          <section v-if="live" class="amap-demo__card">
            <h4>实时天气</h4>
            <p class="amap-demo__primary">
              {{ live.weather }} · {{ live.temperature }}℃
            </p>
            <ul class="amap-demo__list">
              <li>风向：{{ live.windDirection }}</li>
              <li>风力：{{ live.windPower }}</li>
              <li>湿度：{{ live.humidity }}%</li>
              <li>发布时间：{{ live.reportTime }}</li>
            </ul>
          </section>
          <section v-if="forecastItems.length" class="amap-demo__card">
            <h4>未来预报</h4>
            <ul class="amap-demo__forecast">
              <li v-for="item in forecastItems" :key="item.date">
                <span>{{ item.date }} ({{ item.week }})</span>
                <span>{{ item.dayWeather }} / {{ item.nightWeather }}</span>
                <span>{{ item.dayTemp }}℃ / {{ item.nightTemp }}℃</span>
              </li>
            </ul>
          </section>
        </div>
        <p v-if="!loading && !error && !live && !forecastItems.length" class="amap-demo__muted">
          暂无天气数据。
        </p>
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

.amap-demo__form select {
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 0.35rem 0.5rem;
  background: var(--vp-c-bg);
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

.amap-demo__cards {
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

.amap-demo__forecast {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.amap-demo__forecast li {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
