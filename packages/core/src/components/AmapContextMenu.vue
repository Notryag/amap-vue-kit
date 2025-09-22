<script setup lang="ts">
import type { ContextMenuItem, UseContextMenuOptions } from '@amap-vue/hooks'
import type { LoaderOptions, MapInjectionContext } from '@amap-vue/shared'
import type { MaybeRefOrGetter, PropType } from 'vue'

import { useContextMenu } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapContextMenu',
})

const props = defineProps({
  items: {
    type: Array as PropType<ContextMenuItem[]>,
    default: () => [],
  },
  options: {
    type: Object as PropType<Partial<AMap.ContextMenuOptions>>,
    default: () => ({}),
  },
  bindMapRightClick: {
    type: Boolean,
    default: true,
  },
  loadOptions: {
    type: [Object, Function] as PropType<MaybeRefOrGetter<Partial<LoaderOptions> | undefined>>,
    default: undefined,
  },
})

const emit = defineEmits<{
  ready: [menu: AMap.ContextMenu]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapContextMenu> must be used inside <AmapMap>.')

const menuOptions = computed<UseContextMenuOptions>(() => ({
  ...(props.options ?? {}),
  items: props.items,
  loadOptions: props.loadOptions,
}))

const menuApi = mapContext ? useContextMenu(() => mapContext.map.value, menuOptions) : null
const menu = menuApi?.menu ?? shallowRef<AMap.ContextMenu | null>(null)

if (menuApi) {
  watch(menu, (value) => {
    if (value)
      emit('ready', value)
  }, { immediate: true })
}

let unbindMapRightClick: (() => void) | null = null

if (menuApi && props.bindMapRightClick) {
  watch(() => mapContext?.map.value ?? null, (mapInstance) => {
    if (unbindMapRightClick) {
      unbindMapRightClick()
      unbindMapRightClick = null
    }
    if (mapInstance) {
      const handler = (event: any) => {
        const lngLat = event?.lnglat as AMap.LngLat | undefined
        if (lngLat)
          void menuApi.open(lngLat)
      }
      mapInstance.on?.('rightclick', handler)
      unbindMapRightClick = () => mapInstance.off?.('rightclick', handler)
    }
  }, { immediate: true })
}

onBeforeUnmount(() => {
  unbindMapRightClick?.()
  menuApi?.destroy()
})

defineExpose({
  menu,
  open: (position: [number, number] | AMap.LngLat) => menuApi?.open(position),
  close: () => menuApi?.close(),
  addItem: (item: ContextMenuItem) => menuApi?.addItem(item),
  removeItem: (item: ContextMenuItem) => menuApi?.removeItem(item),
})
</script>

<template>
  <span v-if="false" />
</template>
