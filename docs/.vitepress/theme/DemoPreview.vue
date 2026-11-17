<script setup lang="ts">
import { ref } from 'vue'
import { configureDemoAccess, demoHasKey } from '../../examples/demo-access'

const key = ref('')
const security = ref('')
const error = ref('')
function applyKey() {
  if (!key.value.trim()) {
    error.value = '请填写高德 Web JSAPI Key。'
    return
  }
  configureDemoAccess(key.value.trim(), security.value.trim())
  key.value = ''
  security.value = ''
  error.value = ''
}
</script>

<template>
  <section class="demo-preview" aria-label="效果预览与示例代码">
    <div class="demo-preview__heading">
      效果预览
    </div>
    <form v-if="!demoHasKey" class="demo-key-form" @submit.prevent="applyKey">
      <p>输入自己的高德 Web JSAPI Key，即可在当前页面运行地图示例。配置仅保留在当前浏览器页面内。</p>
      <div class="demo-key-form__fields">
        <label>JSAPI Key<input v-model="key" type="password" autocomplete="off" placeholder="Web 端 JS API Key"></label>
        <label>安全密钥<input v-model="security" type="password" autocomplete="off" placeholder="securityJsCode"></label>
        <button type="submit">
          加载示例
        </button>
      </div>
      <p v-if="error" role="alert">
        {{ error }}
      </p>
    </form>
    <div class="demo-preview__canvas">
      <slot />
    </div>
    <details open class="demo-preview__source">
      <summary>示例代码</summary>
      <slot name="code" />
    </details>
  </section>
</template>
