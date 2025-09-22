<script setup lang="ts">
import { useEditorPolyline } from '@amap-vue/hooks'
import { onBeforeUnmount, shallowRef, watch } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const { container, hasKey, map } = useHookDemoMap()

const polyline = shallowRef<AMap.Polyline | null>(null)
const editing = shallowRef(false)

watch(() => map.value, (instance) => {
  if (instance && !polyline.value) {
    const overlay = new AMap.Polyline({
      path: [
        [116.38, 39.9],
        [116.4, 39.92],
        [116.43, 39.91],
      ],
      strokeColor: '#722ed1',
      strokeWeight: 4,
    })
    overlay.setMap(instance)
    polyline.value = overlay
  }
}, { immediate: true })

const editor = useEditorPolyline(() => map.value, () => ({
  target: polyline.value,
  active: editing.value,
}))

onBeforeUnmount(() => {
  polyline.value?.destroy?.()
  editor.destroy()
})

function toggleEditing() {
  editing.value = !editing.value
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview the polyline editor.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <button type="button" @click="toggleEditing">
          {{ editing ? 'Stop' : 'Edit polyline' }}
        </button>
        <p class="muted">
          Drag vertices when editing is enabled.
        </p>
      </div>
    </template>
  </div>
</template>
