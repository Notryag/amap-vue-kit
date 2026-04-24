<script setup lang="ts">
import { useWalking } from '@amap-vue/hooks'
import { computed, ref, shallowRef } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const origin = ref('天安门')
const destination = ref('景山公园')
const loading = ref(false)
const error = ref<string | null>(null)
const result = shallowRef<AMap.WalkingResult | null>(null)

const panelRef = ref<HTMLDivElement | null>(null)

const { container, hasKey, map } = useHookDemoMap({}, { plugins: ['AMap.Walking'] })

const walking = useWalking(computed(() => ({
  map: map.value,
  panel: panelRef.value ?? undefined,
})))

async function runSearch() {
  if (!origin.value || !destination.value) {
    error.value = '请填写起点和终点。'
    return
  }
  loading.value = true
  error.value = null
  result.value = await walking.search(origin.value, destination.value)
  loading.value = false
  if (!result.value)
    error.value = '未找到可用的步行路线。'
}

function clear() {
  walking.clear()
  result.value = null
  error.value = null
  loading.value = false
}
</script>

<template>
  <div class="amap-demo amap-demo--split">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useWalking</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__sidebar">
        <div class="amap-demo__form">
          <label>
            起点
            <input v-model="origin" placeholder="请输入起点">
          </label>
          <label>
            终点
            <input v-model="destination" placeholder="请输入终点">
          </label>
          <div class="amap-demo__actions">
            <button type="button" :disabled="loading" @click="runSearch">
              规划路线
            </button>
            <button type="button" class="ghost" :disabled="loading" @click="clear">
              清空
            </button>
          </div>
        </div>
        <p v-if="loading" class="amap-demo__status">
          正在规划路线…
        </p>
        <p v-else-if="error" class="amap-demo__status amap-demo__status--error">
          {{ error }}
        </p>
        <div ref="panelRef" class="amap-demo__panel" />
        <p v-if="!loading && !error && !result" class="amap-demo__muted">
          输入起点和终点并点击规划路线。
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

.amap-demo__panel {
  min-height: 140px;
}

.ghost {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}
</style>
