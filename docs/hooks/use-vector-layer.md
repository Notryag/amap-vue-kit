# `useVectorLayer`

在已有地图上挂载原生矢量图层，按批次管理圆点、折线、多边形等覆盖物。

## 最小示例

```ts
import { useVectorLayer } from '@amap-vue/hooks'

const { overlay, add, remove } = useVectorLayer(map)
// overlay.value 就绪后，传入已创建的原生覆盖物实例。
add([circle, polygon])
remove(circle)
```

## TS 签名

```ts
function useVectorLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options?: MaybeRefOrGetter<UseVectorLayerOptions>,
): UseVectorLayerReturn
```

`UseVectorLayerOptions` 包含 `overlays`、`visible` 和 `zIndex`。`UseVectorLayerReturn` 包含图层 ref `overlay`、生命周期方法和以下操作。

| 方法 | 说明 |
| --- | --- |
| `add(vectors)` / `remove(vectors)` | 接收一个矢量实例或实例数组。 |
| `clear()` / `has(vector)` | 清空图层，或判断某实例是否在图层中。 |
| `query(position)` | 根据经纬度获取原生图层命中的矢量覆盖物。 |
| `getBounds()` | 获取图层中覆盖物的范围。 |

## 完整示例

```ts
const vectors = shallowRef<VectorOverlay[]>([])
const visible = ref(true)
const { overlay } = useVectorLayer(map, () => ({
  overlays: vectors.value,
  visible: visible.value,
}))

watch(overlay, (layer) => {
  const AMap = loader.get()
  if (layer && AMap && !vectors.value.length) {
    vectors.value = [
      new AMap.Circle({
        center: [116.397, 39.908],
        radius: 400
      }),
      new AMap.Polyline({
        path: [
          [116.397, 39.908],
          [116.402, 39.91]
        ]
      }),
    ]
  }
})
```

## 常见错误

- 等待 `overlay.value` 就绪后再调用命令式方法。更新 `overlays` 时，图层按实例身份执行增删。
- 在组件外使用时，调用 `destroy()` 清理图层。更换地图时会创建新图层，并重新应用当前的 `overlays`。

[打开地图示例和完整源码](../components/vector-layer) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
