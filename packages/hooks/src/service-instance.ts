import type { LoaderOptions } from '@amap-vue/shared'
import type { ShallowRef } from 'vue'
import { isClient, loader, warn } from '@amap-vue/shared'
import { tryOnBeforeUnmount } from './lifecycle'

/** Internal lazy SDK service initialization shared by service hooks. */
export function useServiceInstance<T>(
  instance: ShallowRef<T | null>,
  plugin: string,
  getLoadOptions: () => Partial<LoaderOptions> | undefined,
  create: (amap: typeof AMap) => T,
) {
  let pending: Promise<T | null> | null = null
  let generation = 0
  let disposed = false

  function invalidate() {
    generation++
    pending = null
  }

  tryOnBeforeUnmount(() => {
    disposed = true
    invalidate()
  })

  function ensure(): Promise<T | null> {
    if (!isClient || disposed)
      return Promise.resolve(null)
    if (instance.value)
      return Promise.resolve(instance.value)
    if (pending)
      return pending

    const current = generation
    pending = Promise.resolve().then(async () => {
      try {
        const options = getLoadOptions()
        const amap = await loader.load({
          ...options,
          plugins: [...new Set([...(options?.plugins ?? []), plugin])],
        })
        if (disposed || current !== generation)
          return null
        const value = create(amap)
        instance.value = value
        return value
      }
      catch (error) {
        if (current === generation && !disposed)
          warn(error instanceof Error ? error.message : String(error))
        return null
      }
      finally {
        if (current === generation)
          pending = null
      }
    })
    return pending
  }

  return { ensure, invalidate }
}
