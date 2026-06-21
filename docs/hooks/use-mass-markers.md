# `useMassMarkers`

使用 JSAPI `MassMarks` 插件渲染数千个轻量点标记。该组合式函数会延迟加载插件，保持数据集响应式，并提供样式与数据更新方法。

```ts
import { useMassMarkers } from '@amap-vue/hooks'

const mass = useMassMarkers(() => map.value, () => ({
  data: points.value,
  style: [
    { url: '/images/cluster-blue.png', anchor: [6, 6], size: [12, 12] },
    { url: '/images/cluster-orange.png', anchor: [10, 10], size: [20, 20] },
  ],
}))

watch(points, value => mass.setData(value))
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `AMap.MassData[]` | 点标记数据集（必填）。 |
| `style` | `AMap.MassMarkersStyleOptions \| AMap.MassMarkersStyleOptions[]` | 单样式或多样式配置。 |
| `options` | `Partial<AMap.MassMarkersOptions>` | 额外插件选项（透明度、缩放范围等）。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `mass` | `ShallowRef<AMap.MassMarks \| null>`，指向海量点实例。 |
| `setData(data)` | 替换数据集。 |
| `setStyle(style)` | 更新样式定义。 |
| `destroy()` | 销毁插件实例并释放引用。 |

### 说明

- hook 会自动加载 `AMap.MassMarks` 所需的 JSAPI 2.0 兼容插件。
- 当地图引用变为 `null` 时，海量点会从地图解绑；地图恢复后会重新挂载。
- 使用轻量点数据对象，避免在 `extData` 中放入大体积载荷，以降低更新成本。

## 完整示例

<ClientOnly>
  <UseMassMarkersHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMassMarkersHookDemo from '../examples/hooks/UseMassMarkersHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
