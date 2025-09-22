<script setup lang="ts">
import { useLabelMarker, useLabelsLayer } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const position = ref<[number, number]>([116.397, 39.908])
const color = ref('#2563eb')
const zoomRange = ref<[number, number]>([10, 20])
const visible = ref(true)

const { container, hasKey, map } = useHookDemoMap(() => ({
  center: position.value,
  zoom: 13,
}), { plugins: ['AMap.LabelsLayer'] })

const labelsLayer = useLabelsLayer(() => map.value, () => ({ zIndex: 130 }))

const marker = useLabelMarker(() => labelsLayer.overlay.value, () => ({
  position: position.value,
  visible: visible.value,
  text: {
    content: 'useLabelMarker demo',
    direction: 'right',
    style: {
      fillColor: color.value,
      fontSize: 13,
      fontWeight: 600,
      padding: [2, 6],
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderRadius: 6,
      color: '#f8fafc',
    },
  },
  icon: {
    image: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/icon/iconfont-awesome.png',
    size: [24, 24],
    anchor: 'center',
  },
  zooms: zoomRange.value,
  opacity: 1,
}))

const zoomLabel = computed(() => `${zoomRange.value[0]} - ${zoomRange.value[1]}`)

marker.on('click', () => {
  visible.value = !visible.value
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useLabelMarker</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Accent
          <input v-model="color" type="color">
        </label>
        <label>
          Zooms: {{ zoomLabel }}
          <input v-model.number="zoomRange[0]" type="range" min="5" max="18">
          <input v-model.number="zoomRange[1]" type="range" min="12" max="20">
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
      </div>
    </template>
  </div>
</template>
