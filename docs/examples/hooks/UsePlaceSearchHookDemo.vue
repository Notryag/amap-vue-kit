<script setup lang="ts">
import { usePlaceSearch } from '@amap-vue/hooks'
import { computed, ref, shallowRef } from 'vue'
import { useDemoLoader } from '../useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.PlaceSearch'] })

const placeSearch = usePlaceSearch({ city: '北京', pageSize: 5 })
const keyword = ref('美食')
const pageIndex = ref(1)
const result = shallowRef<AMap.PlaceSearchResult | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const poiList = computed(() => result.value?.poiList ?? null)
const pois = computed(() => poiList.value?.pois ?? [])
const totalPages = computed(() => {
  const list = poiList.value
  if (!list)
    return 1
  return list.pageSize > 0 ? Math.max(1, Math.ceil((list.count ?? 0) / list.pageSize)) : 1
})

async function runSearch() {
  if (!keyword.value) {
    result.value = null
    error.value = null
    return
  }
  loading.value = true
  error.value = null
  try {
    placeSearch.setPageIndex(pageIndex.value)
    const response = await placeSearch.search(keyword.value)
    result.value = response
    const resolvedIndex = response?.poiList?.pageIndex ?? pageIndex.value
    pageIndex.value = resolvedIndex
    if (!response || !response.poiList?.pois?.length)
      error.value = '未找到匹配的地点。'
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
  finally {
    loading.value = false
  }
}

function nextPage() {
  if (pageIndex.value >= totalPages.value)
    return
  pageIndex.value += 1
  void runSearch()
}

function prevPage() {
  if (pageIndex.value <= 1)
    return
  pageIndex.value -= 1
  void runSearch()
}

runSearch()
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>usePlaceSearch</code>.
    </div>
    <template v-else>
      <div class="amap-demo__panel">
        <div class="amap-demo__form">
          <label>
            关键字
            <input v-model="keyword" placeholder="输入关键词">
          </label>
          <div class="amap-demo__actions">
            <button type="button" :disabled="loading" @click="runSearch">
              查询地点
            </button>
            <button type="button" :disabled="loading || pageIndex <= 1" @click="prevPage">
              上一页
            </button>
            <button type="button" :disabled="loading || pageIndex >= totalPages" @click="nextPage">
              下一页
            </button>
          </div>
        </div>
        <p v-if="loading" class="amap-demo__status">
          查询中…
        </p>
        <p v-else-if="error" class="amap-demo__status amap-demo__status--error">
          {{ error }}
        </p>
        <ul v-else-if="pois.length" class="amap-demo__list">
          <li v-for="poi in pois" :key="poi.id ?? poi.name">
            <strong>{{ poi.name }}</strong>
            <small>
              {{ [poi.district, poi.address].filter(Boolean).join(' · ') || '—' }}
            </small>
          </li>
        </ul>
        <p v-else class="amap-demo__muted">
          输入关键字并点击查询即可获取 POI 列表。
        </p>
        <p class="amap-demo__muted">
          第 {{ pageIndex }} / {{ totalPages }} 页
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.amap-demo__actions {
  display: flex;
  gap: 0.5rem;
}

.amap-demo__actions button {
  flex: 1;
}
</style>
