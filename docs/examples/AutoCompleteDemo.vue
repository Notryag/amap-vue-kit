<script setup lang="ts">
import { AmapAutoComplete } from '@amap-vue/core'
import { ref, shallowRef } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.AutoComplete'] })

const keyword = ref('咖啡')
const tips = shallowRef<AMap.AutoCompleteTip[]>([])
const selected = shallowRef<AMap.AutoCompleteTip | null>(null)

function handleSearch(payload: { tips: AMap.AutoCompleteTip[] }) {
  tips.value = payload.tips
}

function handleSelect(tip: AMap.AutoCompleteTip) {
  selected.value = tip
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>AmapAutoComplete</code>.
    </div>
    <template v-else>
      <div class="amap-demo__panel">
        <AmapAutoComplete v-model="keyword" @search="handleSearch" @select="handleSelect" />
        <section class="amap-demo__card">
          <h4>当前关键字</h4>
          <p class="amap-demo__primary">
            {{ keyword || '—' }}
          </p>
        </section>
        <section class="amap-demo__card">
          <h4>候选结果</h4>
          <ul v-if="tips.length" class="amap-demo__list">
            <li
              v-for="tip in tips"
              :key="tip.id ?? tip.name"
              class="amap-demo__item"
              :class="{ 'amap-demo__item--active': tip.id === selected?.id }"
              @click="handleSelect(tip)"
            >
              <strong>{{ tip.name || '未知' }}</strong>
              <small>
                {{ [tip.district, tip.address].filter(Boolean).join(' · ') || '—' }}
              </small>
            </li>
          </ul>
          <p v-else class="amap-demo__muted">
            输入关键字后即可看到输入提示。
          </p>
        </section>
        <section v-if="selected" class="amap-demo__card">
          <h4>已选择</h4>
          <p class="amap-demo__primary">
            {{ selected?.name }}
          </p>
          <p class="amap-demo__muted">
            {{ [selected?.district, selected?.address].filter(Boolean).join(' · ') || '—' }}
          </p>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.amap-demo__item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.amap-demo__item strong {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.amap-demo__item small {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.amap-demo__item:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}

.amap-demo__item--active {
  background: color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}
</style>
