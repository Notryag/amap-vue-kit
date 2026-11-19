# `useCanvasLayer`

把调用方的 Canvas 附加到已有的高德地图。地图会根据经纬度范围定位画布，随地图缩放和移动更新。

## 最小示例

```ts
import { useCanvasLayer } from '@amap-vue/hooks'

const { overlay, refresh } = useCanvasLayer(map, {
  canvas,
  bounds: [
    [116.38, 39.90],
    [116.415, 39.923]
  ],
})
```

## TS 签名

```ts
function useCanvasLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseCanvasLayerOptions>,
): OverlayLifecycle<AMap.CanvasLayer> & { refresh: () => void }
```

`UseCanvasLayerOptions` 对应 [组件属性](../components/canvas-layer)。返回值提供 `overlay`、`refresh()`、`on()`、`off()` 和 `destroy()`。

## 完整示例

```ts
const canvas = shallowRef<HTMLCanvasElement | null>(null)
const { refresh } = useCanvasLayer(() => map.value, () => ({
  canvas: canvas.value,
  bounds: [116.38, 39.90, 116.415, 39.923],
}))

function draw() {
  const context = canvas.value?.getContext('2d')
  if (!context)
    return

  context.fillStyle = '#7c3aed'
  context.fillRect(0, 0, 256, 256)
  refresh()
}

onMounted(() => {
  canvas.value = document.createElement('canvas')
  canvas.value.width = 256
  canvas.value.height = 256
  draw()
})
```

## 常见错误

- 3D 视图中修改画布像素后调用 `refresh()`。如果使用自建的动画循环，离开页面时取消它。
- `canvas` 暂为空时图层会离开地图。组件会在卸载时清理图层，组件外使用时调用 `destroy()`。

[打开地图示例和完整源码](../components/canvas-layer) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
