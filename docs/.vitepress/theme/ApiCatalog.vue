<script setup lang="ts">
import { withBase } from 'vitepress'
import { apiGroups } from '../features'
</script>

<template>
  <section v-for="group in apiGroups" :key="group.text" class="api-catalog-group">
    <h2>{{ group.text }}</h2>
    <div class="api-catalog-grid">
      <article v-for="feature in group.items" :key="feature.name" class="api-catalog-card">
        <h3>{{ feature.name }}</h3>
        <a v-if="feature.component" :href="withBase(`/components/${feature.component}.html`)">组件与地图示例 →</a>
        <a v-if="feature.hook" :href="withBase(`/hooks/${feature.hook}.html`)">Hook 用法 →</a>
      </article>
    </div>
  </section>
</template>
