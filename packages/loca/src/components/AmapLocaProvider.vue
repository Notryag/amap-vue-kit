<script setup lang="ts">
import type { LocaContainerOptions } from '../types'
import { computed, onBeforeUnmount, provide, watchEffect } from 'vue'
import { useLocaContainer } from '../composables/useLocaContainer'

interface ProviderProps {
  map: AMap.Map | null | undefined
  options?: Partial<LocaContainerOptions>
}

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

onBeforeUnmount(() => {
  container.destroy()
})
</script>

<template>
  <slot />
</template>
