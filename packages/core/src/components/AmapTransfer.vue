<script setup lang="ts">
import type { TransferEndpoint, UseTransferOptions } from '@amap-vue/hooks'
import { useTransfer } from '@amap-vue/hooks'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import AmapPolyline from './AmapPolyline.vue'

defineOptions({ name: 'AmapTransfer' })

const props = defineProps<{
  origin: TransferEndpoint
  destination: TransferEndpoint
  options?: UseTransferOptions
  auto?: boolean
}>()

const emit = defineEmits<{
  search: [result: AMap.TransferResult | null]
  error: [message: string]
}>()

const api = useTransfer(() => props.options)
const result = shallowRef<AMap.TransferResult | null>(null)
const selected = ref(0)
const loading = ref(false)
const error = ref('')
const modeLabels: Record<string, string> = { WALK: '步行', BUS: '公交', SUBWAY: '地铁' }
let request = 0

const plan = computed(() => result.value?.plans[selected.value])
const routes = computed(() => {
  const segments = plan.value?.segments.flatMap(({ transit, transit_mode }) => transit?.path?.length
    ? [
        { path: transit.path, mode: transit_mode },
      ]
    : []) ?? []

  return segments.length || !plan.value?.path?.length
    ? segments
    : [
        { path: plan.value.path, mode: '' },
      ]
})

function routeStyle(mode: string) {
  return {
    strokeColor: mode === 'WALK'
      ? '#64748b'
      : mode === 'SUBWAY'
        ? '#7c3aed'
        : '#2563eb',
    strokeWeight: 5,
    strokeStyle: mode === 'WALK'
      ? 'dashed'
      : 'solid',
  }
}

async function search() {
  const current = ++request
  loading.value = true
  error.value = ''
  let response: AMap.TransferResult | null = null
  try {
    response = await api.search(props.origin, props.destination)
  }
  catch {
    // SDK construction and request errors use the same feedback as callback errors.
  }

  if (current !== request)
    return

  result.value = response
  selected.value = 0
  loading.value = false
  if (!response?.plans.length) {
    error.value = '没有可用的换乘方案，请检查起终点、城市或高德服务配置。'
    emit('error', error.value)
  }
  emit('search', response)
}

function clear() {
  request++
  api.clear()
  result.value = null
  loading.value = false
  error.value = ''
}

watch(() => [
  props.origin,
  props.destination,
  props.options,
  props.auto,
], () => {
  clear()
  if (props.auto)
    void search()
}, { immediate: true, deep: true })

onBeforeUnmount(() => {
  request++
})

defineExpose({
  result,
  loading,
  error,
  selected,
  search,
  clear,
})
</script>

<template>
  <AmapPolyline v-for="({ path, mode }, index) in routes" :key="index" :path="path" :options="routeStyle(mode)" />
  <slot :result="result" :plan="plan" :loading="loading" :error="error" :search="search" :clear="clear">
    <div class="amap-transfer-panel">
      <div class="amap-transfer-actions">
        <button type="button" :disabled="loading" @click="search()">
          {{ loading ? '查询中…' : '查询公交换乘' }}
        </button>
        <button v-if="result" type="button" @click="clear">
          清除
        </button>
      </div>
      <p v-if="error" role="status">
        {{ error }}
      </p>
      <template v-if="result?.plans.length">
        <div class="amap-transfer-actions" aria-label="换乘方案">
          <button
            v-for="(item, index) in result.plans"
            :key="index"
            type="button"
            :aria-pressed="selected === index"
            @click="selected = index"
          >
            方案 {{ index + 1 }}<template v-if="item.time != null">
              · {{ Math.ceil(item.time / 60) }} 分钟
            </template>
          </button>
        </div>
        <ol v-if="plan?.segments.length">
          <li v-for="(segment, index) in plan.segments" :key="index">
            {{ segment.instruction || modeLabels[segment.transit_mode] || segment.transit_mode }}
          </li>
        </ol>
      </template>
    </div>
  </slot>
</template>

<style scoped>
.amap-transfer-panel {
  position: absolute;
  z-index: 1;
  inset: 12px 12px auto auto;
  max-width: min(300px, calc(100% - 24px));
  max-height: calc(100% - 24px);
  overflow: auto;
  padding: 10px;
  border-radius: 8px;
  background: var(--vp-c-bg, white);
  color: var(--vp-c-text-1, #1f2937);
  font-size: 14px;
}

.amap-transfer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.amap-transfer-actions button {
  border: 1px solid currentColor;
  border-radius: 4px;
  padding: 3px 8px;
}

.amap-transfer-actions button[aria-pressed='true'] {
  background: #2563eb;
  color: white;
}

.amap-transfer-panel ol,
.amap-transfer-panel p {
  margin: 8px 0 0;
}
</style>
