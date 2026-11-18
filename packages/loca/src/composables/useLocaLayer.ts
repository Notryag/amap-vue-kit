import type { ShallowRef } from 'vue'
import type { LocaContainer, LocaLayer, MaybeRefMap } from '../types'
import { shallowRef, unref } from 'vue'

/** Shared attachment state; the actual target can differ from the input container. */
export function useLocaLayer<T extends LocaLayer>(
  container: MaybeRefMap<LocaContainer | null | undefined>,
  create: () => T,
  name: string,
  fallback?: LocaContainer | null,
) {
  const layer = shallowRef<T | null>(null) as ShallowRef<T | null>
  let attachedContainer: LocaContainer | null = null

  function getContainer() {
    return (typeof container === 'function'
      ? container()
      : unref(container)) ?? fallback ?? null
  }

  function ensureLayer(): T {
    if (!layer.value)
      layer.value = create()
    return layer.value
  }

  function remove() {
    if (layer.value && attachedContainer)
      attachedContainer.remove(layer.value)
    attachedContainer = null
  }

  function addTo(target?: LocaContainer | null) {
    const resolved = target ?? getContainer()
    if (!resolved)
      throw new Error(`[amap-vue] Attempted to add a Loca ${name} layer without a container.`)
    const instance = ensureLayer()
    if (resolved === attachedContainer)
      return
    remove()
    resolved.add(instance)
    attachedContainer = resolved
  }

  function render() {
    if (typeof layer.value?.render === 'function')
      layer.value.render()
    else
      (attachedContainer ?? getContainer())?.render()
  }

  function destroy() {
    remove()
    layer.value?.destroy()
    layer.value = null
  }

  return {
    layer,
    ensureLayer,
    addTo,
    remove,
    render,
    destroy,
  }
}
