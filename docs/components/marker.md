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
| `anchor` | `AMap.MarkerAnchor` | Anchor position used together with `offset` for precise alignment. |
| `content` | `string \| HTMLElement` | Custom HTML/SVG content. When omitted the default marker icon is rendered. |
| `isCustom` | `boolean` | Force-enable or disable custom rendering. Automatically inferred when a slot or `content` is provided. |
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

### Custom HTML or SVG content

`<AmapMarker>` now mirrors the JSAPI `content` capability. Pass a string/HTMLElement through the `content` prop or provide a default slot to render Vue templates as marker content. When slot content is present the component automatically toggles `isCustom` and the marker uses the supplied HTML/SVG instead of the default icon.

```vue
<AmapMarker
  :position="[116.397, 39.908]"
  anchor="bottom-center"
  :offset="[0, -28]"
>
  <div class="custom-marker">
    <span class="custom-marker__emoji">🍜</span>
    <span>Beijing Noodles</span>
  </div>
</AmapMarker>
```

Use `anchor` together with `offset` to align the slot content relative to the geographic point. For example `anchor="bottom-center"` with a negative Y offset keeps the base of the HTML card pinned to the coordinate.

## Live example

<ClientOnly>
  <MarkerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MarkerComponentDemo from '../examples/MarkerComponentDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
