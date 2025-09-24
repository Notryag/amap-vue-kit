<script setup lang="ts">
import type { DistrictLayerType, UseDistrictLayerOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useDistrictLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapDistrictLayer',
})

const props = defineProps({
  type: {
    type: String as PropType<DistrictLayerType>,
    default: 'Country',
  },
  adcode: {
    type: [String, Number, Array] as PropType<string | number | Array<string | number> | undefined>,
    default: undefined,
  },
  depth: Number,
  styles: {
    type: Object as PropType<AMap.DistrictLayerOptions['styles']>,
    default: undefined,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: Number,
  zooms: {
    type: Array as PropType<[number, number] | undefined>,
    default: undefined,
  },
  zIndex: Number,
  options: {
    type: Object as PropType<Partial<AMap.DistrictLayerOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [layer: AMap.DistrictLayer]
  complete: [event: any]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapDistrictLayer> must be used inside <AmapMap>.')

const layerOptions = computed<UseDistrictLayerOptions>(() => {
  const base: UseDistrictLayerOptions = {
    type: props.type,
    adcode: props.adcode,
    visible: props.visible,
    ...(props.options ?? {}),
  }
  if (props.depth != null)
    base.depth = props.depth
  if (props.styles)
    base.styles = props.styles
  if (props.opacity != null)
    base.opacity = props.opacity
  if (props.zooms)
    base.zooms = props.zooms
  if (props.zIndex != null)
    base.zIndex = props.zIndex
  return base
})

const layerApi = mapContext ? useDistrictLayer(() => mapContext.map.value, layerOptions) : null
const layer = layerApi?.overlay ?? shallowRef<AMap.DistrictLayer | null>(null)

let readyEmitted = false

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'complete', handler: event => emit('complete', event) },
]

if (layerApi) {
  eventBindings.forEach(({ event, handler }) => layerApi.on(event, handler))
  watch(layer, (value) => {
    if (value && !readyEmitted) {
      readyEmitted = true
      emit('ready', value)
    }
  }, { immediate: true })
}

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => layerApi?.off(event, handler))
  layerApi?.destroy()
})

function show() {
  layerApi?.show()
}

function hide() {
  layerApi?.hide()
}

function setDistricts(adcode: string | number | Array<string | number>) {
  layerApi?.setDistricts(adcode)
}

function setStyles(styles: AMap.DistrictLayerOptions['styles']) {
  layerApi?.setStyles(styles)
}

function setOptions(options: Partial<AMap.DistrictLayerOptions>) {
  layerApi?.setOptions(options)
}

defineExpose({
  layer,
  show,
  hide,
  setDistricts,
  setStyles,
  setOptions,
})
</script>

<template>
  <span v-if="false" />
</template>
