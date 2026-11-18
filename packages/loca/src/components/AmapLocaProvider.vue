<script setup lang="ts">
import type { LocaContainerOptions } from '../types'
import { computed, onUnmounted, provide, watchEffect } from 'vue'
import { useLocaContainer } from '../composables/useLocaContainer'

interface ProviderProps {
  map: AMap.Map | null | undefined
  options?: Partial<LocaContainerOptions>
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

watchEffect(() => {
  if (props.map)
    container.init()
  else
    container.destroy()
})

onUnmounted(() => {
  container.destroy()
})
</script>

<template>
  <slot />
</template>
