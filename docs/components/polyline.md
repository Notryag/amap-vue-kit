# `<AmapPolyline>`

Draw polylines representing paths or routes. The component consumes the map context and updates reactively as props change.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `path` | `LngLatLike[]` | Ordered list of coordinates. |
| `options` | `Partial<AMap.PolylineOptions>` | Additional JSAPI options. |
| `visible` | `boolean` | Toggles visibility. |
| `extData` | `any` | Custom metadata. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Polyline` | Fired after creation. |
| `click` | `any` | Click events along the line. |
| `mouseover` | `any` | Pointer enter events. |
| `mouseout` | `any` | Pointer leave events. |

## Usage

```vue
<AmapPolyline
  :path="[
    [116.397, 39.908],
    [116.427, 39.903],
    [116.45, 39.92]
  ]"
  :options="{ strokeColor: '#4b8bff', strokeWeight: 4 }"
/>
```

## Live example

<ClientOnly>
  <PolylineComponentDemo />
</ClientOnly>

<script setup lang="ts">
import PolylineComponentDemo from '../examples/PolylineComponentDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
