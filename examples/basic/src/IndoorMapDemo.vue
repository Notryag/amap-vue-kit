<script setup lang="ts">
import type { IndoorBuilding } from '@amap-vue/hooks'
import { AmapIndoorMap, AmapMap } from '@amap-vue/core'
import { computed, ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const center: [number, number] = [116.47331, 39.993574]
const poiId = 'B0FFFAB6J2'
const indoor = ref<InstanceType<typeof AmapIndoorMap> | null>(null)
const ready = ref(false)
const requested = ref(false)
const building = shallowRef<IndoorBuilding | null>(null)
const floors = computed(() => building.value?.floor_details?.floor_indexs?.map((floor, index) => ({
  floor,
  label: building.value?.floor_details.floor_names?.[index] || (floor < 0
    ? `B${-floor}`
    : `F${floor}`),
})) ?? [])

function open() {
  indoor.value?.showIndoorMap(poiId, 1)
  requested.value = true
}
</script>

<template>
  <div v-if="props.enabled">
    <div class="indoor-actions">
      <button type="button" :disabled="!ready" @click="open">
        打开首开广场室内地图
      </button>
      <div v-if="floors.length" class="indoor-actions" role="group" aria-label="切换楼层">
        <button
          v-for="{ floor, label } in floors"
          :key="floor"
          type="button"
          :aria-pressed="building?.floor === floor"
          @click="indoor?.showFloor(floor)"
        >
          {{ label }}
        </button>
      </div>
      <span v-else-if="requested" role="status">等待楼层数据。如果没有返回，请检查高德 Key 和安全密钥。</span>
    </div>
    <AmapMap class="indoor-map" :center="center" :zoom="19" :show-indoor-map="false">
      <AmapIndoorMap ref="indoor" :hide-floor-bar="floors.length > 0" @ready="ready = true" @building-change="building = $event" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 和匹配的 <code>VITE_AMAP_SECURITY_CODE</code> 后即可预览室内地图。
  </p>
</template>

<style scoped>
.indoor-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.indoor-actions button {
  border: 1px solid currentColor;
  border-radius: 6px;
  padding: 4px 10px;
}

.indoor-actions button:disabled {
  opacity: 0.5;
}

.indoor-actions button[aria-pressed='true'] {
  color: white;
  background-color: #0369a1;
  border-color: #0369a1;
}

.indoor-map {
  margin-top: 8px;
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
