# `<AmapLayerGroup>`

把卫星图、路网等原生图层放到同一组，一起显示、隐藏或批量添加和移除。示例可切换整组显隐，也可单独移除卫星图层并保留路网。

<DemoPreview>
<ClientOnly>
  <LayerGroupDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/LayerGroupDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import LayerGroupDemo from '../../examples/basic/src/LayerGroupDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="14" style="height: 360px">
  <AmapLayerGroup :layers="[satellite, roads]" :visible="visible" />
</AmapMap>
```

`satellite` 和 `roads` 分别是 `AMap.TileLayer.Satellite`、`AMap.TileLayer.RoadNet` 实例。在地图 `ready` 后调用 `loader.get()` 取得 SDK，再创建实例。

## TS 签名

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `layers` | `readonly LayerGroupMember[]` | 按实例身份同步增删。 |
| `visible` | `boolean` | 控制组内图层显隐。省略时，各图层保留当前显隐状态。 |
| `options` | `UseLayerGroupOptions` | 接收 `layers` 和 `visible`，显式 prop 优先。 |
| `ready` | `(group: AMap.LayerGroup) => void` | 原生图层组挂载后触发。 |

组件 ref 提供 `group`、`addLayers()`、`removeLayers()`、`clearLayers()`、`getLayers()`、`hasLayer()`、`setOptions()`、`on()` 和 `off()`。

## 常见错误

- 传入支持 `setMap(map)` 和 `setMap(null)` 的原生图层实例。点标记和矢量覆盖物可交给 [覆盖物分组](./overlay-group)。
- 同一个图层交给一个容器管理。先构造实例，再交给图层组挂载。
- 清空和批量解绑事件时使用组件 ref 的方法。卸载组件时会解绑监听，并从地图上移除所有组内图层。

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 LayerGroup API](https://lbs.amap.com/api/maps-javascript-api/reference/group/layergroup)
