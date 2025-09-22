# `<AmapPolygon>`

Render filled polygons with optional holes. Accepts both single-ring and multi-ring paths.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `path` | `LngLatLike[] \| LngLatLike[][]` | Polygon coordinates. |
| `options` | `Partial<AMap.PolygonOptions>` | Extra JSAPI options (stroke color, fill opacity, etc.). |
| `visible` | `boolean` | Toggles visibility. |
| `extData` | `any` | Arbitrary metadata. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Polygon` | Fired after creation. |
| `click` | `any` | Click events. |
| `mouseover` | `any` | Pointer enter events. |
| `mouseout` | `any` | Pointer leave events. |

## Usage

```vue
<AmapPolygon
  :path="[
    [116.39, 39.90],
    [116.42, 39.90],
    [116.42, 39.92],
    [116.39, 39.92]
  ]"
  :options="{ fillColor: 'rgba(75,139,255,0.25)', strokeColor: '#4b8bff' }"
/>
```

## Live example

<ClientOnly>
  <PolygonComponentDemo />
</ClientOnly>

<script setup lang="ts">
import PolygonComponentDemo from '../examples/PolygonComponentDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
