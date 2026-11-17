import type { LoaderOptions } from '@amap-vue/shared'
import { loader } from '@amap-vue/shared'
import { computed } from 'vue'
import { demoHasKey } from './demo-access'

const pluginSet = new Set<string>()

interface DemoLoaderConfig {
  plugins?: string[]
  options?: Partial<LoaderOptions>
}

export function useDemoLoader(config?: DemoLoaderConfig) {
  const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
  const security = (import.meta as any).env?.VITE_AMAP_SECURITY_CODE as string | undefined

  if (config?.plugins)
    config.plugins.forEach(plugin => pluginSet.add(plugin))

  if (!key && (config?.options || pluginSet.size))
    loader.config({ ...(config?.options ?? {}), plugins: Array.from(pluginSet) })

  if (key) {
    const existing = loader.getConfig?.() as Partial<LoaderOptions> | undefined
    if (existing?.plugins?.length)
      existing.plugins.forEach(plugin => pluginSet.add(plugin))

    if (config?.plugins)
      config.plugins.forEach(plugin => pluginSet.add(plugin))

    const nextOptions: Partial<LoaderOptions> = {
      key,
      ...(security ? { securityJsCode: security } : {}),
      ...(config?.options ?? {}),
    }

    if (pluginSet.size)
      nextOptions.plugins = Array.from(pluginSet)

    loader.config(nextOptions)
  }

  const hasKey = computed(() => demoHasKey.value)

  return { hasKey }
}
