<script setup lang="ts">
import type { LocaContainerOptions } from '../types'
import { computed, onUnmounted, provide, watch } from 'vue'
import { useLocaContainer } from '../composables/useLocaContainer'

interface ProviderProps {
  map: AMap.Map | null | undefined
  options?: Partial<LocaContainerOptions>
  /** Run the shared Loca animation loop for this container. */
  animate?: boolean
}

defineOptions({
  name: 'AmapLocaProvider',
})

const props = defineProps<ProviderProps>()

const container = useLocaContainer({
  map: computed(() => props.map ?? null),
  containerOptions: props.options,
})

provide('amapLocaContainer', container.instance)

watch(() => props.map, (map) => {
  if (map)
    container.init()
  else
    container.destroy()
}, { immediate: true })

watch([
  container.instance,
  () => props.animate,
], ([instance, animate], _, onCleanup) => {
  if (animate && instance?.animate) {
    const controller = instance.animate
    controller.start()
    onCleanup(() => controller.stop())
  }
}, { immediate: true, flush: 'sync' })

onUnmounted(() => {
  container.destroy()
})
</script>

<template>
  <slot />
</template>
