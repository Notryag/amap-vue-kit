<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to see the live demo.
    </div>
    <div v-else class="amap-demo__map">
      <AmapMap :center="center" :zoom="zoom">
        <AmapMarker :position="center" />
      </AmapMap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { loader } from '@amap-vue/shared'

const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
if (key)
  loader.config({ key })

const center = [116.397, 39.908]
const zoom = 11
const hasKey = computed(() => Boolean(key))
</script>
