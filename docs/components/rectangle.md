# `<AmapRectangle>`

Draw axis-aligned rectangles by wrapping the JSAPI `AMap.Rectangle` overlay in a declarative component. The rectangle reacts to prop changes so you can animate bounds, styles, or visibility from Vue state.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `bounds` | `BoundsLike` | – | Southwest and northeast coordinates that define the rectangle. |
| `options` | `Partial<AMap.RectangleOptions>` | `{}` | Additional JSAPI options such as stroke/fill styles or `draggable`. |
| `visible` | `boolean` | `true` | Toggles the rectangle without recreating the instance. |
| `extData` | `any` | – | Arbitrary metadata forwarded to the overlay. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Rectangle` | Fired once the rectangle is created and attached to the map. |
| `click` | `any` | Pointer click on the rectangle surface. |
| `mouseover` | `any` | Pointer enters the rectangle. |
| `mouseout` | `any` | Pointer leaves the rectangle. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell">
  <AmapRectangle
    :bounds="[[116.35, 39.88], [116.44, 39.94]]"
    :options="{ strokeColor: '#20c997', strokeWeight: 2, fillColor: 'rgba(32, 201, 151, 0.35)' }"
  />
</AmapMap>
```

## Live example

<ClientOnly>
  <RectangleComponentDemo />
</ClientOnly>

<script setup lang="ts">
import RectangleComponentDemo from '../examples/RectangleComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface RectangleProps {
  bounds: BoundsLike
  options?: Partial<AMap.RectangleOptions>
  visible?: boolean
  extData?: any
}
```

### Common pitfalls

- Ensure the component is nested inside `<AmapMap>` so the injected map instance is available.
- When computing bounds reactively, return a brand-new array to trigger updates (avoid mutating the same reference).
- Use `extData` (or `setExtData`) to attach identifiers that editor hooks can resolve later.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
