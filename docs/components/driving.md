# `<AmapDriving>`

通过内置表单和可选结果面板规划驾车路线。`<AmapDriving>` 封装 [`useDriving`](/hooks/use-driving)，处理用户输入，并在启用时渲染 JSAPI 驾车结果面板。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `origin` | `DrivingEndpoint` | `undefined` | 起点，支持地址字符串或 `LngLatLike`。 |
| `destination` | `DrivingEndpoint` | `undefined` | 终点，支持地址字符串或 `LngLatLike`。 |
| `auto` | `boolean` | `true` | 起点或终点变化时自动触发路线规划。 |
| `panel` | `boolean` | `true` | 渲染原生驾车结果面板。 |
| `options` | `Partial<AMap.Driving.Options>` | `{}` | 额外 JSAPI 驾车配置，例如 `policy`、`ferry` 等。 |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | `undefined` | 将路线渲染绑定到地图实例。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | 自定义 Key 或插件的加载器配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Driving` | 驾车服务创建完成后触发。 |
| `search` | `{ origin: DrivingEndpoint, destination: DrivingEndpoint, result: AMap.Driving.SearchResult \| null }` | 每次路线请求结束后触发。 |
| `error` | `string` | 组件无法计算路线时触发。 |

## 用法

```vue
<AmapDriving :map="map" origin="天安门" destination="故宫" :options="{ policy: 0 }" />
```

## 在线示例

<ClientOnly>
  <DrivingComponentDemo />
</ClientOnly>

<script setup lang="ts">
import DrivingComponentDemo from '../examples/DrivingComponentDemo.vue'
</script>

### TypeScript 签名

```ts
export interface AmapDrivingProps {
  origin?: DrivingEndpoint
  destination?: DrivingEndpoint
  auto?: boolean
  panel?: boolean
  options?: Partial<AMap.Driving.Options>
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 如果希望在已有 `<AmapMap>` 实例上渲染路线，请传入 `map` prop。
- 需要手动控制时设置 `auto=false`，并调用暴露的 `search` 方法。
- 如需自定义结果面板，请禁用 `panel` 并提供自己的插槽布局。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
