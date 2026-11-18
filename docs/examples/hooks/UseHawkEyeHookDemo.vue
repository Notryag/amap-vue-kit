<script setup lang="ts">
import { useHawkEye } from '@amap-vue/hooks'
import { ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const visible = ref(true)
const isOpen = ref(true)
const { container, hasKey, map } = useHookDemoMap()
useHawkEye(() => map.value, () => ({
  visible: visible.value,
  isOpen: isOpen.value,
  width: '180px',
  height: '140px',
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      配置 VITE_AMAP_KEY 后查看示例。
    </div>
    <template v-else>
      <div class="amap-demo__toolbar">
        <label><input v-model="visible" type="checkbox"> 显示鹰眼</label>
        <label><input v-model="isOpen" type="checkbox"> 展开鹰眼</label>
      </div>
      <div ref="container" style="height: 360px" />
    </template>
  </div>
</template>
