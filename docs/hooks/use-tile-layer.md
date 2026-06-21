# `useTileLayer`, `useTrafficLayer`, `useRoadNetLayer`, `useSatelliteLayer`

瓦片图层 hooks 封装 JSAPI 瓦片覆盖物，让你可以在 Composition API 中命令式切换影像、交通和路网图层。

## 基础用法

```ts
import { useMap, useTileLayer, useTrafficLayer } from '@amap-vue/hooks'
import { ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)

const { map, ready } = useMap(() => ({
  container,
  center: [116.397, 39.908],
  zoom: 11,
}))

const baseLayer = useTileLayer(() => map.value, {
  tileUrl: 'https://your.tiles/{z}/{x}/{y}.png',
  opacity: 0.8,
})

const traffic = useTrafficLayer(() => map.value, {
  visible: false,
  autoRefresh: true,
  interval: 120,
})

ready(() => {
  traffic.show()
})

// 组件后续逻辑中可以响应式显示或隐藏图层
baseLayer.setOpacity(0.6)
traffic.hide()
```

hook 会等到地图实例与 JSAPI 脚本都可用后再创建图层。专用 hooks 会自动请求必要插件（`AMap.TileLayer.Traffic`、`AMap.TileLayer.Satellite` 等）。

## 参数

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean \| undefined` | `true` | 图层初始可见性。 |
| `opacity` | `number \| undefined` | – | 透明度，取值 `0`（透明）到 `1`（不透明）。 |
| `zIndex` | `number \| undefined` | – | 相对其他覆盖物的渲染顺序。 |
| `tileUrl` | `string \| ((x: number, y: number, level: number) => string) \| undefined` | – | 自定义数据源的 URL 模板或解析函数。 |
| `getTileUrl` | `(x: number, y: number, level: number) => string \| undefined` | – | 动态 URL 的替代回调。提供 `tileUrl` 时会被忽略。 |
| `options` | `Partial<AMap.TileLayerOptions>` | `{}` | 透传额外 JSAPI 选项（`zooms`、`detectRetina` 等）。 |

`useTrafficLayer` 在基础选项上扩展 `autoRefresh`、`interval` 与 `options: Partial<AMap.TileLayer.Traffic.Options>`。`useSatelliteLayer` 和 `useRoadNetLayer` 接收与 `useTileLayer` 相同的选项。

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `overlay` | `ShallowRef<AMap.TileLayer \| null>` | 图层实例的响应式引用。每个变体会收窄为具体类型。 |
| `show` / `hide` | `() => void` | 切换图层但不销毁实例。 |
| `reload` | `() => void` | 强制 JSAPI 重新拉取瓦片（标准图层可用）。 |
| `setOpacity` | `(opacity: number \| undefined) => void` | 原地更新透明度。 |
| `setZIndex` | `(zIndex: number \| undefined) => void` | 调整渲染顺序。 |
| `setTileUrl` | `(url: string \| ((x: number, y: number, level: number) => string) \| undefined) => void` | 动态切换瓦片数据源。 |
| `setOptions` | `(options: Partial<AMap.TileLayerOptions>) => void` | 将更新转发给底层实例。 |
| `on` / `off` | `(event: string, handler: (event: any) => void)` | 订阅或取消订阅 JSAPI 事件。 |
| `destroy` | `() => void` | 从地图移除图层并清理监听器。 |

## 变体

- **`useTrafficLayer`**：启用交通拥堵图层，配合 `autoRefresh` 和 `interval` 可定时拉取新数据。
- **`useRoadNetLayer`**：在主题底图上绘制道路边界，适合底图样式移除轮廓线的场景。
- **`useSatelliteLayer`**：切换为卫星影像瓦片，同时保留矢量覆盖物。

每个变体返回相同的 API，同时将 `overlay.value` 收窄为具体 JSAPI 类。

## 在线示例

<ClientOnly>
  <UseTileLayerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseTileLayerHookDemo from '../examples/hooks/UseTileLayerHookDemo.vue'
</script>

## TypeScript 签名

```ts
import type { OverlayLifecycle } from '@amap-vue/hooks'
import type { MaybeRefOrGetter } from 'vue'

export interface UseTileLayerOptions extends Partial<AMap.TileLayerOptions> {
  visible?: boolean
}

export interface UseTileLayerReturn<TLayer extends AMap.TileLayer = AMap.TileLayer>
  extends OverlayLifecycle<TLayer> {
  show: () => void
  hide: () => void
  reload: () => void
  setOpacity: (opacity: number | undefined) => void
  setZIndex: (zIndex: number | undefined) => void
  setTileUrl: (
    url: string | ((x: number, y: number, level: number) => string) | undefined
  ) => void
  setOptions: (options: Partial<AMap.TileLayerOptions>) => void
}

export interface UseTrafficLayerOptions
  extends UseTileLayerOptions, Partial<AMap.TileLayer.Traffic.Options> {}

export function useTileLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn

export function useTrafficLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTrafficLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.Traffic>

export function useSatelliteLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.Satellite>

export function useRoadNetLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.RoadNet>
```

上方类型均由 `@amap-vue/hooks` 重新导出，`AMap.*` 类型来自 JSAPI 环境声明。

## 常见错误

- 始终传入地图引用（`() => map.value`），不要直接传原始地图实例，以兼容 SSR 和延迟挂载。
- 避免同时配置 `tileUrl` 与 `getTileUrl`；只有 `tileUrl` 为 `undefined` 时 hook 才会优先使用 `getTileUrl`。
- 启用 `autoRefresh` 后交通图层会轮询网络；视图隐藏时暂停刷新可减少配额消耗。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
