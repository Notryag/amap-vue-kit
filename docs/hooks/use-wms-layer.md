# `useWMSLayer`

把 WMS 栅格图层附加到已有的地图实例。地址、GetMap 参数和显示配置可使用响应式数据。

## 最小示例

```ts
import { useWMSLayer } from '@amap-vue/hooks'

const { overlay } = useWMSLayer(map, {
  url: 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi',
  params: { LAYERS: 'BlueMarble_NextGeneration', VERSION: '1.3.0' },
})
```

## TS 签名

```ts
function useWMSLayer(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseWMSLayerOptions>,
): OverlayLifecycle<AMap.TileLayer.WMS> & { reload: () => void }
```

`UseWMSLayerOptions` 对应 [组件属性](../components/wms-layer)。返回值提供 `overlay`、`on()`、`off()`、`reload()` 和 `destroy()`。

## 完整示例

```ts
const layer = ref('BlueMarble_ShadedRelief_Bathymetry')
const opacity = ref(0.8)
const wms = useWMSLayer(() => map.value, () => ({
  url: 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi',
  params: { LAYERS: layer.value, VERSION: '1.3.0', FORMAT: 'image/png' },
  opacity: opacity.value,
}))

function changeLayer() {
  layer.value = 'BlueMarble_NextGeneration'
}
```

## 常见错误

- 使用 `ref`、`computed` 或 getter 传入需要更新的选项。组件卸载会自动清理，组件外使用时请调用 `destroy()`。
- `blend` 和 `tileSize` 在创建时读取。请求参数使用服务支持的名称，例如 `LAYERS`，坐标系需为 EPSG:3857。

[打开地图示例和完整源码](../components/wms-layer) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
