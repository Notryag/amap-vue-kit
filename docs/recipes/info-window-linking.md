# 列表联动信息窗体

这个场景演示如何让 POI 列表、Marker 和 InfoWindow 保持同步。用户悬停列表项、点击 Marker 或键盘聚焦时，只需要更新一个响应式 `activeId`，地图覆盖物会跟着刷新。

```vue
<script setup lang="ts">
import { useInfoWindow, useMap, useMarker } from '@amap-vue/hooks'
import { ref, watch } from 'vue'

interface Place {
  id: number
  name: string
  address: string
  position: [number, number]
}

const places: Place[] = [
  { id: 1, name: '北门咖啡馆', address: '朝阳门西街 12 号', position: [116.396923, 39.90816] },
  { id: 2, name: '图书馆', address: '工人体育场路 88 号', position: [116.40021, 39.90986] },
  { id: 3, name: '屋顶花园', address: '金宝街 22 号', position: [116.40137, 39.90745] },
]

const container = ref<HTMLDivElement | null>(null)
const activeId = ref<number | null>(places[0]?.id ?? null)

const { map, ready } = useMap(() => ({
  container,
  center: places[0]?.position ?? [116.397428, 39.90923],
  zoom: 14,
}))

const markers = places.map(place =>
  useMarker(() => map.value, {
    position: place.position,
    extData: place,
    title: place.name,
  }),
)

const infoWindow = useInfoWindow(() => map.value, {
  offset: [0, -28],
  isCustom: false,
})

function focusPlace(id: number) {
  activeId.value = id
}

watch(activeId, (id) => {
  if (id == null) {
    infoWindow.close()
    return
  }

  const place = places.find(item => item.id === id)
  if (!place)
    return

  infoWindow.setContent(
    `<div class="poi-card"><h4>${place.name}</h4><p>${place.address}</p></div>`,
  )
  infoWindow.setPosition(place.position)
  infoWindow.open()
}, { immediate: true })

ready(() => {
  markers.forEach((marker, index) => {
    marker.on('click', () => focusPlace(places[index].id))
  })
})
</script>

<template>
  <div class="layout">
    <ul class="poi-list">
      <li
        v-for="place in places"
        :key="place.id"
        :class="{ active: place.id === activeId }"
        @mouseenter="focusPlace(place.id)"
        @focusin="focusPlace(place.id)"
      >
        <h4>{{ place.name }}</h4>
        <p>{{ place.address }}</p>
      </li>
    </ul>
    <div ref="container" class="map" />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  gap: 16px;
}

.poi-list {
  width: 220px;
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.poi-list li {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f6f8fb;
  cursor: pointer;
  transition: background 0.2s ease;
}

.poi-list li.active {
  background: #e3f2ff;
}

.map {
  flex: 1;
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
```

示例中的 watcher 负责把当前选中项同步到信息窗体。无论交互来自列表 hover、Marker click，还是键盘 focus，都走同一条状态更新链路。选中项变成 `null` 时记得调用 `infoWindow.close()` 隐藏浮窗。

## 说明

- 可以把业务元数据放进 `extData`，点击 Marker 时同步更新详情面板、表格高亮等 UI。
- 如果列表滚动或搜索输入会频繁触发选中变化，可以给 `focusPlace` 加 debounce，减少信息窗体反复更新。
- 移动端没有 hover，建议同时绑定 `click` 或 `touchstart`，保证触屏设备也能触发联动。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## 在线示例

<ClientOnly>
  <InfoWindowLinkingRecipe />
</ClientOnly>

<script setup lang="ts">
import InfoWindowLinkingRecipe from '../examples/recipes/InfoWindowLinkingRecipe.vue'
</script>
