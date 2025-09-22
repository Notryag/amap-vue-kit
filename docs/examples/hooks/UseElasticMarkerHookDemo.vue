<script setup lang="ts">
import { useElasticMarker } from '@amap-vue/hooks'
import { computed, ref } from 'vue'
import { useHookDemoMap } from './useHookDemoMap'

const { container, hasKey, map } = useHookDemoMap({ zoom: 12 })

const emphasize = ref(false)

const styles = computed<AMap.ElasticMarkerStyles>(() => ({
  0: {
    icon: {
      img: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
      size: [22, 36],
      anchor: [11, 36],
    },
    label: {
      content: 'Store',
      position: 'top',
      offset: [0, -6],
      style: {
        fontSize: '12px',
        padding: '2px 6px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        color: '#111',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
  1: {
    icon: {
      img: emphasize.value
        ? 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png'
        : 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      size: emphasize.value ? [34, 52] : [30, 46],
      anchor: emphasize.value ? [17, 52] : [15, 46],
    },
    label: {
      content: emphasize.value ? 'Promo active' : 'Flagship',
      position: 'top',
      offset: [0, -8],
      style: {
        fontWeight: emphasize.value ? '600' : '500',
        fontSize: emphasize.value ? '13px' : '12px',
        color: '#111',
        padding: '2px 8px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
      },
    },
  },
}))

const zoomStyleMapping = computed<Record<number, number>>(() => ({
  10: 0,
  12: 0,
  13: 1,
  15: 1,
}))

const marker = useElasticMarker(() => map.value, () => ({
  position: [116.397, 39.908] as [number, number],
  styles: styles.value,
  zoomStyleMapping: zoomStyleMapping.value,
}))

marker.on('click', () => {
  emphasize.value = !emphasize.value
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>useElasticMarker</code>.
    </div>
    <template v-else>
      <div ref="container" class="amap-demo__map" />
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="emphasize" type="checkbox">
          Emphasize style
        </label>
      </div>
    </template>
  </div>
</template>
