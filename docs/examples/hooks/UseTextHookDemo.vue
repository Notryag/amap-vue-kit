<script setup lang="ts">
import { useText } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const { container, hasKey, map } = useHookDemoMap()

const message = ref('Editable label')
const visible = ref(true)
const highlight = ref(false)

const textStyle = computed(() => ({
  padding: '6px 10px',
  borderRadius: '10px',
  background: highlight.value ? 'rgba(250, 84, 28, 0.92)' : 'rgba(22, 119, 255, 0.92)',
  color: '#fff',
  fontSize: '13px',
  boxShadow: highlight.value ? '0 8px 18px rgba(250, 84, 28, 0.3)' : '0 8px 18px rgba(22, 119, 255, 0.3)',
}))

const overlay = useText(() => map.value, () => ({
  position: [116.397, 39.908] as [number, number],
  text: message.value,
  style: textStyle.value,
  visible: visible.value,
  anchor: 'bottom-center' as AMap.MarkerAnchor,
  offset: [0, -24] as [number, number],
}))

overlay.on('click', () => {
  highlight.value = !highlight.value
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useText</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          Message
          <input v-model="message" type="text" placeholder="Editable label">
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
        <label>
          <input v-model="highlight" type="checkbox">
          Highlight
        </label>
      </div>
    </template>
  </div>
</template>
