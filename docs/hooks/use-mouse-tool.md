# `useMouseTool`

驱动圆形、矩形、多边形、折线、贝塞尔曲线、椭圆等交互式绘制工具，无需手动串接 JSAPI。该 hook 会惰性加载 `AMap.MouseTool`，每个地图只保留一个实例，并为各绘制模式暴露 Promise 风格辅助方法。

```ts
import { useMouseTool } from '@amap-vue/hooks'

const mouseTool = useMouseTool(() => map.value)

async function drawFence() {
  const polygon = await mouseTool.drawPolygon({ strokeColor: '#1677ff' })
  console.log('围栏绘制完成', polygon?.getPath?.())
}
```

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 请求 `MouseTool` 插件时使用的可选加载器配置。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `tool` | `ShallowRef<AMap.MouseTool \| null>`，指向底层鼠标工具实例。 |
| `drawCircle(options?)` | 启动圆形绘制，解析为生成的 `AMap.Circle`。 |
| `drawRectangle(options?)` | 启动矩形绘制，解析为 `AMap.Rectangle`。 |
| `drawPolygon(options?)` | 启动多边形绘制，解析为 `AMap.Polygon`。 |
| `drawPolyline(options?)` | 启动折线绘制，解析为 `AMap.Polyline`。 |
| `drawBezierCurve(options?)` | 启动贝塞尔曲线绘制，解析为 `AMap.BezierCurve`。 |
| `drawEllipse(options?)` | 启动椭圆绘制，解析为 `AMap.Ellipse`。 |
| `close()` | 停止当前绘制模式。 |
| `destroy()` | 销毁鼠标工具并清理监听器。 |
| `on(event, handler)` / `off(event, handler)` | 订阅插件事件，例如 `draw`。 |

## 在线示例

<ClientOnly>
  <UseMouseToolHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMouseToolHookDemo from '../examples/hooks/UseMouseToolHookDemo.vue'
</script>

### 说明

- hook 会复用单个 `MouseTool` 实例。调用另一个 `draw*` 方法会自动取消上一个模式。
- `drawBezierCurve` 需要 `AMap.BezierCurve` 插件；需要时配置 `useDemoLoader`，或通过 `loadOptions` 传入 `{ plugins: ['AMap.BezierCurve'] }`。
- 离开页面时记得调用 `close()`（或 `destroy()`），避免残留监听器。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
