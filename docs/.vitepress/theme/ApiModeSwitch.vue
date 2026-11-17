<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { apiGroups } from '../features'

const { page } = useData()
const feature = computed(() => apiGroups.flatMap(group => group.items).find(item =>
  page.value.relativePath === `components/${item.component}.md`
  || page.value.relativePath === `hooks/${item.hook}.md`,
))
const isHook = computed(() => page.value.relativePath.startsWith('hooks/'))
</script>

<template>
  <nav v-if="feature" class="api-mode-switch" aria-label="用法切换">
    <a v-if="feature.component" :href="withBase(`/components/${feature.component}.html`)" :aria-current="!isHook ? 'page' : undefined">
      组件用法
    </a>
    <a v-if="feature.hook" :href="withBase(`/hooks/${feature.hook}.html`)" :aria-current="isHook ? 'page' : undefined">
      Hook 用法
    </a>
  </nav>
</template>
