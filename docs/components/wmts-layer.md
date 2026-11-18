# `<AmapWMTSLayer>`

在高德底图上叠加 Web Mercator（EPSG:3857）WMTS 瓦片。示例使用 NASA GIBS，可以切换两种公开影像，或隐藏影像查看底图。 [NASA GIBS 数据说明](https://api.nasa.gov/#gibs)

<DemoPreview>
<ClientOnly>
  <WMTSLayerDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/WMTSLayerDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import WMTSLayerDemo from '../../examples/basic/src/WMTSLayerDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[-109.5, 38.7]" :zoom="5" style="height: 360px">
  <AmapWMTSLayer
    url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi"
    :params="{
      Layer: 'BlueMarble_NextGeneration',
      Version: '1.0.0',
      Style: 'default',
      Format: 'image/jpeg',
      TileMatrixSet: 'GoogleMapsCompatible_Level8',
    }"
    :zooms="[2, 8]"
  />
</AmapMap>
```

## TS 签名

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | WMTS GetTile 服务地址，可更新。 |
| `params` | `AMap.TileLayer.WMTSParams` | GetTile 参数，可更新，如 `Layer`、`Style`、`Format` 和服务需要的 `TileMatrixSet`。 |
| `opacity`、`visible`、`zIndex`、`zooms` | `number`、`boolean`、`number`、`[number, number]` | 图层显示配置，可更新。 |
| `blend`、`tileSize` | `boolean`、`number` | 可选的创建参数。 |

`ready` 返回原生 WMTS 图层，`complete` 转发高德的瓦片加载完成事件。组件 ref 提供 `layer` 和 `reload()`。

## 常见错误

- 服务必须支持 EPSG:3857，并允许浏览器跨域加载瓦片。`TileMatrixSet` 和 `zooms` 应匹配服务公布的瓦片矩阵与级别。
- 高德负责计算 `TileMatrix`、`TileRow` 和 `TileCol`。请把服务的矩阵集标识放在 `TileMatrixSet`。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 WMTS API](https://developer.amap.com/api/maps-javascript-api/reference/ogc/wmts)
