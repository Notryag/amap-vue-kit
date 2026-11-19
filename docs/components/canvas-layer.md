# `<AmapCanvasLayer>`

把自己绘制的 Canvas 贴到指定经纬度范围内。试着拖动或缩放下面的地图，观察方框如何与地面保持对齐。切换配色会重绘同一张画布。

<DemoPreview>
<ClientOnly>
  <CanvasLayerDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/CanvasLayerDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import CanvasLayerDemo from '../../examples/basic/src/CanvasLayerDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[116.3975, 39.9115]" :zoom="13" style="height: 360px">
  <AmapCanvasLayer :canvas="canvas" :bounds="[[116.38, 39.90], [116.415, 39.923]]" />
</AmapMap>
```

`canvas` 是调用方创建并绘制的 `HTMLCanvasElement`。在 Vue 的 `onMounted()` 中创建画布即可用于此示例。

## TS 签名

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `canvas` | `HTMLCanvasElement \| null` | 画布，可更换。为 `null` 时图层从地图解绑。 |
| `bounds` | `CanvasLayerBounds` | 原生 `AMap.Bounds`、`[西南角, 东北角]` 或 `[西, 南, 东, 北]`。 |
| `visible`、`opacity`、`zIndex`、`zooms` | `boolean`、`number`、`number`、`[number, number]` | 图层显示配置，可更新。 |

`ready` 返回原生图层。组件 ref 提供 `layer` 和 `refresh()`。3D 视图中重绘同一个 Canvas 后，调用 `refresh()` 上传新像素。

## 常见错误

- 请把组件放进 `<AmapMap>`，并给地图容器设置高度。
- `bounds` 的坐标使用 `[经度, 纬度]` 顺序。画布的像素尺寸控制分辨率，地图上的覆盖范围由 `bounds` 决定。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 Canvas 图层指南](https://lbs.amap.com/api/javascript-api-v2/guide/layers/canvaslayer)
