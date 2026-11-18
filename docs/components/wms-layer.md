# `<AmapWMSLayer>`

将支持 EPSG:3857 的 WMS 影像叠加到高德底图。示例使用 NASA GIBS 的两种公开影像，可切换影像、调整不透明度或隐藏图层。 [NASA GIBS 数据说明](https://api.nasa.gov/#gibs)

<DemoPreview>
<ClientOnly>
  <WMSLayerDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/WMSLayerDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import WMSLayerDemo from '../../examples/basic/src/WMSLayerDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[-109.5, 38.7]" :zoom="5" style="height: 360px">
  <AmapWMSLayer
    url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi"
    :params="{ LAYERS: 'BlueMarble_NextGeneration', VERSION: '1.3.0' }"
  />
</AmapMap>
```

## TS 签名

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | WMS 服务地址，可更新。 |
| `params` | `AMap.TileLayer.WMSParams` | GetMap 参数，可更新，如 `LAYERS`、`VERSION`、`STYLES` 或 `TIME`。 |
| `opacity`、`visible`、`zIndex`、`zooms` | `number`、`boolean`、`number`、`[number, number]` | 显示配置，可更新。 |
| `blend`、`tileSize` | `boolean`、`number` | 可选的创建参数。 |

`ready` 返回原生图层，`complete` 转发高德的图块加载完成事件。组件 ref 提供 `layer` 和 `reload()`。

## 常见错误

- 服务需支持 EPSG:3857，并允许当前站点跨域请求。
- `CRS`、`BBOX`、`REQUEST`、`WIDTH` 和 `HEIGHT` 由高德生成。请在 `params` 中传入图层名称及服务需要的其他参数。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德第三方标准图层指南](https://lbs.amap.com/api/javascript-api-v2/guide/layers/wms)
