# `useGLCustomLayer`

给已有的高德 3D 地图添加共享 WebGL 上下文中的绘制回调。

## 最小示例

```ts
import { useGLCustomLayer } from '@amap-vue/hooks'

const { overlay, redraw, destroy } = useGLCustomLayer(() => map.value, { init, render: draw })
```

## TS 签名

```ts
interface GLCustomLayerContext {
  gl: WebGLRenderingContext | WebGL2RenderingContext
  map: AMap.Map
}

interface UseGLCustomLayerOptions {
  init?: (context: GLCustomLayerContext) => void | (() => void)
  render: (context: GLCustomLayerContext & { state: unknown }) => void
  visible?: boolean
  opacity?: number
  zIndex?: number
  zooms?: [number, number]
}
```

Hook 还接受 `visible`、`opacity`、`zIndex` 和 `zooms`。返回值提供 `overlay`、`redraw()`、`destroy()`、`on()` 和 `off()`。

## 常见错误

- 切换地图会创建新图层。上次 `init` 返回的清理函数会在图层解绑前调用，释放旧上下文中的资源。
- 在组件外使用时，请先调用 `destroy()`，再销毁地图。底图与自定义图层共用 WebGL 上下文，清理函数只释放当前图层创建的资源。

## 完整示例

[打开在线地图和完整源码](../components/gl-custom-layer) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
