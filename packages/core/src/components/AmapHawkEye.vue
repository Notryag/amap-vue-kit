<script setup lang="ts">
import type { UseHawkEyeOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useHawkEye } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { computed, inject, shallowRef, watch } from 'vue'

defineOptions({ name: 'AmapHawkEye' })

const props = withDefaults(defineProps<HawkEyeProps>(), {
  visible: true,
  isOpen: undefined,
  options: () => ({}),
})

const emit = defineEmits<{ ready: [control: AMap.HawkEye] }>()

export interface HawkEyeProps {
  /** Show the control independently of its expanded state. */
  visible?: boolean
  /** Expand or minimize the overview map. */
  isOpen?: boolean
  width?: string
  height?: string
  /** Pixel distance from the bottom-right corner. */
  offset?: [number, number]
  options?: UseHawkEyeOptions
}

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapHawkEye> must be used inside <AmapMap>.')

const options = computed<UseHawkEyeOptions>(() => ({
  ...props.options,
  visible: props.visible,
  ...(props.isOpen !== undefined ? { isOpen: props.isOpen } : {}),
  ...(props.width !== undefined ? { width: props.width } : {}),
  ...(props.height !== undefined ? { height: props.height } : {}),
  ...(props.offset !== undefined ? { offset: props.offset } : {}),
}))
const api = context ? useHawkEye(() => context.map.value, options) : null
const control = api?.control ?? shallowRef<AMap.HawkEye | null>(null)
watch(control, (value) => {
  if (value)
    emit('ready', value)
}, { immediate: true })

defineExpose({
  control,
  open: () => api?.open(),
  close: () => api?.close(),
  show: () => api?.show(),
  hide: () => api?.hide(),
})
</script>

<template>
  <span v-if="false" />
</template>
