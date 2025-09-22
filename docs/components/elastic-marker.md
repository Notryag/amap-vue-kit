# `<AmapElasticMarker>`

`<AmapElasticMarker>` exposes AMap's ElasticMarker plugin, which renders scalable HTML markers that adapt their size and style across zoom levels.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `position` | `LngLatLike` | Marker coordinates. |
| `styles` | `AMap.ElasticMarkerStyles` | Style definitions for each zoom level. |
| `zoomStyleMapping` | `Record<number, number>` | Map from zoom level to style index. |
| `visible` | `boolean` | Controls marker visibility. |
| `extData` | `any` | Arbitrary metadata. |
| `options` | `Partial<AMap.ElasticMarkerOptions>` | Additional JSAPI options. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.ElasticMarker` | Fired when the marker instance is created. |
| `click` | `any` | Click events on the marker. |
| `mouseover` | `any` | Hover enter events. |
| `mouseout` | `any` | Hover leave events. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="12" style="height: 320px">
  <AmapElasticMarker
    :position="[116.397, 39.908]"
    :styles="{
      0: { icon: { img: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png', size: [26, 40], anchor: [13, 40] } },
      1: { icon: { img: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png', size: [34, 52], anchor: [17, 52] } },
    }"
    :zoom-style-mapping="{ 10: 0, 14: 1 }"
  />
</AmapMap>
```

## Live example

<ClientOnly>
  <ElasticMarkerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import ElasticMarkerComponentDemo from '../examples/ElasticMarkerComponentDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
