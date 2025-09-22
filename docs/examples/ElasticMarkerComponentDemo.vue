<script setup lang="ts">
import { AmapElasticMarker, AmapMap } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = ref<[number, number]>([116.397, 39.908])
const zoom = ref(12)
const emphasize = ref(false)

const styles = computed<AMap.ElasticMarkerStyles>(() => ({
  0: {
    icon: {
      img: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      size: [26, 40],
      anchor: [13, 40],
    },
    label: {
      content: 'POI',
      position: 'top',
      offset: [0, -6],
      style: {
        color: '#111',
        fontSize: '12px',
        backgroundColor: '#fff',
        padding: '2px 6px',
        borderRadius: '10px',
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
      content: emphasize.value ? 'Highlighted Store' : 'Flagship Store',
      position: 'top',
      offset: [0, -8],
      style: {
        color: '#111',
        fontWeight: emphasize.value ? '600' : '500',
        fontSize: emphasize.value ? '13px' : '12px',
        backgroundColor: '#fff',
        padding: '2px 8px',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.16)',
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
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>&lt;AmapElasticMarker&gt;</code>.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap v-model:zoom="zoom" :center="center">
          <AmapElasticMarker
            :position="center"
            :styles="styles"
            :zoom-style-mapping="zoomStyleMapping"
            :visible="true"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <div>Zoom: {{ zoom.toFixed(1) }}</div>
        <label>
          <input v-model="emphasize" type="checkbox">
          Emphasize style
        </label>
      </div>
    </template>
  </div>
</template>
