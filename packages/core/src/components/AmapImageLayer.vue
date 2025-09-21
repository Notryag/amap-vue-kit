<script setup lang="ts">
import type { UseImageLayerOptions } from '@amap-vue/hooks'
import type { BoundsLike, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useImageLayer } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapImageLayer',
})

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  bounds: {
    type: [Array, Object] as PropType<BoundsLike>,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: Number,
  zIndex: Number,
  zooms: {
    type: Array as PropType<[number, number] | undefined>,
    default: undefined,
  },
  options: {
    type: Object as PropType<Partial<AMap.ImageLayerOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [layer: AMap.ImageLayer]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapImageLayer> must be used inside <AmapMap>.')

const layerOptions = computed<UseImageLayerOptions>(() => {
  const base: UseImageLayerOptions = {
    ...props.options,
    url: props.url,
    bounds: props.bounds,
    visible: props.visible,
  }
  if (props.opacity != null)
    base.opacity = props.opacity
  if (props.zIndex != null)
    base.zIndex = props.zIndex
  if (props.zooms)
    base.zooms = props.zooms
  return base
})

const layerApi = mapContext ? useImageLayer(() => mapContext.map.value, layerOptions) : null
const layer = layerApi?.overlay ?? shallowRef<AMap.ImageLayer | null>(null)

if (layerApi) {
  watch(layer, (value) => {
    if (value)
      emit('ready', value)
  }, { immediate: true })
}

onBeforeUnmount(() => {
  layerApi?.destroy()
})

defineExpose({
  layer,
})
</script>

<template>
  <span v-if="false" />
</template>
