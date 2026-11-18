<script setup lang="ts">
import { AmapMap, AmapPolygon } from '@amap-vue/core'
import { useDistrictSearch } from '@amap-vue/hooks'
import { computed, ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const keyword = ref('110000')
const district = shallowRef<AMap.DistrictSearch.District>()
const pending = ref(false)
const message = ref('')
const { search } = useDistrictSearch({ extensions: 'all', subdistrict: 1, showbiz: false })

const zoomByLevel = {
  country: 3,
  province: 7,
  city: 9,
  district: 11,
  street: 13,
  biz_area: 14,
}
const center = computed(() => district.value?.center ?? [116.397, 39.909] as [number, number])
const zoom = computed(() => district.value ? zoomByLevel[district.value.level] : 9)
const polygonStyle = {
  strokeColor: '#2563eb',
  strokeWeight: 2,
  fillColor: '#60a5fa',
  fillOpacity: 0.2,
}

async function find(code = keyword.value) {
  if (!code.trim() || pending.value)
    return

  keyword.value = code
  pending.value = true
  message.value = ''
  try {
    district.value = (await search(code))?.districtList[0]
    if (!district.value)
      message.value = '未找到行政区，或查询暂时失败。'
  }
  catch {
    message.value = '查询失败，请重试。'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div v-if="props.enabled" class="district-demo">
    <form class="district-actions" @submit.prevent="find()">
      <label>行政区 <input v-model="keyword" placeholder="名称或 adcode" :disabled="pending"></label>
      <button type="submit" :disabled="pending || !keyword.trim()">
        {{ pending ? '查询中…' : '查询' }}
      </button>
    </form>
    <p v-if="message" role="status">
      {{ message }}
    </p>
    <AmapMap class="district-map" :center="center" :zoom="zoom">
      <AmapPolygon
        v-for="(path, index) in district?.boundaries ?? []"
        :key="`${district?.adcode}-${index}`"
        :path="path"
        :options="polygonStyle"
      />
    </AmapMap>
    <div v-if="district" class="district-result">
      <p role="status">
        {{ district.name }}（{{ district.adcode }}）
      </p>
      <div v-if="district.districtList?.length" class="district-actions" aria-label="下级行政区">
        <button
          v-for="item in district.districtList"
          :key="item.adcode"
          type="button"
          :disabled="pending"
          @click="find(item.adcode)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可查询行政区。
  </p>
</template>

<style scoped>
.district-demo,
.district-result {
  display: grid;
  gap: 8px;
}

.district-map {
  width: 100%;
  height: clamp(300px, 45vw, 420px);
}

.district-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.district-actions input,
.district-actions button {
  padding: 3px 8px;
  border: 1px solid currentColor;
  border-radius: 4px;
}
</style>
