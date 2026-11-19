# `<AmapCustomLayer>`

用自己的绘制回调控制地图视口上的 Canvas。示例把三个经纬度点转换成屏幕坐标，地图移动或缩放时重新投影，圆点半径仍以屏幕像素计量。

<DemoPreview>
<ClientOnly>
  <CustomLayerDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/CustomLayerDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import CustomLayerDemo from '../../examples/basic/src/CustomLayerDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[116.3975, 39.9115]" :zoom="13" style="height: 360px">
  <AmapCustomLayer :render="draw" />
</AmapMap>
```

`draw({ canvas, map })` 在每次重绘时调用。组件创建画布，调用方决定画布尺寸和绘制内容。

## TS 签名

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `render` | `(context: CustomLayerRenderContext) => void` | 绘制回调，接收画布和当前地图。 |
| `alwaysRender` | `boolean` | 创建选项。开启后，SDK 可在地图交互过程中重绘。 |
| `visible`、`opacity`、`zIndex`、`zooms` | `boolean`、`number`、`number`、`[number, number]` | 图层显示配置，可更新。 |

组件通过 `ready` 事件返回原生图层，组件 ref 提供 `layer` 和 `redraw()`。

## 常见错误

- 绘制经纬度点时，用 `map.lngLatToContainer()` 计算当前屏幕位置。按地图容器尺寸和设备像素比设置画布大小。
- 绘制函数读取的数据发生变化时，可手动调用 `redraw()`。SDK 会在地图变化时调用绘制函数。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德自定义图层指南](https://lbs.amap.com/api/javascript-api-v2/guide/layers/customlayer)
