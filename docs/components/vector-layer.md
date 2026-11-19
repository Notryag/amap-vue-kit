# `<AmapVectorLayer>`

将圆点、折线和多边形等矢量覆盖物放到同一图层，统一显示或隐藏，并按批次添加、移除和清空。

<DemoPreview>
<ClientOnly>
  <VectorLayerDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/VectorLayerDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import VectorLayerDemo from '../../examples/basic/src/VectorLayerDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="15" style="height: 360px">
  <AmapVectorLayer :overlays="vectors" />
</AmapMap>
```

`vectors` 是由高德 SDK 创建的覆盖物实例数组，例如 `AMap.CircleMarker`、`AMap.Polyline` 和 `AMap.Polygon`。完整示例演示如何在 `ready` 后创建并添加这些实例。

## TS 签名

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `overlays` | `readonly VectorOverlay[]` | 按实例身份批量同步数组增删。 |
| `visible` | `boolean` | 图层可见性，默认 `true`。 |
| `zIndex` | `number` | 图层顺序，默认 `110`。 |
| `options` | `UseVectorLayerOptions` | 通用选项，显式传入的 prop 优先。 |
| `ready` | `(layer: AMap.VectorLayer) => void` | 原生图层挂载后触发。 |

组件 ref 提供 `layer`、`add()`、`remove()`、`clear()`、`has()`、`query()` 和 `getBounds()`。

## 常见错误

- 添加已创建的原生矢量实例。圆点用 `AMap.CircleMarker`，带图标的 `AMap.Marker` 可交给 [覆盖物群组](./overlay-group)。
- 同一个实例由一个容器管理。交给 VectorLayer 的实例应直接构造，再通过 `overlays` 或 `add()` 挂载。
- 用 `remove()` 移除时传入原实例。重新构造的同坐标图形是另一个实例。

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 VectorLayer API](https://lbs.amap.com/api/maps-javascript-api/reference/custom-layer/vectorlayer)
