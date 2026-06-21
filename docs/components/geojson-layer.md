# `<AmapGeoJSONLayer>`

加载并展示 GeoJSON 数据，无需手动创建覆盖物。组件负责可见性、增量数据更新，并暴露方法与底层 `AMap.GeoJSON` 实例交互。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `GeoJSON.FeatureCollection \| GeoJSON.Feature \| undefined` | – | Feature collection or single feature to import into the layer. |
| `visible` | `boolean` | `true` | 切换图层可见性并保留实例。 |
| `options` | `Partial<AMap.GeoJSON.Options>` | `{}` | Custom JSAPI options such as `getMarker` / `getPolygon` factories. |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.GeoJSON` | GeoJSON 图层创建完成时触发。 |
| `click` | `any` | Forwarded from the underlying overlay. |
| `mouseover` | `any` | Forwarded from the underlying overlay. |
| `mouseout` | `any` | Forwarded from the underlying overlay. |

## 最小示例

```vue
<AmapMap :center="[116.397, 39.909]" :zoom="12">
  <AmapGeoJSONLayer :data="geojson" :options="{ getPolygon, getMarker }" />
</AmapMap>
```

`AmapGeoJSONLayer` re-imports new feature collections whenever the `data` prop changes and re-applies custom factory functions supplied through `options`.

<ClientOnly>
  <GeoJSONLayerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import GeoJSONLayerComponentDemo from '../examples/GeoJSONLayerComponentDemo.vue'
</script>

### TS 签名

```ts
export interface GeoJSONLayerProps {
  data?: GeoJSON.FeatureCollection | GeoJSON.Feature
  visible?: boolean
  options?: Partial<AMap.GeoJSON.Options>
}
```

### 常见错误

- Supply `getPolygon`, `getPolyline`, or `getMarker` functions to customise the overlays generated from your features.
- 流式更新数据时，请克隆 feature collection 以触发 Vue 变更检测（`{ ...collection, features: [...collection.features] }`）。
- 切换大数据集时优先使用 `visible`，避免移除组件后重复导入大数据。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
