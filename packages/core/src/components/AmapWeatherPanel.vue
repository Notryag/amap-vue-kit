<script setup lang="ts">
import type { UseWeatherOptions } from '@amap-vue/hooks'
import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, PropType } from 'vue'

import { useWeather } from '@amap-vue/hooks'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapWeatherPanel',
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  cities: {
    type: Array as PropType<string[]>,
    default: () => ['北京', '上海', '广州', '深圳'],
  },
  auto: {
    type: Boolean,
    default: true,
  },
  loadOptions: {
    type: [Object, Function] as PropType<MaybeRefOrGetter<Partial<LoaderOptions> | undefined>>,
    default: undefined,
  },
})

const emit = defineEmits<{
  'update:modelValue': [city: string]
  'ready': [weather: AMap.Weather]
  'error': [message: string]
}>()

const weatherOptions = computed<UseWeatherOptions>(() => ({
  loadOptions: props.loadOptions,
}))

const weatherApi = useWeather(weatherOptions)
const weather = weatherApi.weather

const currentCity = ref(props.modelValue || props.cities[0] || '')
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const live = shallowRef<AMap.WeatherLiveResult | null>(null)
const forecast = shallowRef<AMap.WeatherForecastResult | null>(null)

let readyEmitted = false

watch(weather, (value) => {
  if (value && !readyEmitted) {
    readyEmitted = true
    emit('ready', value)
    if (props.auto && currentCity.value)
      void refresh(currentCity.value)
  }
}, { immediate: true })

watch(() => props.modelValue, (value) => {
  if (value && value !== currentCity.value) {
    currentCity.value = value
    if (props.auto)
      void refresh(value)
  }
})

watch(currentCity, (value, oldValue) => {
  if (value && value !== oldValue)
    emit('update:modelValue', value)
})

onBeforeUnmount(() => {
  weatherApi.destroy()
})

async function refresh(city: string = currentCity.value) {
  if (!city)
    return
  loading.value = true
  errorMessage.value = null
  try {
    const [liveResult, forecastResult] = await Promise.all([
      weatherApi.getLive(city),
      weatherApi.getForecast(city),
    ])
    live.value = liveResult
    forecast.value = forecastResult
    if (!liveResult && !forecastResult)
      handleError('未获取到该城市的天气信息。')
  }
  catch (error) {
    handleError(error instanceof Error ? error.message : String(error))
  }
  finally {
    loading.value = false
  }
}

function handleError(message: string) {
  errorMessage.value = message
  emit('error', message)
}

function handleSelect(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target)
    return
  const value = target.value
  currentCity.value = value
  void refresh(value)
}

defineExpose({
  weather,
  live,
  forecast,
  loading,
  error: errorMessage,
  refresh,
})
</script>

<template>
  <div class="amap-weather-panel">
    <header class="amap-weather-panel__header">
      <label>
        <span>城市</span>
        <select :value="currentCity" @change="handleSelect">
          <option v-for="city in cities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </label>
      <button type="button" @click="refresh()">
        刷新
      </button>
    </header>
    <div class="amap-weather-panel__body">
      <p v-if="loading" class="amap-weather-panel__status">正在查询天气…</p>
      <p v-else-if="errorMessage" class="amap-weather-panel__status amap-weather-panel__status--error">{{ errorMessage }}</p>
      <template v-else>
        <section v-if="live" class="amap-weather-panel__live">
          <h3>实时天气</h3>
          <p class="amap-weather-panel__temperature">{{ live.temperature }}℃ · {{ live.weather }}</p>
          <ul>
            <li>风向：{{ live.windDirection }}</li>
            <li>风力：{{ live.windPower }}</li>
            <li>湿度：{{ live.humidity }}%</li>
            <li>更新时间：{{ live.reportTime }}</li>
          </ul>
        </section>
        <section v-if="forecast?.forecasts?.length" class="amap-weather-panel__forecast">
          <h3>未来预报</h3>
          <ul>
            <li v-for="item in forecast.forecasts" :key="item.date">
              <span>{{ item.date }} ({{ item.week }})</span>
              <span>{{ item.dayWeather }} / {{ item.nightWeather }}</span>
              <span>{{ item.dayTemp }}℃ / {{ item.nightTemp }}℃</span>
            </li>
          </ul>
        </section>
        <p v-if="!live && !forecast" class="amap-weather-panel__status">暂无天气数据。</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.amap-weather-panel {
  width: 100%;
  max-width: 360px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 32px -26px rgba(15, 23, 42, 0.55);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.amap-weather-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.amap-weather-panel__header label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #1e293b;
}

.amap-weather-panel__header select {
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 0.45rem 0.75rem;
  font-size: 0.9rem;
}

.amap-weather-panel__header button {
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
}

.amap-weather-panel__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #0f172a;
}

.amap-weather-panel__status {
  margin: 0;
  color: #475569;
}

.amap-weather-panel__status--error {
  color: #dc2626;
}

.amap-weather-panel__live ul {
  margin: 0.5rem 0 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.25rem;
  color: #334155;
}

.amap-weather-panel__temperature {
  margin: 0.25rem 0 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.amap-weather-panel__forecast ul {
  margin: 0.5rem 0 0;
  padding-left: 0;
  list-style: none;
  display: grid;
  gap: 0.35rem;
  color: #1e293b;
}

.amap-weather-panel__forecast li {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}
</style>
