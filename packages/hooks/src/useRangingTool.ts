import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import { readonly, ref, shallowRef, toValue, watch } from 'vue'
import { tryOnBeforeUnmount } from './lifecycle'
import { useServiceInstance } from './service-instance'

export interface UseRangingToolOptions {
  /** Native options read when a tool instance is created. */
  options?: AMap.RangingToolOptions
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
  onAddNode?: (event: AMap.RangingToolEventMap['addnode']) => void
  onRemoveNode?: (event: AMap.RangingToolEventMap['removenode']) => void
  onEnd?: (event: AMap.RangingToolEventMap['end']) => void
}

/** Measure a distance interactively on an AMap map. */
export function useRangingTool(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseRangingToolOptions> = {},
) {
  const tool = shallowRef<AMap.RangingTool | null>(null)
  const active = ref(false)
  let command = 0

  const onAddNode = (event: AMap.RangingToolEventMap['addnode']) => toValue(options).onAddNode?.(event)
  const onRemoveNode = (event: AMap.RangingToolEventMap['removenode']) => toValue(options).onRemoveNode?.(event)
  const onEnd = (event: AMap.RangingToolEventMap['end']) => toValue(options).onEnd?.(event)

  const { ensure, invalidate } = useServiceInstance(tool, 'AMap.RangingTool', () => toValue(toValue(options).loadOptions), (amap) => {
    const instance = new amap.RangingTool(toValue(map)!, toValue(options).options)
    instance.on('addnode', onAddNode)
    instance.on('removenode', onRemoveNode)
    instance.on('end', onEnd)
    return instance
  })

  /** Start measuring. Resolves to false when the map or plugin is unavailable. */
  async function start(): Promise<boolean> {
    if (!toValue(map))
      return false

    const request = command
    const instance = await ensure()
    if (!instance || request !== command)
      return false

    if (!active.value) {
      instance.turnOn()
      active.value = true
    }
    return true
  }

  /** Stop measuring. Pass true to remove measurement overlays. */
  function stop(removeOverlays = false) {
    command++
    tool.value?.turnOff(removeOverlays)
    active.value = false
  }

  /** Release the native tool and cancel any pending initialization. */
  function destroy() {
    invalidate()
    const instance = tool.value
    if (instance) {
      instance.off('addnode', onAddNode)
      instance.off('removenode', onRemoveNode)
      instance.off('end', onEnd)
    }
    stop(true)
    tool.value = null
  }

  watch(() => toValue(map), (value) => {
    destroy()
    if (value)
      void ensure()
  }, { immediate: true, flush: 'sync' })
  tryOnBeforeUnmount(destroy)

  return {
    tool,
    active: readonly(active),
    start,
    stop,
    destroy,
  }
}
