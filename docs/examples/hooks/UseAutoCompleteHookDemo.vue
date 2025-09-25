<script setup lang="ts">
import { useAutoComplete } from '@amap-vue/hooks'
import { ref, shallowRef } from 'vue'
import { useDemoLoader } from '../useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.AutoComplete'] })

const autoComplete = useAutoComplete({ city: '北京' })
const keyword = ref('咖啡')
const suggestions = shallowRef<AMap.AutoCompleteTip[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function runSearch() {
  if (!keyword.value) {
    suggestions.value = []
    error.value = null
    return
  }
  loading.value = true
  error.value = null
  try {
    const result = await autoComplete.search(keyword.value)
    suggestions.value = result?.tips ?? []
    if (!result || !result.tips?.length)
      error.value = '未找到匹配的地点。'
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
  finally {
    loading.value = false
  }
}

runSearch()
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useAutoComplete</code>.
    </div>
    <template v-else>
      <div class="amap-demo__panel">
        <div class="amap-demo__form">
          <label>
            关键字
            <input v-model="keyword" placeholder="输入地点关键词">
          </label>
          <button type="button" :disabled="loading" @click="runSearch">
            查询输入提示
          </button>
        </div>
        <p v-if="loading" class="amap-demo__status">
          查询中…
        </p>
        <p v-else-if="error" class="amap-demo__status amap-demo__status--error">
          {{ error }}
        </p>
        <ul v-else-if="suggestions.length" class="amap-demo__list">
          <li v-for="tip in suggestions" :key="tip.id ?? tip.name">
            <strong>{{ tip.name }}</strong>
            <small>
              {{ [tip.district, tip.address].filter(Boolean).join(' · ') || '—' }}
            </small>
          </li>
        </ul>
        <p v-else class="amap-demo__muted">
          输入关键字后点击按钮以获取提示。
        </p>
      </div>
    </template>
  </div>
</template>
