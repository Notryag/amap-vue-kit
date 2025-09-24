<script setup lang="ts">
import type { UseMassMarkersOptions } from '@amap-vue/hooks'
import type { LoaderOptions, MapInjectionContext } from '@amap-vue/shared'
import type { MaybeRefOrGetter, PropType } from 'vue'

import { useMassMarkers } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapMassMarks',
})

const props = defineProps({
  data: {
    type: Array as PropType<AMap.MassData[]>,
    default: () => [],
  },
  style: {
    type: [Object, Array] as PropType<AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[] | undefined>,
    default: undefined,
  },
  options: {
    type: Object as PropType<Partial<AMap.MassMarkersOptions> | undefined>,
    default: undefined,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  loadOptions: {
    type: [Object, Function] as PropType<MaybeRefOrGetter<Partial<LoaderOptions> | undefined>>,
    default: undefined,
  },
})

const emit = defineEmits<{
  ready: [mass: AMap.MassMarks]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapMassMarks> must be used inside <AmapMap>.')

const massOptions = computed<UseMassMarkersOptions>(() => ({
  data: props.data,
  style: props.style,
  options: props.options,
  visible: props.visible,
  loadOptions: props.loadOptions,
}))

const massApi = mapContext ? useMassMarkers(() => mapContext.map.value, massOptions) : null
const mass = massApi?.mass ?? shallowRef<AMap.MassMarks | null>(null)

let readyEmitted = false

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (massApi) {
  eventBindings.forEach(({ event, handler }) => massApi.on(event, handler))
  watch(mass, (value) => {
    if (value && !readyEmitted) {
      readyEmitted = true
      emit('ready', value)
    }
  }, { immediate: true })
}

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => massApi?.off(event, handler))
  massApi?.destroy()
})

function show() {
  massApi?.show()
}

function hide() {
  massApi?.hide()
}

function setData(data: AMap.MassData[]) {
  massApi?.setData(data)
}

function setStyle(style: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]) {
  massApi?.setStyle(style)
}

function setOptions(options: Partial<AMap.MassMarkersOptions>) {
  massApi?.setOptions(options)
}

defineExpose({
  mass,
  show,
  hide,
  setData,
  setStyle,
  setOptions,
})
</script>

<template>
  <span v-if="false" />
</template>
