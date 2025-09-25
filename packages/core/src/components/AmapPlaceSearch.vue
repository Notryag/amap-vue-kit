<script setup lang="ts">
import type { UsePlaceSearchOptions } from '@amap-vue/hooks'
import type { BoundsLike, LngLatLike, LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, PropType } from 'vue'

import { usePlaceSearch } from '@amap-vue/hooks'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapPlaceSearch',
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  mode: {
    type: String as PropType<'keyword' | 'nearby' | 'bounds'>,
    default: 'keyword',
  },
  location: {
    type: [Array, Object] as PropType<LngLatLike | undefined>,
    default: undefined,
  },
  radius: {
    type: Number,
    default: 1000,
  },
  bounds: {
    type: [Array, Object] as PropType<BoundsLike | undefined>,
    default: undefined,
  },
  auto: {
    type: Boolean,
    default: true,
  },
  debounce: {
    type: Number,
    default: 300,
  },
  placeholder: {
    type: String,
    default: '搜索地点、地址或兴趣点',
  },
  options: {
    type: Object as PropType<Partial<AMap.PlaceSearchOptions>>,
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
  'update:modelValue': [value: string]
  'ready': [placeSearch: AMap.PlaceSearch]
  'search': [payload: { keyword: string, result: AMap.PlaceSearchResult | null }]
  'select': [poi: AMap.PlaceSearchPoi]
  'error': [message: string]
}>()

const keyword = ref(props.modelValue)
const result = shallowRef<AMap.PlaceSearchResult | null>(null)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const placeSearchOptions = computed<UsePlaceSearchOptions>(() => ({
  ...(props.options ?? {}),
  map: props.map,
  loadOptions: props.loadOptions,
}))

const placeSearchApi = usePlaceSearch(placeSearchOptions)
const placeSearch = placeSearchApi.placeSearch

watch(placeSearch, (value) => {
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
  placeSearchApi.setOptions(value ?? {})
}, { deep: true })

