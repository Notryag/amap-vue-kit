# `useOverlayGroup`

用一个组合式函数分组并批量管理覆盖物。`useOverlayGroup` 封装 `AMap.OverlayGroup`，在覆盖物数组变化时排队更新，并为高频操作提供命令式辅助方法。

```ts
const overlayGroup = useOverlayGroup(() => map.value, () => ({
  overlays: markers.value,
  visible: showGroup.value,
  extData: { type: 'points-of-interest' },
}))

overlayGroup.addOverlay(createMarker(feature))
overlayGroup.clearOverlays()
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `overlays` | `any[]` | 由分组管理的 JSAPI 覆盖物数组。 |
| `visible` | `boolean` | 显示或隐藏分组但不销毁实例。 |
| `extData` | `any` | 透传给 JSAPI 分组的任意元数据。 |
| `…options` | `Record<string, any>` | 直接透传的额外构造选项。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.OverlayGroup \| null>`，指向覆盖物分组实例。 |
| `show()` / `hide()` | 切换分组可见性。 |
| `addOverlay(overlay)` / `addOverlays(overlays)` | 向分组追加覆盖物。 |
| `removeOverlay(overlay)` / `removeOverlays(overlays)` | 从分组中移除指定覆盖物。 |
| `clearOverlays()` | 移除分组管理的全部覆盖物。 |
| `getOverlays()` | 获取当前覆盖物数组快照。 |
| `setExtData(extData)` | 更新分组元数据。 |
| `destroy()` | 销毁覆盖物分组并解绑监听器。 |

### 说明

- 响应式 `overlays` 数组变化时，hook 会清空并重新加入覆盖物，确保 JSAPI 分组保持同步。
- 可以配合加载器辅助方法，在 JSAPI 包就绪后再懒创建覆盖物。
- 拆除大数据集时调用 `destroy()` 或 `clearOverlays()`，避免地图上残留已解绑的标记。

## 完整示例

<ClientOnly>
  <UseOverlayGroupHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseOverlayGroupHookDemo from '../examples/hooks/UseOverlayGroupHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
