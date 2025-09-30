<script setup lang="ts">
import type { UseLabelMarkerOptions } from '@amap-vue/hooks'
import type { LabelsLayerInjectionContext, LngLatLike } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useLabelMarker } from '@amap-vue/hooks'
import { amapLabelsLayerInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapLabelMarker',
})

const props = defineProps({
  position: {
    type: [Array, Object] as PropType<LngLatLike | undefined>,
    default: undefined,
  },
  text: {
    type: Object as PropType<AMap.LabelMarkerTextOptions | undefined>,
    default: undefined,
  },
  icon: {
    type: Object as PropType<AMap.LabelMarkerIconOptions | undefined>,
    default: undefined,
  },
  zooms: {
    type: Array as PropType<[number, number] | undefined>,
    default: undefined,
  },
  opacity: Number,
  zIndex: Number,
  extData: {
    type: [String, Number, Object, Array, Boolean] as PropType<any>,
    default: undefined,
  },
  visible: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  collision: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  options: {
    type: Object as PropType<Partial<AMap.LabelMarkerOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [marker: AMap.LabelMarker]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const layerContext = inject<LabelsLayerInjectionContext | null>(amapLabelsLayerInjectionKey, null)

if (!layerContext)
  warn('<AmapLabelMarker> must be used inside <AmapLabelsLayer>.')

const markerOptions = computed<UseLabelMarkerOptions>(() => {
  const base: UseLabelMarkerOptions = {
    ...props.options,
  }
  if (props.position)
    base.position = props.position
  if (props.text)
    base.text = props.text
  if (props.icon)
    base.icon = props.icon
  if (props.zooms)
    base.zooms = props.zooms
  if (props.opacity != null)
    base.opacity = props.opacity
  if (props.zIndex != null)
    base.zIndex = props.zIndex
  if (props.extData !== undefined)
    base.extData = props.extData
  if (props.visible != null)
    base.visible = props.visible
  if (props.collision != null)
    base.collision = props.collision
  return base
})

const markerApi = layerContext ? useLabelMarker(layerContext, markerOptions) : null
const marker = markerApi?.marker ?? shallowRef<AMap.LabelMarker | null>(null)

if (markerApi) {
  const events = [
    { event: 'click', handler: (event: any) => emit('click', event) },
    { event: 'mouseover', handler: (event: any) => emit('mouseover', event) },
    { event: 'mouseout', handler: (event: any) => emit('mouseout', event) },
  ]
  events.forEach(({ event, handler }) => markerApi.on(event, handler))

  watch(marker, (value) => {
    if (value)
      emit('ready', value)
  }, { immediate: true })
}

onBeforeUnmount(() => {
  markerApi?.destroy()
})

defineExpose({
  marker,
})
</script>

<template>
  <span v-if="false" />
</template>
