# `useCustomLayer`

把绘制函数交给高德 `CustomLayer`，在 SDK 重绘时读取当前地图投影。调用方也可以在业务数据变化后主动重绘。

## 最小示例

```ts
import { useCustomLayer } from '@amap-vue/hooks'

const { overlay, redraw } = useCustomLayer(() => map.value, { render: draw })
```

## TS 签名

```ts
interface CustomLayerRenderContext {
  canvas: HTMLCanvasElement
  map: AMap.Map
}

function useCustomLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseCustomLayerOptions>,
): OverlayLifecycle<AMap.CustomLayer> & { redraw: () => void }
```

`UseCustomLayerOptions` 对应 [组件属性](../components/custom-layer)。返回值还支持 `on()`、`off()` 和 `destroy()`。

## 完整示例

```ts
const visible = ref(true)
const radius = ref(12)
const { redraw } = useCustomLayer(() => map.value, () => ({
  visible: visible.value,
  render({ canvas, map }) {
    const size = map.getSize()
    canvas.width = size.getWidth()
    canvas.height = size.getHeight()
    const context = canvas.getContext('2d')
    if (!context)
      return

    const point = map.lngLatToContainer([116.3975, 39.9115])
    context.beginPath()
    context.arc(point.getX(), point.getY(), radius.value, 0, Math.PI * 2)
    context.fill()
  },
}))

watch(radius, redraw)
```

## 常见错误

- 页面尺寸变化后，绘制时使用最新的地图尺寸。地图移动后重新计算像素坐标。
- 组件卸载会释放图层。在组件外使用时，请在地图销毁前调用 `destroy()`。

[打开在线地图和完整源码](../components/custom-layer) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
