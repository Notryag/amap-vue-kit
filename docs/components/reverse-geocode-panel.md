# `<AmapReverseGeocodePanel>`

在一个可直接使用的面板中组合正向与逆向地理编码。组件封装 `useGeocoder`，处理加载状态，并提供默认 UI；也可以通过插槽或暴露方法自定义。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `position` | `[number, number] \| undefined` | – | 用于逆向地理编码的坐标。 |
| `address` | `string` | `''` | 用于正向地理编码的可选地址关键字。 |
| `auto` | `boolean` | `true` | 属性变化时自动触发地理编码。 |
| `geocoderOptions` | `Partial<AMap.Geocoder.Options>` | `{}` | 透传给底层地理编码服务的自定义选项。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions>> \| undefined` | – | 请求插件时使用的加载器配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Geocoder` | 地理编码实例创建完成后触发。 |
| `result` | `{ mode: 'forward' \| 'reverse', result: AMap.Geocoder.GeocodeResult \| AMap.Geocoder.ReGeocodeResult \| AMap.Geocoder.BatchReGeocodeResult \| null }` | 每次地理编码完成后触发。 |
| `error` | `string` | 地理编码请求失败时触发。 |

## 最小示例

```vue
<AmapReverseGeocodePanel :position="position" @result="handleResult" />
```

面板会通过 `ref` 暴露命令式 `search`、`reverse`、`clear` 方法，供高级场景使用。

<ClientOnly>
  <ReverseGeocodePanelDemo />
</ClientOnly>

<script setup lang="ts">
import ReverseGeocodePanelDemo from '../examples/ReverseGeocodePanelDemo.vue'
</script>

### TS 签名

```ts
export interface ReverseGeocodePanelProps {
  position?: [number, number]
  address?: string
  auto?: boolean
  geocoderOptions?: Partial<AMap.Geocoder.Options>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 如果准备通过暴露的 `reverse` 方法手动控制查询，请同时传入 `position` 并设置 `auto=false`。
- 需要自定义布局时，默认插槽会收到 `result`、`loading`、`error`、`search`、`reverse` 等辅助数据和方法。
- 使用 `result` 事件可以将解析后的地址同步到其他 UI 组件。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
