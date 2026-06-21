# AMap Vue Kit

![AMap Vue Kit demo](docs/public/hero.gif)

面向 Vue 3 的高德地图 JSAPI 2.x 工具箱：把地图、标注、图层、控件、搜索、路线规划、编辑器和 Loca 可视化封装成类型友好的 Vue 组件与 Composables。

如果你正在做门店地图、车辆轨迹、点位管理、围栏编辑、城市数据可视化，或者只是想在 Vue 项目里优雅地接入高德地图，AMap Vue Kit 可以让你少写很多重复的 SDK 胶水代码。

## 为什么值得 Star

- Vue 3 原生体验：组件、插槽、事件、响应式 props，写法贴近普通 Vue 业务代码。
- TypeScript 友好：导出类型完整，编辑器自动提示更舒服。
- 按需组合：只用组件、只用 hooks，或者直接使用共享 loader 都可以。
- SSR-safe：避免在 setup 顶层直接访问 `window`，地图 SDK 惰性加载。
- 插件按需加载：`AMap.ToolBar`、`AMap.Scale`、`AMap.HeatMap` 等插件可随用随取。
- 覆盖常见业务场景：Marker、InfoWindow、Polyline、Polygon、Circle、MassMarks、MarkerCluster、图层、控件、搜索、天气、路线规划、编辑工具。
- 面向大数据点位：提供 MassMarks、LabelsLayer、OverlayGroup、Loca 等能力，适合批量点位和可视化场景。

喜欢这个项目的话，欢迎点一个 Star。它会帮助更多 Vue + 高德地图开发者找到这个工具。

## 安装

使用组件库：

```bash
pnpm add @amap-vue/core @amap-vue/shared
```

只使用 Composables：

```bash
pnpm add @amap-vue/hooks @amap-vue/shared
```

需要 Loca 可视化：

```bash
pnpm add @amap-vue/loca
```

也可以使用 npm 或 yarn：

```bash
npm install @amap-vue/core @amap-vue/shared
yarn add @amap-vue/core @amap-vue/shared
```

## 快速开始

先在入口文件配置高德 Key，并注册组件：

```ts
import AmapVue from '@amap-vue/core'
import { loader } from '@amap-vue/shared'
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@amap-vue/core/style.css'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
})

createApp(App)
  .use(AmapVue)
  .mount('#app')
```

然后在组件里直接声明地图和覆盖物：

```vue
<script setup lang="ts">
function handleMapReady(map: AMap.Map) {
  console.log('AMap ready:', map)
}
</script>

<template>
  <div class="map-page">
    <AmapMap
      :center="[116.397428, 39.90923]"
      :zoom="12"
      view-mode="3D"
      :plugins="['AMap.ToolBar', 'AMap.Scale']"
      @ready="handleMapReady"
    >
      <AmapToolBar />
      <AmapScale />

      <AmapMarker
        :position="[116.397428, 39.90923]"
        label="北京天安门"
      />
    </AmapMap>
  </div>
</template>

<style scoped>
.map-page {
  width: 100%;
  height: 480px;
}
</style>
```

在本地新建 `.env.local`：

```bash
VITE_AMAP_KEY=你的高德 Web JSAPI Key
VITE_AMAP_SECURITY_CODE=你的安全密钥
```

## 组件能力

`@amap-vue/core` 提供声明式组件，适合业务页面快速搭地图：

