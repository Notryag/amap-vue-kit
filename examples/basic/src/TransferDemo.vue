<script setup lang="ts">
import { AmapMap, AmapTransfer } from '@amap-vue/core'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const origin: [number, number] = [116.3217, 39.8949]
const destination: [number, number] = [116.4288, 39.9026]
const options = { city: '北京市' }
</script>

<template>
  <div v-if="props.enabled">
    <p>北京西站 → 北京站</p>
    <AmapMap class="transfer-map" :center="[116.375, 39.9]" :zoom="12">
      <AmapTransfer :origin="origin" :destination="destination" :options="options" />
    </AmapMap>
  </div>
  <p v-else>
    配置高德 Key 和对应的安全密钥后即可查询公交换乘。
  </p>
</template>

<style scoped>
.transfer-map {
  width: 100%;
  height: clamp(360px, 55vw, 510px);
}
</style>
