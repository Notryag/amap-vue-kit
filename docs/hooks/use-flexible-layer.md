# `useFlexibleLayer`

在已有地图上添加按 `x`、`y`、`z` 生成内容的瓦片图层。

## 最小示例

```ts
import { useFlexibleLayer } from '@amap-vue/hooks'

const { overlay, reload } = useFlexibleLayer(() => map.value, { createTile: drawTile })
```

## TS 签名

```ts
type FlexibleCreateTile = (
  x: number,
  y: number,
  z: number,
  success: (tile: HTMLCanvasElement | HTMLImageElement) => void,
  fail: () => void,
) => void | Promise<void>

function useFlexibleLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseFlexibleLayerOptions>,
): OverlayLifecycle<AMap.TileLayer.Flexible> & { reload: () => void }
```

`UseFlexibleLayerOptions` 对应 [组件属性](../components/flexible-layer)。

## 完整示例

```ts
const { reload } = useFlexibleLayer(() => map.value, {
  createTile(x, y, z, success, fail) {
    const tile = document.createElement('canvas')
    tile.width = 256
    tile.height = 256
    const context = tile.getContext('2d')
    if (!context) {
      fail()
      return
    }
    context.fillText(`${z} / ${x} / ${y}`, 16, 24)
    success(tile)
  },
})
```

## 常见错误

- 每个请求应以 `success()` 或 `fail()` 结束。异常和 Promise 拒绝会按瓦片加载失败处理。
- 组件卸载自动解绑图层。在组件外使用请调用 `destroy()`。异步请求的取消由创建请求的代码负责。

[打开地图示例和完整源码](../components/flexible-layer) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
