<script setup lang="ts">
import type { UseBuildingsOptions } from '@amap-vue/hooks'
import type { MapInjectionContext } from '@amap-vue/shared'
import { useBuildings } from '@amap-vue/hooks'
import { amapMapInjectionKey, warn } from '@amap-vue/shared'
import { inject, watch } from 'vue'

defineOptions({ name: 'AmapBuildings' })

const props = withDefaults(defineProps<{
  options?: UseBuildingsOptions
  layerStyle?: AMap.BuildingsStyle
  visible?: boolean
}>(), { visible: undefined })

const emit = defineEmits<{ ready: [layer: AMap.Buildings] }>()

const context = inject<MapInjectionContext | null>(amapMapInjectionKey, null)
if (!context)
  warn('<AmapBuildings> must be used inside <AmapMap>.')

const { overlay: layer } = useBuildings(() => context?.map.value, () => ({
  ...props.options,
  styleOpts: props.layerStyle ?? props.options?.styleOpts,
  visible: props.visible ?? props.options?.visible ?? true,
}))

watch(layer, (value) => {
  if (value)
    emit('ready', value)
})

defineExpose({ layer })
</script>

<template>
  <span v-if="false" />
</template>
