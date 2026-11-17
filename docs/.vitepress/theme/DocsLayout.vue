<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ApiModeSwitch from './ApiModeSwitch.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <ApiModeSwitch />
    </template>
  </Layout>
</template>
