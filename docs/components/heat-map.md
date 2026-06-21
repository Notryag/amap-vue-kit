# `<AmapHeatMap>`

使用 JSAPI 热力图插件可视化密度类指标。组件会让数据集与 Vue 状态保持同步，并
exposes helpers to push incremental updates.

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `AMap.HeatMapDataPoint[]` | `[]` | Collection of points with `lng`, `lat`, and `count`. |
| `max` | `number \| undefined` | – | Optional maximum value used to normalise the gradient. |
| `radius` | `number \| undefined` | – | 每个点的影响半径，单位为像素。 |
| `gradient` | `Record<string, string> \| undefined` | – | Custom colour stops mapping ratios (`'0.5'`) to CSS colours. |
| `opacity` | `[number, number] \| undefined` | – | Min/max opacity bounds passed to the JSAPI plugin. |
| `visible` | `boolean` | `true` | 切换热力图可见性但不销毁实例。 |
| `options` | `Partial<AMap.HeatMapOptions>` | `{}` | 额外 JSAPI 选项，例如 `zoomFactor` 或 `unit`。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.HeatMap` | 插件实例创建完成时触发。 |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell">
  <AmapHeatMap :data="points" :radius="32" :gradient="gradient" />
</AmapMap>
```

组件会按需请求 `AMap.HeatMap` 插件，并在 `data`、`radius` 或渐变配置变化时自动重新应用配置。
ient change.

<ClientOnly>
  <HeatMapDemo />
</ClientOnly>

<script setup lang="ts">
import HeatMapDemo from '../examples/HeatMapDemo.vue'
</script>

### TypeScript 签名

```ts
export interface HeatMapProps {
  data?: AMap.HeatMapDataPoint[]
  max?: number
  radius?: number
  gradient?: Record<string, string>
  opacity?: [number, number]
  visible?: boolean
  options?: Partial<AMap.HeatMapOptions>
}
```

### 常见错误

- Large datasets benefit from pre-aggregating values on the server to reduce payload size.
- The heat map uses pixel radii. Increase the radius at low zoom levels to avoid sparse visuals.
- 热力图与其他 WebGL 覆盖物混用时，建议统一 `zIndex` 顺序，避免闪烁伪影。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
