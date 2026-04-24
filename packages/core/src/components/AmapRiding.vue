<script setup lang="ts">
import type { RidingEndpoint, UseRidingOptions } from '@amap-vue/hooks'
import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, PropType } from 'vue'

import { useRiding } from '@amap-vue/hooks'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapRiding',
})

const props = defineProps({
  origin: {
    type: [String, Array, Object] as PropType<RidingEndpoint | undefined>,
    default: undefined,
  },
  destination: {
    type: [String, Array, Object] as PropType<RidingEndpoint | undefined>,
    default: undefined,
  },
  auto: {
    type: Boolean,
    default: true,
  },
  panel: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.RidingOptions>>,
    default: () => ({}),
  },
  map: {
    type: [Object, Function] as PropType<MaybeRefOrGetter<AMap.Map | null | undefined>>,
    default: undefined,
  },
  loadOptions: {
    type: [Object, Function] as PropType<MaybeRefOrGetter<Partial<LoaderOptions> | undefined>>,
    default: undefined,
  },
})

const emit = defineEmits<{
  ready: [riding: AMap.Riding]
  search: [payload: { origin: RidingEndpoint, destination: RidingEndpoint, result: AMap.RidingResult | null }]
  error: [message: string]
}>()

const panelRef = ref<HTMLElement | null>(null)

const ridingOptions = computed<UseRidingOptions>(() => {
  const base: UseRidingOptions = {
    ...(props.options ?? {}),
    map: props.map,
    loadOptions: props.loadOptions,
  }

  if (props.panel)
    (base as any).panel = panelRef.value ?? (props.options as any)?.panel

  return base
})

const ridingApi = useRiding(ridingOptions)
const riding = ridingApi.riding

const originInput = ref(typeof props.origin === 'string' ? props.origin : '')
const destinationInput = ref(typeof props.destination === 'string' ? props.destination : '')

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const result = shallowRef<AMap.RidingResult | null>(null)

let readyEmitted = false

watch(riding, (value) => {
  if (value && !readyEmitted) {
    readyEmitted = true
    emit('ready', value)
    if (props.auto && props.origin && props.destination)
      void runSearch(props.origin, props.destination)
  }
}, { immediate: true })

watch(() => props.origin, (value) => {
  if (typeof value === 'string' && value !== originInput.value)
    originInput.value = value
})

watch(() => props.destination, (value) => {
  if (typeof value === 'string' && value !== destinationInput.value)
    destinationInput.value = value
})

watch(() => [props.origin, props.destination], ([origin, destination], [prevOrigin, prevDestination]) => {
  if (!props.auto)
    return
  if (origin === prevOrigin && destination === prevDestination)
    return
  if (origin && destination)
    void runSearch(origin, destination)
}, { deep: true })

function resolveOrigin() {
  const input = originInput.value.trim()
  if (input)
    return input
  return props.origin
}

function resolveDestination() {
  const input = destinationInput.value.trim()
  if (input)
    return input
  return props.destination
}

async function runSearch(origin: RidingEndpoint | undefined = resolveOrigin(), destination: RidingEndpoint | undefined = resolveDestination()) {
  if (!origin || !destination) {
    handleError('请填写起点和终点。')
    return
  }
  loading.value = true
  errorMessage.value = null
  const response = await ridingApi.search(origin, destination)
  loading.value = false
  result.value = response
  if (!response)
    handleError('骑行路线规划失败，请稍后重试。')
  emit('search', { origin, destination, result: response })
}

function clear() {
  ridingApi.clear()
  result.value = null
  errorMessage.value = null
  loading.value = false
}

function handleError(message: string) {
  errorMessage.value = message
  emit('error', message)
}

onBeforeUnmount(() => {
  ridingApi.destroy()
})

defineExpose({
  riding,
  panelRef,
  result,
  loading,
  error: errorMessage,
  search: runSearch,
  clear,
})
</script>

<template>
  <div class="amap-route-panel">
    <slot
      :origin="origin"
      :destination="destination"
      :result="result"
      :loading="loading"
      :error="errorMessage"
      :panel-ref="panelRef"
      :search="runSearch"
      :clear="clear"
    >
      <header class="amap-route-panel__header">
        <div class="amap-route-panel__field">
          <span>起点</span>
          <input v-model="originInput" class="amap-route-panel__input" type="text" placeholder="请输入起点">
        </div>
        <div class="amap-route-panel__field">
          <span>终点</span>
          <input v-model="destinationInput" class="amap-route-panel__input" type="text" placeholder="请输入终点">
        </div>
      </header>
      <div class="amap-route-panel__actions">
        <button type="button" class="amap-route-panel__button" @click="runSearch()">
          规划路线
        </button>
        <button type="button" class="amap-route-panel__button amap-route-panel__button--ghost" @click="clear">
          清空
        </button>
      </div>
      <p v-if="loading" class="amap-route-panel__status">
        正在规划路线…
      </p>
      <p v-else-if="errorMessage" class="amap-route-panel__status amap-route-panel__status--error">
        {{ errorMessage }}
      </p>
      <slot name="panel" :panel-ref="panelRef">
        <div v-if="panel" ref="panelRef" class="amap-route-panel__panel" />
      </slot>
      <p v-if="!loading && !errorMessage && !result" class="amap-route-panel__status">
        暂无路线结果。
      </p>
    </slot>
  </div>
</template>

<style scoped>
.amap-route-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 38px -28px rgba(15, 23, 42, 0.55);
  max-width: 360px;
}

.amap-route-panel__header {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.amap-route-panel__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #334155;
}

.amap-route-panel__input {
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.amap-route-panel__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.amap-route-panel__actions {
  display: flex;
  gap: 0.5rem;
}

.amap-route-panel__button {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-weight: 600;
  background: #f97316;
  color: #fff;
}

.amap-route-panel__button--ghost {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.amap-route-panel__status {
  margin: 0;
  font-size: 0.85rem;
  color: #475569;
}

.amap-route-panel__status--error {
  color: #dc2626;
}

.amap-route-panel__panel {
  min-height: 120px;
  border-radius: 10px;
  border: 1px dashed rgba(148, 163, 184, 0.4);
  padding: 0.5rem;
  font-size: 0.85rem;
  color: #475569;
}
</style>
