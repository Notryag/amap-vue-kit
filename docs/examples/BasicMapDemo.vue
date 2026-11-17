<script setup lang="ts">
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = [116.397, 39.908]
const zoom = 11
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      配置 <code>VITE_AMAP_KEY</code> 后查看在线示例。
    </div>
    <div v-else class="amap-demo__map">
      <AmapMap :center="center" :zoom="zoom">
        <AmapMarker :position="center" />
      </AmapMap>
    </div>
  </div>
</template>
