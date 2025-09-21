<script setup lang="ts">
import type { UseEditorCircleOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import type { PropType } from 'vue'

import { useEditorCircle } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, onBeforeUnmount, shallowRef, watch } from 'vue'

defineOptions({
  name: 'AmapCircleEditor',
})

const props = defineProps({
  target: {
    type: [Object, String] as PropType<AMap.Circle | string | null | undefined>,
    default: undefined,
  },
  active: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object as PropType<Partial<AMap.CircleEditorOptions>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  ready: [editor: AMap.CircleEditor]
  adjust: [event: any]
  end: [event: any]
}>()

const mapContext = inject<MapInjectionContext | null>(amapMapInjectionKey, null)

if (!mapContext)
  warn('<AmapCircleEditor> must be used inside <AmapMap>.')

const editorOptions = computed<UseEditorCircleOptions>(() => {
  const base: UseEditorCircleOptions = {
    ...(props.options ?? {}),
    active: props.active,
  }
  if (props.target !== undefined)
    base.target = props.target
  return base
})

const editorApi = mapContext ? useEditorCircle(() => mapContext.map.value, editorOptions) : null
const editor = editorApi?.editor ?? shallowRef<AMap.CircleEditor | null>(null)

if (editorApi) {
  watch(editor, (value) => {
    if (value)
      emit('ready', value)
  }, { immediate: true })
}

const eventBindings: Array<{ event: string, handler: (event: any) => void }> = [
  { event: 'adjust', handler: event => emit('adjust', event) },
  { event: 'end', handler: event => emit('end', event) },
]

eventBindings.forEach(({ event, handler }) => editorApi?.on(event, handler))

onBeforeUnmount(() => {
  eventBindings.forEach(({ event, handler }) => editorApi?.off(event, handler))
  editorApi?.destroy()
})

defineExpose({
  editor,
  open: () => editorApi?.open(),
  close: () => editorApi?.close(),
  setTarget: (target: AMap.Circle | string | null | undefined) => editorApi?.setTarget(target),
  getTarget: () => editorApi?.getTarget(),
})
</script>

<template>
  <span v-if="false" />
</template>
