# `<AmapCircleMarker>`

`<AmapCircleMarker>` wraps the lightweight JSAPI circle marker overlay which renders as a scalable vector circle anchored to map coordinates.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `center` | `LngLatLike` | Marker center coordinates. |
| `radius` | `number` | Radius in pixels. |
| `visible` | `boolean` | Controls marker visibility. |
| `extData` | `any` | Arbitrary metadata attached to the marker. |
| `options` | `Partial<AMap.CircleMarkerOptions>` | Additional JSAPI options such as colors or cursor. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.CircleMarker` | Fired when the marker instance is ready. |
| `click` | `any` | Click events on the circle marker. |
| `mouseover` | `any` | Hover enter events. |
| `mouseout` | `any` | Hover leave events. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="14" style="height: 320px">
  <AmapCircleMarker
    :center="[116.397, 39.908]"
    :radius="16"
    :options="{ fillColor: 'rgba(22, 119, 255, 0.45)', strokeColor: '#1677ff' }"
  />
</AmapMap>
```

## Live example

<ClientOnly>
  <CircleMarkerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import CircleMarkerComponentDemo from '../examples/CircleMarkerComponentDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
