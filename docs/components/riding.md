# `<AmapRiding>`

使用内置表单和可选 JSAPI 面板规划骑行路线。`<AmapRiding>` 封装 [`useRiding`](/hooks/use-riding)，负责搜索状态并上报路线结果。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `origin` | `RidingEndpoint` | `undefined` | 起点，支持地址字符串或 `LngLatLike`。 |
| `destination` | `RidingEndpoint` | `undefined` | 终点，支持地址字符串或 `LngLatLike`。 |
| `auto` | `boolean` | `true` | 起点或终点变化时自动触发路线规划。 |
| `panel` | `boolean` | `true` | 渲染原生骑行结果面板。 |
| `options` | `Partial<AMap.Riding.Options>` | `{}` | 额外 JSAPI 骑行配置，例如 `policy`、`hideMarkers` 等。 |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | `undefined` | 将路线渲染绑定到地图实例。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | 自定义 key 或插件的 loader 配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Riding` | Riding 服务创建后触发一次。 |
| `search` | `{ origin: RidingEndpoint, destination: RidingEndpoint, result: AMap.Riding.SearchResult \| null }` | 每次路线请求后触发。 |
| `error` | `string` | 组件无法计算路线时触发。 |

## 最小示例

```vue
<AmapRiding :map="map" origin="天安门" destination="北海公园" :options="{ policy: 0 }" />
```

## 完整示例

<ClientOnly>
  <RidingComponentDemo />
</ClientOnly>

<script setup lang="ts">
import RidingComponentDemo from '../examples/RidingComponentDemo.vue'
</script>

### TS 签名

```ts
export interface AmapRidingProps {
  origin?: RidingEndpoint
  destination?: RidingEndpoint
  auto?: boolean
  panel?: boolean
  options?: Partial<AMap.Riding.Options>
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 如果希望在地图上渲染骑行路线，请传入 `map` prop。
- 设置 `auto=false` 可关闭自动规划，并改为手动调用 `search`。
- 计划自定义面板 UI 时可以关闭 `panel`。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
