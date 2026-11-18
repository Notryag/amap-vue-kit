# `useBuildings`

为已有地图附加高德楼块图层，控制显示状态以及指定区域的楼顶和侧墙颜色。

## 最小示例

```ts
import { useBuildings } from '@amap-vue/hooks'

const { overlay } = useBuildings(map, { heightFactor: 1.2 })
```

## TS 签名

```ts
type UseBuildingsOptions = AMap.BuildingsOptions

function useBuildings(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options?: MaybeRefOrGetter<UseBuildingsOptions>,
): OverlayLifecycle<AMap.Buildings>
```

返回值提供 `overlay`、`on()`、`off()` 和 `destroy()`。配置字段见 [组件文档](../components/buildings)。

## 完整示例

```ts
const visible = ref(true)
const wallColor = ref('#1d4ed8')
const buildings = useBuildings(() => map.value, () => ({
  visible: visible.value,
  styleOpts: {
    areas: [
      {
        path: [
          [116.46, 39.908],
          [116.471, 39.908],
          [116.471, 39.919],
          [116.46, 39.908]
        ],
        color1: '#60a5fa',
        color2: wallColor.value,
        rejectTexture: true,
      }
    ],
  },
}))
```

## 常见错误

- 创建地图时关闭默认楼块，并用 `3D` 视图查看立体效果。修改围栏配色时使用 `styleOpts`。
- 在组件外使用时，请在地图销毁前调用 `destroy()`。

[打开地图示例和完整源码](../components/buildings) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
