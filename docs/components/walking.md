# `<AmapWalking>`

使用内置表单和可选 JSAPI 面板规划步行路线。`<AmapWalking>` 封装 [`useWalking`](/hooks/use-walking)，并保持路线表单响应式。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `origin` | `WalkingEndpoint` | `undefined` | 起点，支持地址字符串或 `LngLatLike`。 |
| `destination` | `WalkingEndpoint` | `undefined` | 终点，支持地址字符串或 `LngLatLike`。 |
| `auto` | `boolean` | `true` | 起点或终点变化时自动触发路线规划。 |
| `panel` | `boolean` | `true` | 渲染原生步行结果面板。 |
| `options` | `Partial<AMap.WalkingOptions>` | `{}` | 额外 JSAPI 步行配置，例如 `isOutline`、`hideMarkers` 等。 |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | `undefined` | 将路线渲染绑定到地图实例。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | 自定义 key 或插件的 loader 配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Walking` | Walking 服务创建后触发一次。 |
| `search` | `{ origin: WalkingEndpoint, destination: WalkingEndpoint, result: AMap.WalkingResult \| null }` | 每次路线请求后触发。 |
| `error` | `string` | 组件无法计算路线时触发。 |

## 最小示例

```vue
<AmapWalking :map="map" origin="天安门" destination="景山公园" :options="{ isOutline: true }" />
```

## 完整示例

<ClientOnly>
  <WalkingComponentDemo />
</ClientOnly>

<script setup lang="ts">
import WalkingComponentDemo from '../examples/WalkingComponentDemo.vue'
</script>

### TS 签名

```ts
export interface AmapWalkingProps {
  origin?: WalkingEndpoint
  destination?: WalkingEndpoint
  auto?: boolean
  panel?: boolean
  options?: Partial<AMap.WalkingOptions>
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 传入 `map` prop 可在地图上渲染步行路线。
- 如需自定义触发时机，设置 `auto=false` 并调用暴露的 `search` 方法。
- 自行渲染结果列表或摘要时可以关闭 `panel`。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
