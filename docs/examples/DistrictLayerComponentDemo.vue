<script setup lang="ts">
import type { DistrictLayerType } from '@amap-vue/hooks'
import { AmapDistrictLayer, AmapMap } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader({ plugins: ['AMap.DistrictLayer'] })

const type = ref<DistrictLayerType>('Country')
const adcode = ref<string | number | Array<string | number>>('100000')
const depth = ref(1)
const visible = ref(true)

const styles = computed(() => ({
  'fill': 'rgba(37, 99, 235, 0.08)',
  'stroke': 'rgba(37, 99, 235, 0.55)',
  'province-stroke': '#2563eb',
  'city-stroke': '#60a5fa',
}))

function updateRegion(next: string) {
  adcode.value = next
  if (type.value !== 'Country')
    depth.value = 2
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview administrative layers.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="[116.397, 39.908]" :zoom="5">
          <AmapDistrictLayer
            :type="type"
            :adcode="adcode"
            :depth="depth"
            :styles="styles"
            :visible="visible"
            :options="{ opacity: 0.9 }"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Visible
          <input v-model="visible" type="checkbox">
        </label>
        <label>
          Layer type
          <select v-model="type">
            <option value="Country">Country</option>
            <option value="Province">Province</option>
            <option value="City">City</option>
          </select>
        </label>
        <label>
          Depth
          <select v-model.number="depth">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
          </select>
        </label>
        <label>
          Region
          <select @change="updateRegion(($event.target as HTMLSelectElement).value)">
            <option value="100000">China</option>
            <option value="110000">Beijing</option>
            <option value="310000">Shanghai</option>
            <option value="440100">Guangzhou</option>
          </select>
        </label>
      </div>
    </template>
  </div>
</template>
