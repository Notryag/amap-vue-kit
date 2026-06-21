# `useEllipse`

响应式管理 `AMap.Ellipse` 覆盖物。该 hook 会处理插件加载，将中心点转换为原生 `AMap.LngLat`，并提供半径、样式、可见性相关方法。

```ts
import { useEllipse } from '@amap-vue/hooks'

const ellipse = useEllipse(() => map.value, () => ({
  center: [116.406, 39.912],
  radius: [900, 500],
  strokeColor: '#fd7e14',
  fillColor: 'rgba(253, 126, 20, 0.3)',
}))

ellipse.setRadius([1200, 600])
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `center` | `LngLatLike` | 椭圆中心点。 |
| `radius` | `[number, number]` | 长短轴半径，单位为米。 |
| `visible` | `boolean` | 切换可见性但不销毁覆盖物。 |
| `…options` | `Partial<AMap.EllipseOptions>` | 透传给 `setOptions` 的额外 JSAPI 选项。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Ellipse \| null>`，指向椭圆实例。 |
| `setCenter(center)` | 更新中心点，支持任意 `LngLatLike`。 |
| `setRadius(radius)` | 更新两个轴向半径，单位为米。 |
| `setOptions(options)` | 转发额外选项。 |
| `setExtData(extData)` | 绑定元数据，便于后续查找。 |
| `show()` / `hide()` | 显式切换可见性。 |
| `destroy()` | 销毁椭圆并清理监听器。 |
| `on(event, handler)` / `off(event, handler)` | 订阅 JSAPI 事件。 |

## 完整示例

<ClientOnly>
  <UseEllipseHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseEllipseHookDemo from '../examples/hooks/UseEllipseHookDemo.vue'
</script>

### 说明

- 半径小于约 20 米时，在低缩放级别下不易操作；可以放大地图，或改用像素类覆盖物。
- 配合 `useEditorEllipse` 可以让用户拖拽控制点，同时保持 Vue 状态同步。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
