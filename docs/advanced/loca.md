# Loca 可视化

Loca 是高德 JSAPI 2.x 的 WebGL 可视化能力，适合点位热区、热力图、面数据和轨迹等高密度数据场景。`@amap-vue/loca` 提供了 Vue 组件和组合式 hooks，可以直接和 `@amap-vue/core` 的 `<AmapMap>` 配合使用。

## 安装

```bash
pnpm add @amap-vue/core @amap-vue/loca @amap-vue/shared vue
```

## 配置 Loader

Loca 脚本需要和 JSAPI 一起加载。应用入口只需要配置一次：

```ts
import AmapVue from '@amap-vue/core'
import AmapLoca from '@amap-vue/loca'
import { loader } from '@amap-vue/shared'
import { createApp } from 'vue'
import App from './App.vue'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
  loca: true,
})

createApp(App)
  .use(AmapVue)
  .use(AmapLoca)
  .mount('#app')
```

## 最小示例

`<AmapLocaProvider>` 接收地图实例并创建 Loca 容器，内部图层会自动加入容器并在数据变化后渲染。

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const map = shallowRef<AMap.Map | null>(null)
const points = [
  { lng: 116.397, lat: 39.908, value: 80 },
  { lng: 116.405, lat: 39.912, value: 60 },
]
</script>

<template>
  <AmapMap :center="[116.404, 39.912]" :zoom="12" view-mode="3D" @ready="map = $event">
    <AmapLocaProvider v-if="map" :map="map">
      <AmapLocaPointLayer
        :data="points"
        :layer-style="{
          radius: 12,
          unit: 'px',
          color: item => item.value > 65 ? '#f97316' : '#2563eb',
          borderColor: 'rgba(15, 23, 42, 0.45)',
          borderWidth: 1,
        }"
      />
    </AmapLocaProvider>
  </AmapMap>
</template>
```

## 在线示例

<ClientOnly>
  <LocaVisualizationDemo />
</ClientOnly>

<script setup lang="ts">
import LocaVisualizationDemo from '../examples/advanced/LocaVisualizationDemo.vue'
</script>

## 可用组件

- `<AmapLocaProvider>`：创建并提供 Loca 容器。
- `<AmapLocaPointLayer>`：点数据图层，数据项默认读取 `lng` / `lat` 字段。
- `<AmapLocaHeatmapLayer>`：热力图图层，默认读取 `value` 字段。
- `<AmapLocaPolygonLayer>`：GeoJSON 面图层，适合行政区、围栏、网格面等数据。

## 常见问题

- **没有效果**：确认 loader 配置了 `loca: true`，并且页面已经配置 `VITE_AMAP_KEY`。
- **点位不显示**：`AmapLocaPointLayer` 默认要求数据项包含数值型 `lng` 和 `lat`，也可以通过 `lngKey`、`latKey` 改字段名。
- **容器为空**：`AmapLocaProvider` 需要拿到真实的 `AMap.Map` 实例，推荐在 `<AmapMap @ready>` 后再渲染 Provider。
- **大数据卡顿**：尽量传入扁平对象数组，避免在 `layerStyle` 回调里做重计算；过滤、聚合等预处理建议放在上游 computed 中。
