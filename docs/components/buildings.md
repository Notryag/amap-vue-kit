# `<AmapBuildings>`

给高德地图添加独立楼块图层。北京国贸示例可以切换围栏内的楼顶和侧墙配色，也可以隐藏楼块查看底图。

<DemoPreview>
<ClientOnly>
  <BuildingsDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/BuildingsDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import BuildingsDemo from '../../examples/basic/src/BuildingsDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[116.465, 39.914]" :zoom="17" :pitch="55" view-mode="3D" :show-building-block="false" style="height: 360px">
  <AmapBuildings :options="{ heightFactor: 1.2, wallColor: '#1d4ed8', roofColor: '#60a5fa' }" />
</AmapMap>
```

## TS 签名

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `AMap.BuildingsOptions` | `heightFactor`、`wallColor` 和 `roofColor` 在创建时读取。`opacity`、`visible`、`zIndex`、`zooms` 和 `styleOpts` 可更新。 |
| `layerStyle` | `AMap.BuildingsStyle` | 响应式围栏样式，优先于 `options.styleOpts`。`color1` 对应楼顶，`color2` 对应侧墙。 |
| `visible` | `boolean` | 图层显隐，优先于 `options.visible`。 |

`ready` 事件和组件的 `layer` ref 提供原生 `AMap.Buildings` 实例。

## 常见错误

- 建议用 `view-mode="3D"`、非零 `pitch` 和较高的缩放级别观察立体效果。是否有楼块取决于高德地图数据覆盖。
- 使用自定义图层时，将 `AmapMap` 的 `show-building-block` 设为 `false`，避免默认楼块与自定义图层叠加。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 Buildings API](https://lbs.amap.com/api/maps-javascript-api/reference/layer/buildings)
