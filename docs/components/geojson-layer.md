# `<AmapGeoJSONLayer>`

Load and display GeoJSON data without manually instantiating overlays. The component manages visibility, incremental data updates, and exposes helper methods for interacting with the underlying `AMap.GeoJSON` instance.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `GeoJSON.FeatureCollection \| GeoJSON.Feature \| undefined` | – | Feature collection or single feature to import into the layer. |
| `visible` | `boolean` | `true` | Toggle layer visibility while keeping the instance alive. |
| `options` | `Partial<AMap.GeoJSON.Options>` | `{}` | Custom JSAPI options such as `getMarker` / `getPolygon` factories. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.GeoJSON` | Emitted when the GeoJSON layer has been created. |
| `click` | `any` | Forwarded from the underlying overlay. |
| `mouseover` | `any` | Forwarded from the underlying overlay. |
| `mouseout` | `any` | Forwarded from the underlying overlay. |

## Usage

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

### TypeScript signature

```ts
export interface GeoJSONLayerProps {
  data?: GeoJSON.FeatureCollection | GeoJSON.Feature
  visible?: boolean
  options?: Partial<AMap.GeoJSON.Options>
}
```

### Common pitfalls

- Supply `getPolygon`, `getPolyline`, or `getMarker` functions to customise the overlays generated from your features.
- When streaming data, clone the feature collection to trigger Vue change detection (`{ ...collection, features: [...collection.features] }`).
- Use `visible` rather than removing the component to avoid re-importing large datasets.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
