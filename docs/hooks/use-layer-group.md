# `useLayerGroup`

为已有地图创建图层组，按批次更新成员、设置图层属性和监听成员事件。

## 最小示例

```ts
import { useLayerGroup } from '@amap-vue/hooks'

const group = useLayerGroup(map, {
  layers: [satellite, roads]
})
```

## TS 签名

```ts
function useLayerGroup(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options?: MaybeRefOrGetter<UseLayerGroupOptions>,
): UseLayerGroupReturn
```

| 成员 | 说明 |
| --- | --- |
| `overlay` | 原生图层组 ref。 |
| `addLayers(layers)` / `removeLayers(layers)` | 批量添加或移除成员。 |
| `getLayers()` / `hasLayer(layer)` | 读取成员快照或判断图层是否在组内。 |
| `clearLayers()` | 从组和地图上移除所有成员。 |
| `setOptions(options)` | 对支持相应选项的图层批量设置显隐、透明度、层级或缩放范围。 |
| `on(event, handler)` / `off(event, handler)` | 批量绑定和解绑成员事件，新加入的成员也会绑定已注册的监听。 |
| `destroy()` | 销毁图层组并解除挂载。 |

## 完整示例

```ts
const layers = shallowRef<LayerGroupMember[]>([satellite, roads])
const visible = ref(true)
const group = useLayerGroup(map, () => ({
  layers: layers.value,
  visible: visible.value,
}))

function useRoadsOnly() {
  layers.value = [roads]
}

function dimLayers() {
  group.setOptions({ opacity: 0.6 })
}
```

## 常见错误

- 调用命令式操作前等待 `overlay.value` 就绪。数组的增删通过成员实例身份同步。
- 组件卸载时会将成员从地图移除并解绑监听。在组件外使用时，结束后调用 `destroy()`。

[打开地图示例和完整源码](../components/layer-group) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