watch(() => [props.mode, props.location, props.radius, props.bounds], () => {
  if (props.auto && keyword.value)
    scheduleSearch(keyword.value)
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

const pois = computed(() => result.value?.poiList?.pois ?? [])
const pagination = computed(() => {
  const list = result.value?.poiList
  const pageSize = list?.pageSize ?? props.options?.pageSize ?? 10
  const pageIndex = list?.pageIndex ?? props.options?.pageIndex ?? 1
  const total = list?.count ?? pois.value.length
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1
  return { pageSize, pageIndex, total, totalPages }
})

async function runSearch(value: string = keyword.value) {
  const query = value?.trim()
  if (!query) {
    result.value = null
    errorMessage.value = null
    emit('search', { keyword: '', result: null })
    return
  }
  loading.value = true
  errorMessage.value = null

  let response: AMap.PlaceSearchResult | null = null
  if (props.mode === 'nearby' && props.location)
    response = await placeSearchApi.searchNearBy(query, props.location as any, props.radius)
  else if (props.mode === 'bounds' && props.bounds)
    response = await placeSearchApi.searchInBounds(query, props.bounds as any)
  else
    response = await placeSearchApi.search(query)

  loading.value = false
  result.value = response
  if (!response) {
    handleError('地点搜索服务暂不可用，请稍后重试。')
    emit('search', { keyword: query, result: null })
    return
  }

  const list = response.poiList
  if (!list?.pois?.length)
    errorMessage.value = '未找到匹配的地点，请尝试更换关键字。'

  emit('search', { keyword: query, result: response })
}

function handleError(message: string) {
  errorMessage.value = message
  emit('error', message)
}

function selectPoi(poi: AMap.PlaceSearchPoi) {
  emit('select', poi)
}

async function goToPage(page: number) {
  if (!Number.isFinite(page))
    return
  const target = Math.max(1, Math.floor(page))
  placeSearchApi.setPageIndex(target)
  await runSearch(keyword.value)
}

function nextPage() {
  if (pagination.value.pageIndex >= pagination.value.totalPages)
    return
  void goToPage(pagination.value.pageIndex + 1)
}

function prevPage() {
  if (pagination.value.pageIndex <= 1)
    return
  void goToPage(pagination.value.pageIndex - 1)
}

function clear() {
  placeSearchApi.clear()
  result.value = null
  errorMessage.value = null
  loading.value = false
}

onBeforeUnmount(() => {
  if (debounceTimer != null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  placeSearchApi.destroy()
})

defineExpose({
  placeSearch,
  keyword,
  result,
  pois,
  loading,
  error: errorMessage,
  pagination,
  search: runSearch,
  select: selectPoi,
  clear,
  goToPage,
  nextPage,
  prevPage,
})
</script>

<template>
  <div class="amap-place-search">
    <slot
      :keyword="keyword"
      :result="result"
      :pois="pois"
      :loading="loading"
      :error="errorMessage"
      :pagination="pagination"
      :search="runSearch"
      :clear="clear"
      :select="selectPoi"
      :next-page="nextPage"
      :prev-page="prevPage"
      :go-to-page="goToPage"
    >
      <label class="amap-place-search__label">
        <span class="amap-place-search__label-text">搜索</span>
        <input v-model="keyword" :placeholder="placeholder" class="amap-place-search__input" type="text">
      </label>
      <div class="amap-place-search__actions">
        <button type="button" class="amap-place-search__button" @click="runSearch()">
          搜索
        </button>
        <button type="button" class="amap-place-search__button amap-place-search__button--ghost" @click="clear">
          清空
        </button>
      </div>
      <p v-if="loading" class="amap-place-search__status">
        正在搜索…
      </p>
      <p v-else-if="errorMessage" class="amap-place-search__status amap-place-search__status--error">
        {{ errorMessage }}
      </p>
      <ul v-else-if="pois.length" class="amap-place-search__list">
        <li
          v-for="poi in pois"
          :key="poi.id ?? poi.name ?? `${poi.district}-${poi.address}`"
          class="amap-place-search__item"
          @click="selectPoi(poi)"
        >
          <strong>{{ poi.name || '未知地点' }}</strong>
          <small>
            {{ [poi.district, poi.address].filter(Boolean).join(' · ') }}
          </small>
        </li>
      </ul>
      <p v-else class="amap-place-search__status">
        未找到匹配的地点，请尝试其他关键字。
      </p>
      <div v-if="pagination.totalPages > 1" class="amap-place-search__pagination">
        <button type="button" class="amap-place-search__pager" :disabled="pagination.pageIndex <= 1" @click="prevPage">
          上一页
        </button>
        <span class="amap-place-search__page-info">
          第 {{ pagination.pageIndex }} / {{ pagination.totalPages }} 页
        </span>
        <button
          type="button"
          class="amap-place-search__pager"
          :disabled="pagination.pageIndex >= pagination.totalPages"
          @click="nextPage"
        >
          下一页
        </button>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.amap-place-search {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.amap-place-search__label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.amap-place-search__label-text {
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.amap-place-search__input {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.amap-place-search__input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
}

.amap-place-search__actions {
  display: flex;
  gap: 0.5rem;
}

.amap-place-search__button {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: var(--vp-c-brand-1);
  color: white;
  font-weight: 600;
  transition: background 0.2s ease;
}

.amap-place-search__button:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 85%, white 15%);
}

.amap-place-search__button--ghost {
  background: color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
  color: var(--vp-c-brand-1);
}

.amap-place-search__status {
  margin: 0;
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  color: var(--vp-c-text-2);
}

.amap-place-search__status--error {
  color: var(--vp-c-danger-1);
  background: color-mix(in srgb, var(--vp-c-danger-1) 8%, transparent);
}

.amap-place-search__list {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.amap-place-search__item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.amap-place-search__item strong {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.amap-place-search__item small {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.amap-place-search__item:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}

.amap-place-search__pagination {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-end;
}

.amap-place-search__pager {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: white;
  cursor: pointer;
  color: var(--vp-c-text-1);
  transition: all 0.15s ease;
}

.amap-place-search__pager:disabled {
  cursor: not-allowed;
  color: var(--vp-c-text-3);
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.amap-place-search__page-info {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
