<script setup lang="ts">
import { AmapHawkEye, AmapMap } from '@amap-vue/core'
import { loader } from '@amap-vue/shared'
import { ref } from 'vue'

const key = import.meta.env.VITE_AMAP_KEY
if (key)
  loader.config({ key, securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE })
const visible = ref(true)
const isOpen = ref(true)
const width = ref('180px')
</script>

<template>
  <section>
    <div class="hawk-eye-actions">
      <label><input v-model="visible" type="checkbox"> 显示鹰眼</label>
      <label><input v-model="isOpen" type="checkbox"> 展开鹰眼</label>
      <label>宽度 <select v-model="width"><option>180px</option><option>240px</option></select></label>
    </div>
    <AmapMap v-if="key" :center="[116.397, 39.908]" :zoom="12" style="height: 360px">
      <AmapHawkEye :visible="visible" :is-open="isOpen" :width="width" height="140px" :offset="[12, 12]" />
    </AmapMap>
    <p v-else>
      配置 VITE_AMAP_KEY 和 VITE_AMAP_SECURITY_CODE 后查看鹰眼示例。
    </p>
  </section>
</template>

<style scoped>
.hawk-eye-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}
</style>
