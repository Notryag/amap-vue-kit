<script setup lang="ts">
import { AmapAutoComplete, AmapMap, AmapMarker } from '@amap-vue/core'
import { usePlaceSearch } from '@amap-vue/hooks'
import { ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

type Poi = AMap.PlaceSearch.Poi & { location: AMap.LngLat }
type Tip = AMap.Autocomplete.Tip

const city = '北京'
const initialCenter: [number, number] = [116.397, 39.908]
const keyword = ref('')
const places = usePlaceSearch({ city, citylimit: true, pageSize: 5 })
const results = shallowRef<Poi[]>([])
const selected = shallowRef<Poi | null>(null)
const status = ref('')
let request = 0

function hasLocation(poi: AMap.PlaceSearch.Poi): poi is Poi {
  return Boolean(poi.location)
}

async function search(value: string, tip?: Tip) {
  const query = value.trim()
  if (!query)
    return

  const current = ++request
  status.value = '正在查询地点…'
  results.value = []
  selected.value = null

  if (tip && hasLocation(tip)) {
    results.value = [tip]
  }
  else {
    const details = tip?.id
      ? await places.getDetails(tip.id)
      : null
    if (current !== request)
      return
    let matches = details?.poiList?.pois.filter(hasLocation) ?? []
    if (!matches.length) {
      const response = await places.search(query)
      if (current !== request)
        return
      if (!response) {
        status.value = '地点查询失败，请检查网络或高德安全配置。'
        return
      }
      matches = response.poiList?.pois.filter(hasLocation) ?? []
    }
    results.value = matches
  }

  selected.value = results.value.find(poi => tip?.id && poi.id === tip.id) ?? results.value[0] ?? null
  status.value = results.value.length
    ? `${results.value.length} 个地点`
    : '没有找到带坐标的地点。'
}

function selectTip(tip: Tip) {
  if (tip.name)
    void search(tip.name, tip)
}
</script>

<template>
  <div v-if="props.enabled" class="poi-search">
    <div class="poi-toolbar">
      <AmapAutoComplete
        v-model="keyword"
        :options="{ city, citylimit: true }"
        placeholder="输入北京的地点，例如天安门"
        @select="selectTip"
        @keyup.enter="search(keyword)"
      />
      <button type="button" :disabled="!keyword.trim()" @click="search(keyword)">
        搜索地点
      </button>
    </div>
    <p v-if="status" role="status">
      {{ status }}
    </p>
    <ul v-if="results.length" class="poi-results">
      <li v-for="(poi, index) in results" :key="poi.id || index">
        <button type="button" :aria-pressed="selected === poi" @click="selected = poi">
          {{ poi.name || '未命名地点' }}
          <span v-if="poi.address">{{ poi.address }}</span>
        </button>
      </li>
    </ul>
    <AmapMap class="poi-map" :center="selected?.location ?? initialCenter" :zoom="selected ? 16 : 13">
      <AmapMarker v-if="selected" :position="selected.location" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 和匹配的 <code>VITE_AMAP_SECURITY_CODE</code> 后即可搜索地点。
  </p>
</template>

<style scoped>
.poi-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 8px;
}

.poi-toolbar > button {
  margin-top: 1.4rem;
}

.poi-search button {
  padding: 5px 10px;
  border: 1px solid currentColor;
  border-radius: 6px;
}

.poi-search button:disabled {
  opacity: 0.5;
}

.poi-results {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  list-style: none;
}

.poi-results span {
  display: block;
  font-size: 0.85em;
}

.poi-results [aria-pressed='true'] {
  color: white;
  background: #0369a1;
}

.poi-map {
  margin-top: 8px;
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
