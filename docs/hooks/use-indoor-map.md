# `useIndoorMap`

为已有地图创建独立室内图层，并读取高德返回的已选建筑和楼层信息。

## 最小示例

```ts
import { useIndoorMap } from '@amap-vue/hooks'
import { watch } from 'vue'

const indoor = useIndoorMap(map)

watch(indoor.overlay, (layer) => {
  if (layer)
    indoor.showIndoorMap('B0FFFAB6J2', 1)
})
```

地图初始化时传入 `showIndoorMap: false`，避免同时启用默认室内图层。

## TS 签名

```ts
function useIndoorMap(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options?: MaybeRefOrGetter<UseIndoorMapOptions>,
): UseIndoorMapReturn
```

`UseIndoorMapReturn` 提供 `overlay`、`building`、`showIndoorMap`、`showFloor`、`on`、`off` 和 `destroy`。选项见 [组件 API](../components/indoor-map#ts-签名)。

## 完整示例

```ts
const { overlay, building, showIndoorMap, showFloor } = useIndoorMap(map, { hideFloorBar: true })
const floors = computed(() => building.value?.floor_details?.floor_indexs ?? [])

watch(overlay, (layer) => {
  if (layer)
    showIndoorMap('B0FFFAB6J2', 1)
})

// 绑定到楼层按钮的点击事件。
function selectFloor(floor: number) {
  showFloor(floor)
}
```

## 常见错误

- `showFloor` 接收楼层编号，例如地下 1 层传 `-1`。用 `building` 读取已选楼层和可用编号。
- 使用高德室内服务需要有效的安全配置。地图底图成功加载时，室内服务仍可能单独返回鉴权错误。
- 组件卸载时 Hook 会自动解绑图层和监听。在组件外使用时，请在结束后调用 `destroy()`。

[打开地图示例和完整源码](../components/indoor-map) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
