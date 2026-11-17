import { loader } from '@amap-vue/shared'
import { computed, ref } from 'vue'

const demoKey = ref(import.meta.env.VITE_AMAP_KEY ?? '')
export const demoHasKey = computed(() => Boolean(demoKey.value))

export function configureDemoAccess(key: string, securityJsCode?: string) {
  loader.config({ key, securityJsCode: securityJsCode || undefined })
  demoKey.value = key
}
