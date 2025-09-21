<script setup lang="ts">
import type { UseLabelsLayerOptions } from '@amap-vue/hooks'
import type { LabelsLayerInjectionContext, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useLabelsLayer } from '@amap-vue/hooks'
import { amapLabelsLayerInjectionKey, amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, provide, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapLabelsLayer',
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: Number,
  zIndex: Number,
  zooms: {
    type: Array as PropType<[number, number]>,
    default: undefined,
  },
  collision: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  allowCollision: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  options: {
    type: Object as PropType<Partial<AMap.LabelsLayerOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [layer: AMap.LabelsLayer]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapLabelsLayer> must be used inside <AmapMap>.')

const layerOptions = computed<UseLabelsLayerOptions>(() => {
  const base: UseLabelsLayerOptions = {
    ...props.options,
    visible: props.visible,
  }
  if (props.opacity != null)
    base.opacity = props.opacity
  if (props.zIndex != null)
    base.zIndex = props.zIndex
  if (props.zooms)
    base.zooms = props.zooms
  if (props.collision != null)
    base.collision = props.collision
  if (props.allowCollision != null)
    base.allowCollision = props.allowCollision
  return base
})

const layerApi = mapContext ? useLabelsLayer(() => mapContext.map.value, layerOptions) : null
const layer = layerApi?.overlay ?? shallowRef<AMap.LabelsLayer | null>(null)
const readyCallbacks: Array<(layer: AMap.LabelsLayer) => void> = []
const pendingMarkers = new Set<AMap.LabelMarker>()

function flushPendingMarkers() {
  const instance = layer.value
  if (!instance || !pendingMarkers.size)
    return
  layerApi?.add(Array.from(pendingMarkers))
  pendingMarkers.clear()
}

if (layerApi) {
  watch(layer, (value) => {
    if (!value)
      return
    flushPendingMarkers()
    emit('ready', value)
    while (readyCallbacks.length) {
      const callback = readyCallbacks.shift()
      callback?.(value)
    }
  }, { immediate: true })
}

function onLayerReady(callback: (layer: AMap.LabelsLayer) => void) {
  const instance = layer.value
  if (instance)
    callback(instance)
  else
    readyCallbacks.push(callback)
}

function normalizeMarkers(markers: AMap.LabelMarker | AMap.LabelMarker[]) {
  return Array.isArray(markers) ? markers : [markers]
}

function addMarkers(markers: AMap.LabelMarker | AMap.LabelMarker[]) {
  const items = normalizeMarkers(markers)
  if (layer.value)
    layerApi?.add(items.length === 1 ? items[0] : items)
  else
    items.forEach(marker => pendingMarkers.add(marker))
}

function removeMarkers(markers: AMap.LabelMarker | AMap.LabelMarker[]) {
  const items = normalizeMarkers(markers)
  items.forEach(marker => pendingMarkers.delete(marker))
  if (layer.value)
    layerApi?.remove(items.length === 1 ? items[0] : items)
}

function clearMarkers() {
  pendingMarkers.clear()
  layerApi?.clear()
}

provide<LabelsLayerInjectionContext>(amapLabelsLayerInjectionKey, {
  layer,
  ready: onLayerReady,
  add: addMarkers,
  remove: removeMarkers,
  clear: clearMarkers,
})

onBeforeUnmount(() => {
  readyCallbacks.length = 0
  pendingMarkers.clear()
  layerApi?.destroy()
})

defineExpose({
  layer,
  add: addMarkers,
  remove: removeMarkers,
  clear: clearMarkers,
})
</script>

<template>
  <slot />
</template>
