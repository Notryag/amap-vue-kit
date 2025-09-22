import type { LngLatLike, LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, toLngLat } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

export interface ContextMenuItem {
  text: string
  handler: (event: any) => void
  index?: number
}
export interface UseContextMenuOptions extends Partial<AMap.ContextMenuOptions> {
  items?: ContextMenuItem[]
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseContextMenuReturn {
  menu: ShallowRef<AMap.ContextMenu | null>
  open: (position: LngLatLike) => Promise<void>
  close: () => void
  addItem: (item: ContextMenuItem) => void
  removeItem: (item: ContextMenuItem) => void
  destroy: () => void
  on: (event: string, handler: (event: any) => void) => void
  off: (event: string, handler: (event: any) => void) => void
}

interface ListenerRecord {
  event: string
  handler: (event: any) => void
}

export function useContextMenu(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseContextMenuOptions | undefined> = {},
): UseContextMenuReturn {
  const menu: ShallowRef<AMap.ContextMenu | null> = shallowRef(null)
  const listeners = new Set<ListenerRecord>()
  const optionsRef = computed<UseContextMenuOptions>(() => ({
    ...(toValue(options) as UseContextMenuOptions | undefined ?? {}),
  }))

  let currentMap: AMap.Map | null = null
  let creating = false
  let currentItems: ContextMenuItem[] = []

  async function ensureMenu() {
    if (!isClient || menu.value || creating)
      return
    creating = true
    try {
      const loadOptions = optionsRef.value.loadOptions ? toValue(optionsRef.value.loadOptions) : undefined
      const AMapInstance = await loader.load(loadOptions)
      const { items, loadOptions: _ignored, ...rest } = optionsRef.value
      const instance = new (AMapInstance as any).ContextMenu(rest)
      menu.value = instance
      bindListeners(instance)
      if (items?.length)
        applyItems(instance, items)
    }
    finally {
      creating = false
    }
  }

  function bindListeners(instance: AMap.ContextMenu) {
    listeners.forEach(({ event, handler }) => instance.on?.(event, handler))
  }

  function unbindListeners(instance: AMap.ContextMenu | null) {
    if (!instance)
      return
    listeners.forEach(({ event, handler }) => instance.off?.(event, handler))
  }

  function applyItems(instance: AMap.ContextMenu, items: ContextMenuItem[] | undefined) {
    currentItems.forEach((item) => {
      instance.removeItem?.(item.text, item.handler)
    })
    currentItems = []
    if (!Array.isArray(items))
      return
    items.forEach((item) => {
      instance.addItem(item.text, item.handler, item.index)
    })
    currentItems = items.map(item => ({ ...item }))
  }

  async function open(position: LngLatLike) {
    if (!menu.value)
      await ensureMenu()
    const instance = menu.value
    if (!instance || !currentMap)
      return
    const AMapInstance = loader.get()
    const lngLat = AMapInstance ? toLngLat(AMapInstance, position) ?? position : position
    instance.open(currentMap, lngLat as any)
  }

  function close() {
    menu.value?.close()
  }

  function addItem(item: ContextMenuItem) {
    if (!menu.value) {
      currentItems = [...currentItems, { ...item }]
      return
    }
    menu.value.addItem(item.text, item.handler, item.index)
    currentItems.push({ ...item })
  }

  function removeItem(item: ContextMenuItem) {
    const instance = menu.value
    if (instance)
      instance.removeItem?.(item.text, item.handler)
    currentItems = currentItems.filter(current => !(current.text === item.text && current.handler === item.handler))
  }

  function destroy() {
    const instance = menu.value
    if (instance) {
      unbindListeners(instance)
      instance.close()
    }
    menu.value = null
    currentItems = []
  }

  function on(event: string, handler: (event: any) => void) {
    const record = { event, handler }
    listeners.add(record)
    menu.value?.on?.(event, handler)
  }

  function off(event: string, handler: (event: any) => void) {
    for (const record of Array.from(listeners)) {
      if (record.event === event && record.handler === handler) {
        listeners.delete(record)
        menu.value?.off?.(event, handler)
      }
    }
  }

  watch(() => toValue(mapRef), (mapInstance) => {
    currentMap = mapInstance ?? null
  }, { immediate: true })

  watch(optionsRef, (value) => {
    const instance = menu.value
    if (instance) {
      applyItems(instance, value.items)
    }
    else {
      void ensureMenu()
    }
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    destroy()
  })

  return {
    menu,
    open,
    close,
    addItem,
    removeItem,
    destroy,
    on,
    off,
  }
}
