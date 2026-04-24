import { loader } from '@amap-vue/shared'
import { computed, ref, watch } from 'vue'

const PLAYGROUND_KEY_STORAGE_KEY = 'amap-vue-kit:playground:key'

export function useAmapKey() {
  const envKey = (import.meta.env.VITE_AMAP_KEY ?? '').trim()
  const runtimeKey = ref('')

  if (!envKey && typeof window !== 'undefined') {
    const savedKey = window.localStorage.getItem(PLAYGROUND_KEY_STORAGE_KEY)
    if (savedKey)
      runtimeKey.value = savedKey
  }

  const runtimeKeyDraft = ref(runtimeKey.value)
  const effectiveKey = computed(() => envKey || runtimeKey.value.trim())
  const usingEnvKey = computed(() => envKey.length > 0)
  const usingRuntimeKey = computed(() => !usingEnvKey.value && runtimeKey.value.trim().length > 0)
  const hasKey = computed(() => effectiveKey.value.length > 0)

  const keyStatusDetail = computed(() => {
    if (usingEnvKey.value)
      return 'Using key from .env.local. Restart the dev server after changing it.'
    if (usingRuntimeKey.value)
      return 'Using runtime key stored in this browser.'
    return 'Set VITE_AMAP_KEY in .env.local or paste a temporary key in the sidebar to load the JSAPI.'
  })

  const canApplyRuntimeKey = computed(() => {
    if (usingEnvKey.value)
      return false

    const trimmed = runtimeKeyDraft.value.trim()
    return trimmed.length > 0 && trimmed !== runtimeKey.value.trim()
  })

  watch(runtimeKey, (value) => {
    if (!usingEnvKey.value)
      runtimeKeyDraft.value = value

    if (usingEnvKey.value || typeof window === 'undefined')
      return

    const trimmed = value.trim()
    if (trimmed)
      window.localStorage.setItem(PLAYGROUND_KEY_STORAGE_KEY, trimmed)
    else
      window.localStorage.removeItem(PLAYGROUND_KEY_STORAGE_KEY)
  })

  watch(effectiveKey, (value, previousValue) => {
    if (!value || value === previousValue)
      return

    loader.config({ key: value })
  }, { immediate: true })

  function applyRuntimeKey() {
    if (usingEnvKey.value)
      return

    const trimmed = runtimeKeyDraft.value.trim()
    if (!trimmed || trimmed === runtimeKey.value.trim())
      return

    runtimeKey.value = trimmed
  }

  function clearRuntimeKey() {
    if (usingEnvKey.value || !runtimeKey.value)
      return

    runtimeKey.value = ''
    runtimeKeyDraft.value = ''
  }

  return {
    runtimeKey,
    runtimeKeyDraft,
    effectiveKey,
    usingEnvKey,
    usingRuntimeKey,
    hasKey,
    keyStatusDetail,
    canApplyRuntimeKey,
    applyRuntimeKey,
    clearRuntimeKey,
  }
}
