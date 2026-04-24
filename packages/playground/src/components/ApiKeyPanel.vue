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
    <h2>API key</h2>
    <template v-if="usingEnvKey">
      <p>
        Using key from <code>.env.local</code>. Restart the dev server after changing it.
      </p>
    </template>
    <template v-else>
      <p v-if="usingRuntimeKey">
        Using a runtime key stored in this browser. Clear it below to switch back to the placeholder map.
      </p>
      <p v-else>
        Paste a JSAPI key to load the live map. The key is saved to local storage for convenience.
      </p>
      <label class="form-field">
        <span>Temporary key</span>
        <input
          v-model="runtimeKeyDraft"
          type="text"
          placeholder="Paste your AMap JSAPI key"
          autocomplete="off"
          spellcheck="false"
        >
      </label>
      <div class="button-row key-actions">
        <button type="button" :disabled="!canApplyRuntimeKey" @click="$emit('applyRuntimeKey')">
          Apply key
        </button>
        <button
          v-if="usingRuntimeKey"
          type="button"
          class="secondary"
          @click="$emit('clearRuntimeKey')"
        >
          Clear key
        </button>
      </div>
      <p class="field-hint">
        Stored locally as <code>{{ PLAYGROUND_KEY_STORAGE_KEY }}</code>. Never committed to the repository.
      </p>
    </template>
  </section>
</template>
