<script setup lang="ts">
import type { UseMouseToolOptions } from '@amap-vue/hooks'
import type { LoaderOptions, MapInjectionContext } from '@amap-vue/shared'
import type { MaybeRefOrGetter, PropType } from 'vue'

import { useMouseTool } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

type DrawMode = 'none' | 'circle' | 'rectangle' | 'polygon' | 'polyline' | 'bezierCurve' | 'ellipse'

interface DrawOptionsMap {
  circle?: Partial<AMap.CircleOptions>
  rectangle?: Partial<AMap.RectangleOptions>
  polygon?: Partial<AMap.PolygonOptions>
  polyline?: Partial<AMap.PolylineOptions>
  bezierCurve?: Partial<AMap.BezierCurveOptions>
  ellipse?: Partial<AMap.EllipseOptions>
}

defineOptions({
  name: 'AmapMouseTool',
})

const props = defineProps({
  mode: {
    type: String as PropType<DrawMode>,
    default: 'none',
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  drawOptions: {
    type: Object as PropType<DrawOptionsMap>,
    default: () => ({}),
  },
  loadOptions: {
    type: [Object, Function] as PropType<MaybeRefOrGetter<Partial<LoaderOptions> | undefined>>,
    default: undefined,
  },
})

const emit = defineEmits<{
  'ready': [tool: AMap.MouseTool]
  'draw': [event: any]
  'update:mode': [mode: DrawMode]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapMouseTool> must be used inside <AmapMap>.')

const toolOptions = computed<UseMouseToolOptions>(() => ({
  loadOptions: props.loadOptions,
}))

const toolApi = mapContext ? useMouseTool(() => mapContext.map.value, toolOptions) : null
const tool = toolApi?.tool ?? shallowRef<AMap.MouseTool | null>(null)

let readyEmitted = false

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  {
    event: 'draw',
    handler: (event: any) => {
      if (props.autoClose) {
        toolApi?.close()
        emit('update:mode', 'none')
      }
      emit('draw', event)
    },
  },
]

if (toolApi) {
  eventBindings.forEach(({ event, handler }) => toolApi.on(event, handler))
  watch(tool, (value) => {
    if (value && !readyEmitted) {
      readyEmitted = true
      emit('ready', value)
    }
  }, { immediate: true })
}

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => toolApi?.off(event, handler))
  toolApi?.destroy()
})

const drawOptions = computed(() => props.drawOptions ?? {})

watch(() => props.mode, (mode) => {
  if (!toolApi)
    return
  if (mode === 'none') {
    if (props.autoClose)
      toolApi.close()
    return
  }

  const options = drawOptions.value
  switch (mode) {
    case 'circle':
      void toolApi.drawCircle(options.circle)
      break
    case 'rectangle':
      void toolApi.drawRectangle(options.rectangle)
      break
    case 'polygon':
      void toolApi.drawPolygon(options.polygon)
      break
    case 'polyline':
      void toolApi.drawPolyline(options.polyline)
      break
    case 'bezierCurve':
      void toolApi.drawBezierCurve(options.bezierCurve)
      break
    case 'ellipse':
      void toolApi.drawEllipse(options.ellipse)
      break
  }
}, { immediate: true })

function closeTool() {
  toolApi?.close()
  emit('update:mode', 'none')
}

function drawCircle(options?: Partial<AMap.CircleOptions>) {
  return toolApi?.drawCircle(options ?? drawOptions.value.circle)
}

function drawRectangle(options?: Partial<AMap.RectangleOptions>) {
  return toolApi?.drawRectangle(options ?? drawOptions.value.rectangle)
}

function drawPolygon(options?: Partial<AMap.PolygonOptions>) {
  return toolApi?.drawPolygon(options ?? drawOptions.value.polygon)
}

function drawPolyline(options?: Partial<AMap.PolylineOptions>) {
  return toolApi?.drawPolyline(options ?? drawOptions.value.polyline)
}

function drawBezierCurve(options?: Partial<AMap.BezierCurveOptions>) {
  return toolApi?.drawBezierCurve(options ?? drawOptions.value.bezierCurve)
}

function drawEllipse(options?: Partial<AMap.EllipseOptions>) {
  return toolApi?.drawEllipse(options ?? drawOptions.value.ellipse)
}

function activate(mode: DrawMode) {
  emit('update:mode', mode)
}

defineExpose({
  tool,
  drawCircle,
  drawRectangle,
  drawPolygon,
  drawPolyline,
  drawBezierCurve,
  drawEllipse,
  close: closeTool,
  activate,
})
</script>

<template>
  <slot
    :tool="tool"
    :draw-circle="drawCircle"
    :draw-rectangle="drawRectangle"
    :draw-polygon="drawPolygon"
    :draw-polyline="drawPolyline"
    :draw-bezier-curve="drawBezierCurve"
    :draw-ellipse="drawEllipse"
    :close="closeTool"
    :activate="activate"
  />
</template>
