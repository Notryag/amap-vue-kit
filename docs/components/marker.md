# `<AmapMarker>`

`<AmapMarker>` renders a standard JSAPI marker and automatically registers itself with the nearest `<AmapMap>`.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `position` | `LngLatLike` | Marker coordinates. |
| `icon` | `string \| AMap.Icon` | Custom icon definition. |
| `label` | `string \| AMap.MarkerLabelOptions` | Optional label displayed next to the marker. |
| `draggable` | `boolean` | Enables drag interactions. |
| `zIndex` | `number` | Z-index ordering. |
| `extData` | `any` | Arbitrary data stored on the marker. |
| `offset` | `AMap.Pixel \| [number, number]` | Pixel offset relative to the anchor point. |
| `visible` | `boolean` | Controls marker visibility. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Marker` | Fired when the marker is created. |
| `click` | `any` | Marker click events. |
| `dragend` | `any` | Fired after a drag finishes. |
| `mouseover` | `any` | Hover enter events. |
| `mouseout` | `any` | Hover leave events. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="11" style="height: 320px">
  <AmapMarker :position="[116.397, 39.908]" @click="handleClick" />
</AmapMap>
```

Markers support arbitrary slot content inside `<AmapInfoWindow>` instances for rich popups.

## Live example

<ClientOnly>
  <MarkerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MarkerComponentDemo from '../examples/MarkerComponentDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
