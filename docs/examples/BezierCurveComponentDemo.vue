<script setup lang="ts">
import type { BezierCurvePath } from '@amap-vue/shared'
import { AmapBezierCurve, AmapMap } from '@amap-vue/core'
import { ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.BezierCurve'] })

const path = ref<BezierCurvePath>([
  [
    [116.35, 39.9],
    [116.36, 39.94],
    [116.38, 39.96],
    [116.41, 39.97],
  ],
  [
    [116.41, 39.97],
    [116.43, 39.96],
    [116.45, 39.92],
    [116.46, 39.9],
  ],
])

const visible = ref(true)
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>&lt;AmapBezierCurve&gt;</code>.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="[116.4, 39.93]" :zoom="12">
          <AmapBezierCurve
            :path="path"
            :visible="visible"
            :options="{ strokeColor: '#722ed1', strokeWeight: 4, strokeOpacity: 0.8 }"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="visible" type="checkbox">
          Visible
        </label>
      </div>
    </template>
  </div>
</template>
