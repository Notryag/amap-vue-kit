# `<AmapTileLayer>` 与相关组件

`<AmapTileLayer>` 封装 JSAPI 瓦片图层，让你可以在底图上叠加额外影像。它也是 `<AmapTrafficLayer>`、`<AmapRoadNetLayer>`、`<AmapSatelliteLayer>` 这些便捷组件的基础。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | 控制图层是否添加到地图。 |
| `opacity` | `number \| undefined` | – | 图层相对底图的透明度。 |
| `zIndex` | `number \| undefined` | – | 图层之间的渲染顺序。 |
| `tileUrl` | `string \| ((x: number, y: number, level: number) => string)` | – | 自定义瓦片 URL 模板，与 `getTileUrl` 互斥。 |
| `getTileUrl` | `(x: number, y: number, level: number) => string` | – | 命令式 URL 解析函数。 |
| `options` | `Partial<AMap.TileLayerOptions>` | `{}` | 额外 JSAPI 选项，例如 `zooms` 或 `tileSize`。特定变体的值（如交通图刷新间隔）通过对应组件专用的 `options` prop 传入。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.TileLayer` | 图层实例创建并添加到地图后触发。 |

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showTraffic = ref(true)
const showRoadNet = ref(false)
const showSatellite = ref(false)
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="11" class="map-shell">
    <AmapTrafficLayer v-if="showTraffic" auto-refresh />
    <AmapRoadNetLayer v-if="showRoadNet" />
    <AmapSatelliteLayer v-if="showSatellite" />
  </AmapMap>
</template>
```

切换响应式标记即可添加或移除各图层。组件卸载时会自动销毁实例。

<ClientOnly>
  <TileLayerDemo />
</ClientOnly>

<script setup lang="ts">
import TileLayerDemo from '../examples/TileLayerDemo.vue'
</script>

### 变体

- **`<AmapTrafficLayer>`**：渲染实时交通拥堵信息，可使用 `auto-refresh` 与 `interval` 定期刷新。
- **`<AmapRoadNetLayer>`**：在底图上叠加路网线，适合底图样式隐藏道路边界的场景。
- **`<AmapSatelliteLayer>`**：切换为卫星影像瓦片，同时保留矢量覆盖物。

所有变体都接收通用的 `visible`、`opacity`、`zIndex`、`options` 属性。它们的 `ready` 事件会返回具体 JSAPI 图层（`AMap.TileLayer.Traffic`、`AMap.TileLayer.RoadNet` 等）。

### 自定义数据源

提供 `tileUrl` 模板即可接入自定义栅格服务：

```vue
<AmapTileLayer
  tile-url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x=[x]&y=[y]&z=[z]"
  :options="{ detectRetina: true }"
/>
```

当 URL 依赖复杂逻辑（鉴权头、签名 URL 等）时，优先使用 `getTileUrl` 回调。

### TypeScript 签名

```ts
export interface TileLayerProps {
  visible?: boolean
  opacity?: number
  zIndex?: number
  tileUrl?: string | ((x: number, y: number, level: number) => string)
  getTileUrl?: (x: number, y: number, level: number) => string
  options?: Partial<AMap.TileLayerOptions>
}

export interface TrafficLayerProps extends TileLayerProps {
  autoRefresh?: boolean
  interval?: number
  options?: Partial<AMap.TileLayer.Traffic.Options>
}

export interface RoadNetLayerProps extends TileLayerProps {
  options?: Partial<AMap.TileLayerOptions>
}

export interface SatelliteLayerProps extends TileLayerProps {
  options?: Partial<AMap.TileLayerOptions>
}

type TileLayerReadyPayload = AMap.TileLayer | AMap.TileLayer.Traffic | AMap.TileLayer.RoadNet | AMap.TileLayer.Satellite
```

属性接口和 `ready` 载荷类型与组件导出保持一致，并复用 `@amap-vue/hooks` 的 hook 类型。

### 常见错误

- 确保 `<AmapTileLayer>` 及其变体位于 `<AmapMap>` 内部，以访问注入的地图上下文。
- 不要为同一张地图配置互相冲突的加载器；调用一次 `loader.config` 共享插件配置即可。
- `auto-refresh` 会每隔几秒发起网络请求；图层不在可视区域时建议禁用以节省配额。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
