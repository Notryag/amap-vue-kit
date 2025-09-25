<script setup lang="ts">
import type { UseAutoCompleteOptions } from '@amap-vue/hooks'
import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, PropType } from 'vue'

import { useAutoComplete } from '@amap-vue/hooks'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapAutoComplete',
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  auto: {
    type: Boolean,
    default: true,
  },
  debounce: {
    type: Number,
    default: 250,
  },
  placeholder: {
    type: String,
    default: '搜索地点',
  },
  options: {
    type: Object as PropType<Partial<AMap.AutoCompleteOptions>>,
    default: () => ({}),
  },
  loadOptions: {
    type: [Object, Function] as PropType<MaybeRefOrGetter<Partial<LoaderOptions> | undefined>>,
    default: undefined,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'ready': [autoComplete: AMap.AutoComplete]
  'search': [payload: { keyword: string, tips: AMap.AutoCompleteTip[], result: AMap.AutoCompleteResult | null }]
  'select': [tip: AMap.AutoCompleteTip]
  'error': [message: string]
}>()

const keyword = ref(props.modelValue)
const tips = shallowRef<AMap.AutoCompleteTip[]>([])
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const autoCompleteOptions = computed<UseAutoCompleteOptions>(() => ({
  ...(props.options ?? {}),
  loadOptions: props.loadOptions,
}))

const autoCompleteApi = useAutoComplete(autoCompleteOptions)
const autoComplete = autoCompleteApi.autoComplete

watch(autoComplete, (value) => {
  if (value)
    emit('ready', value)
}, { immediate: true })

watch(() => props.modelValue, (value) => {
  if (value !== keyword.value)
    keyword.value = value
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(keyword, (value, oldValue) => {
  if (value === oldValue)
    return
  emit('update:modelValue', value)
  if (!props.auto)
    return
  scheduleSearch(value)
})

watch(() => props.options, (value, oldValue) => {
  if (value === oldValue)
    return
  autoCompleteApi.setOptions(value ?? {})
}, { deep: true })

function scheduleSearch(value: string) {
  if (debounceTimer != null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  if (props.debounce <= 0) {
    void runSearch(value)
    return
  }
  debounceTimer = window.setTimeout(() => {
    debounceTimer = null
    void runSearch(value)
  }, props.debounce)
}

async function runSearch(value: string = keyword.value) {
  const query = value?.trim()
  if (!query) {
    tips.value = []
    errorMessage.value = null
    emit('search', { keyword: '', tips: [], result: null })
    return
  }
  loading.value = true
  errorMessage.value = null
  const result = await autoCompleteApi.search(query)
  loading.value = false
  if (!result) {
    handleError('输入提示服务暂不可用，请稍后重试。')
    emit('search', { keyword: query, tips: [], result: null })
    return
  }
  const suggestions = Array.isArray(result.tips)
    ? result.tips.filter(tip => tip && (tip.name || tip.id))
    : []
  tips.value = suggestions
  if (!suggestions.length)
    errorMessage.value = '未找到匹配的地点。'
  emit('search', { keyword: query, tips: suggestions, result })
}

function handleError(message: string) {
  errorMessage.value = message
  emit('error', message)
}

function selectTip(tip: AMap.AutoCompleteTip) {
  emit('select', tip)
  if (tip?.name)
    keyword.value = tip.name
}

function clear() {
  tips.value = []
  errorMessage.value = null
  loading.value = false
}

onBeforeUnmount(() => {
  if (debounceTimer != null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  autoCompleteApi.destroy()
})

defineExpose({
  autoComplete,
  keyword,
  tips,
  loading,
  error: errorMessage,
  search: runSearch,
  select: selectTip,
  clear,
})
</script>

<template>
  <div class="amap-auto-complete">
    <slot
      :keyword="keyword"
      :tips="tips"
      :loading="loading"
      :error="errorMessage"
      :search="runSearch"
      :clear="clear"
      :select="selectTip"
    >
      <label class="amap-auto-complete__label">
        <span class="amap-auto-complete__label-text">搜索</span>
        <input v-model="keyword" :placeholder="placeholder" class="amap-auto-complete__input" type="text">
      </label>
      <p v-if="loading" class="amap-auto-complete__status">
        正在搜索…
      </p>
      <p v-else-if="errorMessage" class="amap-auto-complete__status amap-auto-complete__status--error">
        {{ errorMessage }}
      </p>
      <ul v-else-if="tips.length" class="amap-auto-complete__list">
        <li
          v-for="tip in tips"
          :key="tip.id ?? tip.name ?? `${tip.district}-${tip.address}`"
          class="amap-auto-complete__item"
          @click="selectTip(tip)"
        >
          <strong>{{ tip.name || '未知地点' }}</strong>
          <small>{{ [tip.district, tip.address].filter(Boolean).join(' · ') }}</small>
        </li>
      </ul>
      <p v-else class="amap-auto-complete__status">
        请输入关键字开始搜索。
      </p>
    </slot>
  </div>
</template>

<style scoped>
.amap-auto-complete {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.amap-auto-complete__label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.amap-auto-complete__label-text {
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.amap-auto-complete__input {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.amap-auto-complete__input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
}

.amap-auto-complete__status {
  margin: 0;
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  color: var(--vp-c-text-2);
}

.amap-auto-complete__status--error {
  color: var(--vp-c-danger-1);
  background: color-mix(in srgb, var(--vp-c-danger-1) 8%, transparent);
}

.amap-auto-complete__list {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.amap-auto-complete__item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.amap-auto-complete__item strong {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.amap-auto-complete__item small {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.amap-auto-complete__item:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}
</style>
