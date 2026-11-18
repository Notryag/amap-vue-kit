# `useWMTSLayer`

为已有的高德地图添加 EPSG:3857 的 WMTS 图层。修改响应式服务地址或 GetTile 参数后，图层会更新并重载瓦片。

## 最小示例

```ts
import { useWMTSLayer } from '@amap-vue/hooks'

const { overlay } = useWMTSLayer(map, {
  url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi',
  params: {
    Layer: 'BlueMarble_NextGeneration',
    Version: '1.0.0',
    Style: 'default',
    Format: 'image/jpeg',
    TileMatrixSet: 'GoogleMapsCompatible_Level8',
  },
  zooms: [2, 8],
})
```

## TS 签名

```ts
function useWMTSLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseWMTSLayerOptions>,
): OverlayLifecycle<AMap.TileLayer.WMTS> & { reload: () => void }
```

`UseWMTSLayerOptions` 对应 [组件属性](../components/wmts-layer)。返回值提供 `overlay`、`on()`、`off()`、`reload()` 和 `destroy()`。

## 完整示例

```ts
const layer = ref('BlueMarble_NextGeneration')
const wmtsOptions = computed<UseWMTSLayerOptions>(() => ({
  url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi',
  params: {
    Layer: layer.value,
    Version: '1.0.0',
    Style: 'default',
    Format: 'image/jpeg',
    TileMatrixSet: 'GoogleMapsCompatible_Level8',
  },
  zooms: [2, 8],
}))

const wmts = useWMTSLayer(() => map.value, wmtsOptions)

function changeLayer() {
  layer.value = 'BlueMarble_ShadedRelief_Bathymetry'
}
```

## 常见错误

- 用 `ref`、`computed` 或 getter 传入需要更新的配置。组件外使用时，调用 `destroy()` 释放图层。
- `tileSize` 应与服务的瓦片大小相符。`blend` 和 `tileSize` 在创建图层时读取。

[打开地图示例和完整源码](../components/wmts-layer) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
