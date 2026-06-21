# 园区底图

大型园区、公园或展馆经常会使用自绘平面图，而不是默认地图瓦片。可以把高德地图切到更克制的底图样式，再叠加一张 ImageLayer，让用户保留缩放、拖拽等熟悉交互，同时看到定制底图。

```vue
<script setup lang="ts">
import { useImageLayer, useMap, useTileLayer } from '@amap-vue/hooks'
import { ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)

const { map, ready } = useMap(() => ({
  container,
  center: [121.49856, 31.23944],
  zoom: 17,
  viewMode: '3D',
  mapStyle: 'amap://styles/whitesmoke',
}))

// 隐藏默认底图，避免干扰园区平面图。
useTileLayer(() => map.value, {
  visible: false,
})

const campusLayer = useImageLayer(() => map.value, {
  url: 'https://your-domain.example/assets/campus-plan.png',
  bounds: [
    [121.49693, 31.23863],
    [121.50019, 31.24022],
  ],
  opacity: 0.85,
})

ready(() => {
  campusLayer.show()
})
</script>

<template>
  <div ref="container" class="map" />
</template>

<style scoped>
.map {
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
```

`bounds` 要和图片四角对应的经纬度范围一致。Vite 项目里可以把 PNG 或 SVG 放到 `public/`，如果需要作为源码资源打包，也可以改成 `new URL('../assets/campus-plan.png', import.meta.url).href`。

## 说明

- 建议在 UI 里保留切回卫星图或默认矢量图的入口，方便用户确认方位。
- ImageLayer 不会自动重投影，底图标定时要使用 GCJ-02 坐标，避免和 Marker、Polygon 等覆盖物错位。
- 建筑、导航路线、围栏等交互元素可以继续用标准组件绘制在图片之上。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## 在线示例

<ClientOnly>
  <CampusBasemapRecipe />
</ClientOnly>

<script setup lang="ts">
import CampusBasemapRecipe from '../examples/recipes/CampusBasemapRecipe.vue'
</script>
