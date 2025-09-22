import type { UseMapOptions, UseMapReturn } from '@amap-vue/hooks'
import type { LoaderOptions } from '@amap-vue/shared'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { useMap } from '@amap-vue/hooks'
import { computed, ref, toValue } from 'vue'
import { useDemoLoader } from '../useDemoLoader'

interface HookMapConfig {
  plugins?: string[]
  loaderOptions?: Partial<LoaderOptions>
}

type HookMapReturn = UseMapReturn & {
  container: Ref<HTMLDivElement | null>
  hasKey: ComputedRef<boolean>
}

export function useHookDemoMap(
  options: MaybeRefOrGetter<Partial<UseMapOptions>> = {},
  config?: HookMapConfig,
): HookMapReturn {
  const { hasKey } = useDemoLoader({
    plugins: config?.plugins,
    options: config?.loaderOptions,
  })

  const container = ref<HTMLDivElement | null>(null)
  const baseOptions = computed<UseMapOptions>(() => ({
    center: [116.397, 39.908],
    zoom: 11,
    viewMode: '2D',
    ...(toValue(options) as Partial<UseMapOptions> ?? {}),
  }))

  const mapBinding = useMap(baseOptions, () => (hasKey.value ? container.value : null))

  return {
    ...mapBinding,
    container,
    hasKey,
  }
}
