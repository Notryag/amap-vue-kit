<script setup lang="ts">
import type { BezierCurvePath, MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useBezierCurve } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapBezierCurve',
})

const props = defineProps({
  path: {
    type: Array as PropType<BezierCurvePath>,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  extData: null as any,
  options: {
    type: Object as PropType<Partial<AMap.BezierCurveOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [curve: AMap.BezierCurve]
  click: [event: any]
  mouseover: [event: any]
  mouseout: [event: any]
}>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!context)
  warn('<AmapBezierCurve> must be used inside <AmapMap>.')

const curveOptions = computed(() => ({
  path: props.path,
  visible: props.visible,
  extData: props.extData,
  ...props.options,
}))

const curveApi = context ? useBezierCurve(() => context.map.value, curveOptions) : null
const bezierCurve = curveApi?.overlay ?? shallowRef<AMap.BezierCurve | null>(null)

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'click', handler: event => emit('click', event) },
  { event: 'mouseover', handler: event => emit('mouseover', event) },
  { event: 'mouseout', handler: event => emit('mouseout', event) },
]

if (curveApi) {
  watch(bezierCurve, (value) => {
    if (value)
      emit('ready', value)
  })
  eventBindings.forEach(({ event, handler }) => curveApi.on(event, handler))
}

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => curveApi?.off(event, handler))
  curveApi?.destroy()
})

defineExpose({
  bezierCurve,
})
</script>

<template>
  <span v-if="false" />
</template>
