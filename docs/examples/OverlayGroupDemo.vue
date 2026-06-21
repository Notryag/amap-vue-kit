<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

type Category = 'coffee' | 'park'

interface Place {
  id: string
  name: string
  position: [number, number]
  category: Category
}

interface FiltersState {
  coffee: boolean
  park: boolean
}

const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
if (key)
  loader.config({ key })

const center: [number, number] = [116.397, 39.908]
const hasKey = computed(() => Boolean(key))
const overlays = ref<AMap.Marker[]>([])
const visible = ref(true)
const filters = reactive<FiltersState>({ coffee: true, park: true })

const places: Place[] = [
  { id: 'coffee-1', name: '北京咖啡', position: [116.404, 39.915], category: 'coffee' },
  { id: 'coffee-2', name: '朝阳咖啡', position: [116.39, 39.92], category: 'coffee' },
  { id: 'coffee-3', name: 'CBD 烘焙店', position: [116.456, 39.912], category: 'coffee' },
  { id: 'park-1', name: '日坛公园', position: [116.45, 39.915], category: 'park' },
  { id: 'park-2', name: '朝阳公园', position: [116.48, 39.94], category: 'park' },
  { id: 'park-3', name: '龙潭公园', position: [116.435, 39.876], category: 'park' },
]

function disposeMarkers(markers: AMap.Marker[]) {
  markers.forEach((marker) => {
    marker.setMap?.(null)
    ;(marker as any).destroy?.()
  })
}

async function rebuildOverlays() {
  if (!key) {
    disposeMarkers(overlays.value)
    overlays.value = []
    return
  }

  const AMap = await loader.load()
  const next: AMap.Marker[] = []
  for (const place of places) {
    if (place.category === 'coffee' && !filters.coffee)
      continue
    if (place.category === 'park' && !filters.park)
      continue

    const marker = new AMap.Marker({
      position: place.position,
      title: place.name,
      label: {
        content: place.name,
        direction: 'top',
        offset: [0, -12],
      },
      extData: { id: place.id },
    } as any)
    next.push(marker)
  }

  const previous = overlays.value
  overlays.value = next
  disposeMarkers(previous)
}

watch(
  () => [filters.coffee, filters.park],
  () => { void rebuildOverlays() },
  { immediate: true },
)

onBeforeUnmount(() => {
  disposeMarkers(overlays.value)
  overlays.value = []
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      配置 <code>VITE_AMAP_KEY</code> 后查看覆盖物分组。
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="11">
          <AmapOverlayGroup :overlays="overlays" :visible="visible" />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <span>{{ overlays.length }} 个覆盖物</span>
        <label>
          <input v-model="filters.coffee" type="checkbox">
          咖啡店
        </label>
        <label>
          <input v-model="filters.park" type="checkbox">
          公园
        </label>
        <label>
          <input v-model="visible" type="checkbox">
          显示
        </label>
      </div>
    </template>
  </div>
</template>
