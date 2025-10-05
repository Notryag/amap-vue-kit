import { computed, shallowRef, unref } from 'vue'
import type { LocaContainer, LocaContainerOptions, MaybeRefMap } from '../types'
import { getLoca } from '../utils'

export interface UseLocaContainerOptions {
  map: MaybeRefMap<AMap.Map>
  containerOptions?: Partial<LocaContainerOptions>
}

export function useLocaContainer(options: UseLocaContainerOptions) {
  const instance = shallowRef<LocaContainer | null>(null)
  const mapRef = computed(() => {
    const value = typeof options.map === 'function' ? options.map() : unref(options.map as any)
    return value ?? null
  })

  function init(extraOptions: Partial<LocaContainerOptions> = {}) {
    if (instance.value)
      return instance.value

    const map = mapRef.value
    if (!map)
      throw new Error('[amap-vue] Cannot create a Loca container without an AMap.Map instance.')

    const loca = getLoca()
    instance.value = new loca.Container({
      map,
      ...(options.containerOptions ?? {}),
      ...extraOptions,
    })

    return instance.value
  }

  function render() {
    instance.value?.render()
  }

  function destroy() {
    if (instance.value) {
      instance.value.destroy()
      instance.value = null
    }
  }

  return {
    instance,
    isReady: () => Boolean(instance.value),
    init,
    render,
    destroy,
  }
}
