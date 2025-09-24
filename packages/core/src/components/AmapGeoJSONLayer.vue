<script setup lang="ts">
import type { UseGeoJSONLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useGeoJSONLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapGeoJSONLayer',
})

const props = defineProps({
  data: {
    type: [Object, Array] as PropType<AMap.GeoJSON.GeoJSONObject | AMap.GeoJSON.GeoJSONObject[] | undefined>,
    default: undefined,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object as PropType<Partial<AMap.GeoJSON.Options>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [layer: AMap.GeoJSON]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapGeoJSONLayer> must be used inside <AmapMap>.')

const layerOptions = computed<UseGeoJSONLayerOptions>(() => ({
  ...(props.options ?? {}),
  data: props.data,
  visible: props.visible,
}))

const geoApi = mapContext ? useGeoJSONLayer(() => mapContext.map.value, layerOptions) : null
const layer = geoApi?.overlay ?? shallowRef<AMap.GeoJSON | null>(null)

let readyEmitted = false

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (geoApi) {
  eventBindings.forEach(({ event, handler }) => geoApi.on(event, handler))
  watch(layer, (value) => {
    if (value && !readyEmitted) {
      readyEmitted = true
      emit('ready', value)
    }
  }, { immediate: true })
}

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => geoApi?.off(event, handler))
  geoApi?.destroy()
})

function setData(data: AMap.GeoJSON.GeoJSONObject | AMap.GeoJSON.GeoJSONObject[]) {
  geoApi?.setData(data)
}

function addOverlays(overlays: any | any[]) {
  geoApi?.addOverlays(overlays)
}

function removeOverlays(overlays: any | any[]) {
  geoApi?.removeOverlays(overlays)
}

function clear() {
  geoApi?.clear()
}

function show() {
  geoApi?.show()
}

function hide() {
  geoApi?.hide()
}

function setOptions(options: Partial<AMap.GeoJSON.Options>) {
  geoApi?.setOptions(options)
}

function getOverlays() {
  return geoApi?.getOverlays() ?? []
}

defineExpose({
  layer,
  setData,
  addOverlays,
  removeOverlays,
  clear,
  show,
  hide,
  setOptions,
  getOverlays,
})
</script>

<template>
  <span v-if="false" />
</template>
