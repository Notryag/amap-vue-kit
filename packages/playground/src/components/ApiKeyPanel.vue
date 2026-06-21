<script setup lang="ts">
import type { useAmapKey } from '../composables/useAmapKey'

const props = defineProps<{
  keyState: ReturnType<typeof useAmapKey>
}>()

defineEmits<{
  applyRuntimeKey: []
  clearRuntimeKey: []
}>()

const PLAYGROUND_KEY_STORAGE_KEY = 'amap-vue-kit:playground:key'
const {
  runtimeKeyDraft,
  usingEnvKey,
  usingRuntimeKey,
  canApplyRuntimeKey,
} = props.keyState
</script>

<template>
  <section class="card notice">
    <h2>API Key</h2>
    <template v-if="usingEnvKey">
      <p>
        正在使用 <code>.env.local</code> 中的 Key。修改后请重启开发服务器。
      </p>
    </template>
    <template v-else>
      <p v-if="usingRuntimeKey">
        正在使用保存在当前浏览器中的临时 Key。清除后会切回占位地图。
      </p>
      <p v-else>
        粘贴 JSAPI Key 后即可加载真实地图。为方便调试，该 Key 会保存在本地存储中。
      </p>
      <label class="form-field">
        <span>临时 Key</span>
        <input
          v-model="runtimeKeyDraft"
          type="text"
          placeholder="粘贴你的高德 JSAPI Key"
          autocomplete="off"
          spellcheck="false"
        >
      </label>
      <div class="button-row key-actions">
        <button type="button" :disabled="!canApplyRuntimeKey" @click="$emit('applyRuntimeKey')">
          应用 Key
        </button>
        <button
          v-if="usingRuntimeKey"
          type="button"
          class="secondary"
          @click="$emit('clearRuntimeKey')"
        >
          清除 Key
        </button>
      </div>
      <p class="field-hint">
        本地存储键名为 <code>{{ PLAYGROUND_KEY_STORAGE_KEY }}</code>，不会提交到仓库。
      </p>
    </template>
  </section>
</template>
