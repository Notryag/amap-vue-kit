# `useLabelMarker`

在组合式 API 中创建高性能标签标记。该组合式函数与组件层共享同样的生命周期保证。
nent: markers are lazily created once the layer is ready, listeners are rebound after option changes, and everything is cleaned
up on unmount.

```ts
import { useLabelMarker, useLabelsLayer } from '@amap-vue/hooks'

const layer = useLabelsLayer(() => map.value, () => ({ collision: true }))

const marker = useLabelMarker(layer, () => ({
  position: [116.397, 39.908],
  text: { content: 'HQ', direction: 'top' },
}))

marker.on('click', () => console.log('点击标签标记'))
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `marker` | `ShallowRef<AMap.LabelMarker \| null>`，指向标记实例。 |
| `setPosition` | Update the marker position with `LngLatLike` data. |
| `setText` | 应用包含偏移和样式的文本配置。 |
| `setIcon` | Change the icon sprite. |
| `setZooms` | Restrict the zoom range. |
| `setOpacity` / `setZIndex` | 不重建标记即可调整视觉属性。 |
| `setExtData` | 附加任意元数据。 |
| `show` / `hide` | 以命令式方式切换可见性。 |
| `on` / `off` | 订阅或取消订阅标记事件。 |
| `destroy` | 从父图层移除标记并清理监听器。 |

### 说明

- 当标签图层实例变化时，该组合式函数会自动重新挂载标记。
- `text.offset` accepts tuples such as `[0, -12]`; they are converted to `AMap.Pixel` behind the scenes when the JSAPI is available.
- 传入的图层引用为 `null` 时，标记会自动解绑，并等待图层再次可用。
- You can pass a raw `LabelsLayer` instance, the object returned by `useLabelsLayer`, or the `<AmapLabelsLayer>` injection context—the hook queues and attaches markers appropriately in each scenario.

## 完整示例

<ClientOnly>
  <UseLabelMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseLabelMarkerHookDemo from '../examples/hooks/UseLabelMarkerHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
