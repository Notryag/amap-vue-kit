# `<AmapLabelMarker>`

Attach high-performance text or icon markers to an `<AmapLabelsLayer>`. The component proxies `LabelMarker` options and expose
s events so you can respond to clicks and hovers just like standard markers.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `position` | `LngLatLike \| undefined` | Coordinates of the marker. Accepts `[lng, lat]` tuples or `AMap.LngLat`. |
| `text` | `AMap.LabelMarkerTextOptions \| undefined` | Rich text content rendered by the JSAPI. Supports offsets, styles, and multiple lines. |
| `icon` | `AMap.LabelMarkerIconOptions \| undefined` | Optional image sprite displayed beneath or alongside the text. |
| `zooms` | `[number, number] \| undefined` | Zoom range in which the marker remains visible. |
| `opacity` | `number \| undefined` | Alpha transparency for the marker. |
| `zIndex` | `number \| undefined` | Rendering order relative to other label markers. |
| `extData` | `any` | Arbitrary metadata stored on the marker instance. |
| `visible` | `boolean \| undefined` | Control visibility without destroying the marker. |
| `collision` | `boolean \| undefined` | Override the parent layer's collision behaviour for this marker. |
| `options` | `Partial<AMap.LabelMarkerOptions>` | Additional JSAPI options merged during creation. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.LabelMarker` | Emitted when the marker instance becomes available. |
| `click` | `any` | Click events forwarded from the JSAPI instance. |
| `mouseover` | `any` | Pointer enter events. |
| `mouseout` | `any` | Pointer leave events. |

## Usage

```vue
<AmapLabelsLayer :collision="true">
  <AmapLabelMarker
    v-for="item in data"
    :key="item.id"
    :position="item.position"
    :text="item.text"
    :icon="item.icon"
    @click="handleSelect(item)"
  />
</AmapLabelsLayer>
```

Place label markers inside a labels layer so they can share GPU resources. The component exposes the underlying instance via `r
eady` and through `template ref`/`expose` so you can call imperative methods when necessary.

<ClientOnly>
  <LabelsLayerDemo />
</ClientOnly>

<script setup lang="ts">
import LabelsLayerDemo from '../examples/LabelsLayerDemo.vue'
</script>

### TypeScript signature

```ts
export interface LabelMarkerProps {
  position?: LngLatLike
  text?: AMap.LabelMarkerTextOptions
  icon?: AMap.LabelMarkerIconOptions
  zooms?: [number, number]
  opacity?: number
  zIndex?: number
  extData?: any
  visible?: boolean
  collision?: boolean
  options?: Partial<AMap.LabelMarkerOptions>
}
```

### Common pitfalls

- Label markers must live inside `<AmapLabelsLayer>`; otherwise the component warns during development.
- When providing `text.offset`, you can use `[x, y]` tuples. The component converts them to `AMap.Pixel` internally.
- Collision behaviour depends on the parent layer. Set both the layer's `collision` prop and the marker's `collision` override
when you need granular control.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
