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

## 在线示例

<ClientOnly>
  <UseMassMarkersHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMassMarkersHookDemo from '../examples/hooks/UseMassMarkersHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