- 地图容器：`<AmapMap>`
- 点位与信息窗体：`<AmapMarker>`、`<AmapLabelMarker>`、`<AmapInfoWindow>`、`<AmapText>`
- 矢量覆盖物：`<AmapPolyline>`、`<AmapPolygon>`、`<AmapCircle>`、`<AmapRectangle>`、`<AmapEllipse>`、`<AmapBezierCurve>`
- 编辑器：`<AmapPolylineEditor>`、`<AmapPolygonEditor>`、`<AmapCircleEditor>`、`<AmapRectangleEditor>`、`<AmapEllipseEditor>`、`<AmapBezierCurveEditor>`
- 批量点位：`<AmapMassMarks>`、`<AmapMarkerCluster>`、`<AmapLabelsLayer>`、`<AmapOverlayGroup>`
- 图层：`<AmapTileLayer>`、`<AmapTrafficLayer>`、`<AmapSatelliteLayer>`、`<AmapRoadNetLayer>`、`<AmapImageLayer>`、`<AmapHeatMap>`、`<AmapGeoJSONLayer>`、`<AmapDistrictLayer>`
- 控件：`<AmapToolBar>`、`<AmapScale>`、`<AmapControlBar>`、`<AmapMapType>`
- 服务与面板：`<AmapAutoComplete>`、`<AmapPlaceSearch>`、`<AmapDriving>`、`<AmapWalking>`、`<AmapRiding>`、`<AmapWeatherPanel>`、`<AmapReverseGeocodePanel>`
- 交互工具：`<AmapMouseTool>`、`<AmapContextMenu>`

## Hooks 能力

`@amap-vue/hooks` 适合封装自己的地图业务组件，或者在非模板场景中直接管理 JSAPI 实例。

```ts
import { useMap, useMarker, usePlaceSearch } from '@amap-vue/hooks'
```

常用 hooks 包括：

- 地图与覆盖物：`useMap`、`useMarker`、`useOverlay`、`useOverlayGroup`
- 图形：`usePolyline`、`usePolygon`、`useCircle`、`useRectangle`、`useEllipse`、`useBezierCurve`
- 批量点位：`useMassMarkers`、`useLabelMarker`、`useLabelsLayer`、`useMarkerClusterer`
- 图层：`useTileLayer`、`useHeatMap`、`useGeoJSONLayer`、`useDistrictLayer`、`useImageLayer`
- 服务：`useGeocoder`、`useGeolocation`、`usePlaceSearch`、`useAutoComplete`、`useWeather`
- 路线：`useDriving`、`useWalking`、`useRiding`
- 工具：`useMouseTool`、`useContextMenu`、`useEditor`

## 包结构

- `@amap-vue/core`：Vue 3 声明式组件库。
- `@amap-vue/hooks`：无渲染 Composables，可用于二次封装。
- `@amap-vue/shared`：AMap SDK singleton loader、类型与工具函数。
- `@amap-vue/loca`：AMap Loca 2.0 的 Vue 组件与 Composables。
- `docs`：VitePress 文档站与 live demos。
- `examples/basic`：最小示例应用。
- `packages/playground`：本地交互式开发 playground。

## 本地开发

```bash
pnpm install
pnpm lint
pnpm test
pnpm run build:all
```

启动文档：

```bash
pnpm run dev:docs
```

启动示例：

```bash
pnpm run dev:example
```

启动 playground：

```bash
pnpm run dev:playground
```

本地调试真实地图时，在 `.env.local` 中配置：

```bash
VITE_AMAP_KEY=你的高德 Web JSAPI Key
VITE_AMAP_SECURITY_CODE=你的安全密钥
```

## 组件 props 命名约定

组件公共 props 避免使用 Vue 保留或透传属性名，例如 `style`、`class`、`key`、`ref`。当 JSAPI 原始配置里存在 `style` 时，组件层会使用更语义化的别名：

- `styles`：多样式覆盖物配置，例如 `<AmapMassMarks>`。
- `textStyle`：文本覆盖物样式，例如 `<AmapText>`。
- `layerStyle`：Loca 图层视觉配置。

底层 composables 会尽量贴近 JSAPI 命名；这个约定主要面向用户会复制到模板里的组件 props、文档和示例。

## 发布

项目使用 Changesets 管理版本与 changelog。

```bash
pnpm changeset
pnpm changeset version
pnpm install
pnpm changeset publish
```

## License

[MIT](LICENSE)
