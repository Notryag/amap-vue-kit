# `useMarker`

以命令式方式创建和管理 JSAPI 标记。

```ts
const markerApi = useMarker(() => map.value, () => ({
  position: [116.397, 39.908],
  label: 'AMap HQ',
  draggable: true
}))

markerApi.on('click', (event) => {
  console.log('点击标记', event)
})
```

`useMarker` mirrors the props exposed by `<AmapMarker>` so you can switch between declarative and imperative code paths as needed.

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `marker` | `ShallowRef<AMap.Marker \| null>`，指向标记实例。 |
| `setPosition`, `setIcon`, `setLabel`, `setExtData`, `setDraggable`, `setZIndex`, `setOffset`, `setContent`, `setAnchor`, `setIsCustom` | 对应 JSAPI 方法的命令式 setter。 |
| `show` / `hide` | 切换标记可见性。 |
| `on` / `off` | 订阅标记事件。 |
| `destroy` | 从地图上移除标记。 |

当地图引用变为 `null`（例如组件卸载）时，标记会自动移除并销毁。

## 完整示例

<ClientOnly>
  <UseMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMarkerHookDemo from '../examples/hooks/UseMarkerHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
