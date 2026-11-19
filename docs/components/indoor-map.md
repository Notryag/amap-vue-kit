# `<AmapIndoorMap>`

在地图上叠加高德室内图层，展示建筑平面图并切换楼层。示例打开首开广场的室内地图，并根据高德返回的楼层数据生成按钮。

<DemoPreview>
<ClientOnly>
  <IndoorMapDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/IndoorMapDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import IndoorMapDemo from '../../examples/basic/src/IndoorMapDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[116.47331, 39.993574]" :zoom="19" :show-indoor-map="false" style="height: 360px">
  <AmapIndoorMap @ready="layer => layer.showIndoorMap('B0FFFAB6J2', 1)" />
</AmapMap>
```

默认使用高德楼层控件。要改用自定义按钮，可以设置 `hide-floor-bar`，监听 `building-change`，再用组件 ref 的 `showFloor(floor)` 切换楼层。

## TS 签名

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `UseIndoorMapOptions` | 支持 `opacity`、`zIndex`、`visible`、`hideFloorBar` 和创建时设置的 `cursor`。 |
| `visible` | `boolean` | 控制图层显示，优先于 `options.visible`。 |
| `hideFloorBar` | `boolean` | 隐藏高德楼层控件，优先于 `options.hideFloorBar`。 |
| `ready` | `(layer: AMap.IndoorMap) => void` | 图层已挂载，可调用 `showIndoorMap`。 |
| `building-change` | `(building: IndoorBuilding \| null) => void` | 已选建筑和楼层信息。 |

组件 ref 暴露 `layer`、`building`、`showIndoorMap(indoorId, floor?, shopId?)` 和 `showFloor(floor)`。

## 常见错误

- 使用独立图层时，在 `AmapMap` 上设置 `:show-indoor-map="false"`，避免同时启用底图自带的室内图层。
- 如果底图可见但没有楼层数据，请确认环境中的 `VITE_AMAP_KEY` 和 `VITE_AMAP_SECURITY_CODE` 是同一应用的一对凭据，或者应用已配置安全代理。
- `showIndoorMap` 需要支持室内地图的建筑 POI ID。图层准备就绪后再调用，楼层以返回的楼层数据为准。

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 IndoorMap API](https://a.amap.com/jsapi/static/doc/index.html#indoormap)
