<script setup lang="ts">
import type { UseGeocoderOptions } from '@amap-vue/hooks'
import type { LngLatLike, LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, PropType } from 'vue'

import { useGeocoder } from '@amap-vue/hooks'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'

type GeocodeMode = 'forward' | 'reverse'

defineOptions({
  name: 'AmapReverseGeocodePanel',
})

const props = defineProps({
  position: {
    type: [Array, Object] as PropType<LngLatLike | undefined>,
    default: undefined,
  },
  address: {
    type: String,
    default: '',
  },
  auto: {
    type: Boolean,
    default: true,
  },
  geocoderOptions: {
    type: Object as PropType<Partial<AMap.GeocoderOptions>>,
    default: () => ({}),
  },
  loadOptions: {
    type: [Object, Function] as PropType<MaybeRefOrGetter<Partial<LoaderOptions> | undefined>>,
    default: undefined,
  },
})

const emit = defineEmits<{
  ready: [geocoder: AMap.Geocoder]
  result: [payload: { mode: GeocodeMode, result: AMap.GeocoderResult | null }]
  error: [message: string]
}>()

const geocoderOptions = computed<UseGeocoderOptions>(() => ({
  ...(props.geocoderOptions ?? {}),
  loadOptions: props.loadOptions,
}))

const geocoderApi = useGeocoder(geocoderOptions)
const geocoder = geocoderApi.geocoder

const loading = ref(false)
const mode = ref<GeocodeMode | null>(null)
const result = shallowRef<AMap.GeocoderResult | null>(null)
const errorMessage = ref<string | null>(null)

let readyEmitted = false

watch(geocoder, (value) => {
  if (value && !readyEmitted) {
    readyEmitted = true
    emit('ready', value)
    if (props.auto) {
      if (props.position)
        void reverse(props.position)
      else if (props.address)
        void search(props.address)
    }
  }
}, { immediate: true })

watch(() => props.position, (value, oldValue) => {
  if (!props.auto || value == null || value === oldValue)
    return
  void reverse(value)
}, { deep: true })

watch(() => props.address, (value, oldValue) => {
  if (!props.auto || !value || value === oldValue)
    return
  void search(value)
})

async function search(address: string) {
  const query = address || props.address
  if (!query) {
    clear()
    return
  }
  loading.value = true
  errorMessage.value = null
  const response = await geocoderApi.getLocation(query)
  loading.value = false
  mode.value = 'forward'
  result.value = response
  if (!response)
    handleError('未找到匹配的地址。')
  emit('result', { mode: 'forward', result: response })
}

async function reverse(position: LngLatLike) {
  const target = position ?? props.position
  if (!target) {
    clear()
    return
  }
  loading.value = true
  errorMessage.value = null
  const response = await geocoderApi.getAddress(target as any)
  loading.value = false
  mode.value = 'reverse'
  result.value = response
  if (!response)
    handleError('未能解析当前位置。')
  emit('result', { mode: 'reverse', result: response })
}

function handleError(message: string) {
  errorMessage.value = message
  emit('error', message)
}

function clear() {
  result.value = null
  errorMessage.value = null
  mode.value = null
}

onBeforeUnmount(() => {
  geocoderApi.destroy()
})

defineExpose({
  geocoder,
  loading,
  result,
  mode,
  error: errorMessage,
  search,
  reverse,
  clear,
})
</script>

<template>
  <div class="amap-geocode-panel">
    <slot
      :result="result"
      :loading="loading"
      :mode="mode"
      :error="errorMessage"
      :search="search"
      :reverse="reverse"
      :clear="clear"
    >
      <div class="amap-geocode-panel__body">
        <p v-if="loading" class="amap-geocode-panel__status">
          正在获取位置信息…
        </p>
        <p v-else-if="errorMessage" class="amap-geocode-panel__status amap-geocode-panel__status--error">
          {{ errorMessage }}
        </p>
        <template v-else-if="result">
          <header class="amap-geocode-panel__header">
            <strong>{{ result.formattedAddress }}</strong>
            <small v-if="mode">({{ mode === 'reverse' ? '逆地理' : '正向地理' }})</small>
          </header>
          <dl v-if="result.regeocode?.addressComponent" class="amap-geocode-panel__details">
            <div>
              <dt>省市</dt>
              <dd>{{ result.regeocode.addressComponent.province }}{{ result.regeocode.addressComponent.city }}</dd>
            </div>
            <div>
              <dt>区县</dt>
              <dd>{{ result.regeocode.addressComponent.district }}</dd>
            </div>
            <div>
              <dt>街道</dt>
              <dd>{{ result.regeocode.addressComponent.streetNumber?.street }}</dd>
            </div>
          </dl>
          <ul v-if="Array.isArray(result.regeocode?.pois) && result.regeocode.pois.length" class="amap-geocode-panel__pois">
            <li v-for="poi in result.regeocode.pois" :key="poi.id">
              {{ poi.name }}
            </li>
          </ul>
        </template>
        <p v-else class="amap-geocode-panel__status">
          暂无地址信息。
        </p>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.amap-geocode-panel {
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 32px -24px rgba(15, 23, 42, 0.6);
  padding: 1rem 1.25rem;
  max-width: 320px;
  font-size: 0.9rem;
}

.amap-geocode-panel__status {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.amap-geocode-panel__status--error {
  color: #dc2626;
}

.amap-geocode-panel__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.amap-geocode-panel__header strong {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.amap-geocode-panel__header small {
  color: #64748b;
}

.amap-geocode-panel__details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 0 0 0.75rem;
}

.amap-geocode-panel__details dt {
  margin: 0;
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
}

.amap-geocode-panel__details dd {
  margin: 0;
  color: #0f172a;
}

.amap-geocode-panel__pois {
  margin: 0;
  padding-left: 1rem;
  color: #1e293b;
  display: grid;
  gap: 0.25rem;
}

.amap-geocode-panel__pois li {
  list-style: disc;
}
</style>
