# `<AmapMouseTool>`

使用 JSAPI `MouseTool` 创建交互式绘制体验。组件会与外层 `<AmapMap>` 协调工具生命周期，并提供简单的 `mode` prop 与无渲染插槽工具。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'none' \| 'circle' \| 'rectangle' \| 'polygon' \| 'polyline' \| 'bezierCurve' \| 'ellipse'` | `'none'` | 当前绘制模式。设为 `'none'` 时工具关闭。 |
| `autoClose` | `boolean` | `true` | 每次绘制后关闭工具，并触发 `update:mode="'none'"`。 |
| `drawOptions` | `Partial<AMap.CircleOptions> & ...` | `{}` | 按模式区分的可选图形配置，例如 `circle`、`polygon`。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions>> \| undefined` | – | 透传给 `loader.load` 的加载配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.MouseTool` | 工具实例创建后触发一次。 |
| `draw` | `any` | 覆盖物绘制完成后触发，载荷包含新创建的覆盖物（`event.obj`）。 |
| `update:mode` | `DrawMode` | 组件请求切换模式时触发，用于 `v-model:mode`。 |

## 最小示例

```vue
<AmapMap :center="[116.397, 39.909]" :zoom="13">
  <AmapMouseTool v-model:mode="mode" @draw="handleDraw" />
</AmapMap>
```

如果希望在地图内渲染自定义控件，组件默认插槽会提供辅助函数（`drawCircle`、`activate`、`close`）。

<ClientOnly>
  <MouseToolComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MouseToolComponentDemo from '../examples/MouseToolComponentDemo.vue'
</script>

### TS 签名

```ts
export interface MouseToolProps {
  mode?: DrawMode
  autoClose?: boolean
  drawOptions?: {
    circle?: Partial<AMap.CircleOptions>
    rectangle?: Partial<AMap.RectangleOptions>
    polygon?: Partial<AMap.PolygonOptions>
    polyline?: Partial<AMap.PolylineOptions>
    bezierCurve?: Partial<AMap.BezierCurveOptions>
    ellipse?: Partial<AMap.EllipseOptions>
  }
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 通过 `v-model:mode` 驱动组件时，绘制完成后记得把模式重置为 `'none'`。
- 如果需要连续绘制多个同类型图形，可以将 `autoClose=false` 与暴露的 `close()` 方法搭配使用。
- `draw` 事件会通过 `event.obj` 暴露原始覆盖物；后续需要编辑或移除时请保存引用。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
