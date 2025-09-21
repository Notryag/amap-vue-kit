<script setup lang="ts">
import type { UseOverlayGroupOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useOverlayGroup } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapOverlayGroup',
})

const props = defineProps({
  overlays: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  visible: {
    type: Boolean,
    default: true,
  },
  extData: {
    type: [String, Number, Object, Array, Boolean] as PropType<any>,
    default: undefined,
  },
  options: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [group: AMap.OverlayGroup]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapOverlayGroup> must be used inside <AmapMap>.')

const groupOptions = computed<UseOverlayGroupOptions>(() => {
  const base: UseOverlayGroupOptions = {
    ...props.options,
    overlays: props.overlays,
    visible: props.visible,
  }
  if (props.extData !== undefined)
    base.extData = props.extData
  return base
})

const groupApi = mapContext ? useOverlayGroup(() => mapContext.map.value, groupOptions) : null
const group = groupApi?.overlay ?? shallowRef<AMap.OverlayGroup | null>(null)

if (groupApi) {
  watch(group, (value) => {
    if (value)
      emit('ready', value)
  }, { immediate: true })
}

function addOverlay(overlay: any) {
  groupApi?.addOverlay(overlay)
}

function addOverlays(overlays: any[]) {
  groupApi?.addOverlays(overlays)
}

function removeOverlay(overlay: any) {
  groupApi?.removeOverlay(overlay)
}

function removeOverlays(overlays: any[]) {
  groupApi?.removeOverlays(overlays)
}

function clearOverlays() {
  groupApi?.clearOverlays()
}

function getOverlays() {
  return groupApi?.getOverlays() ?? []
}

onBeforeUnmount(() => {
  groupApi?.destroy()
})

defineExpose({
  group,
  addOverlay,
  addOverlays,
  removeOverlay,
  removeOverlays,
  clearOverlays,
  getOverlays,
})
</script>

<template>
  <span v-if="false" />
</template>
