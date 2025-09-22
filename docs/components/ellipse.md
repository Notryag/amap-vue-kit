# `<AmapEllipse>`

`<AmapEllipse>` renders JSAPI ellipses with reactive control over center, radii, styling, and visibility. Use it to highlight coverage areas or uncertainty regions without imperatively managing the overlay.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `center` | `LngLatLike` | – | Geographical center of the ellipse. |
| `radius` | `[number, number]` | – | Horizontal and vertical radii in meters. |
| `options` | `Partial<AMap.EllipseOptions>` | `{}` | Additional JSAPI options such as stroke/fill styles or cursor. |
| `visible` | `boolean` | `true` | Toggle display without destroying the overlay. |
| `extData` | `any` | – | Metadata stored on the ellipse instance. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Ellipse` | Fired when the ellipse instance is created. |
| `click` | `any` | Pointer click on the ellipse. |
| `mouseover` | `any` | Pointer enters the ellipse. |
| `mouseout` | `any` | Pointer leaves the ellipse. |

## Usage

```vue
<AmapMap :center="[116.406, 39.912]" :zoom="13" class="map-shell">
  <AmapEllipse
    :center="[116.406, 39.912]"
    :radius="[900, 500]"
    :options="{ strokeColor: '#fd7e14', strokeWeight: 2, fillColor: 'rgba(253, 126, 20, 0.3)' }"
  />
</AmapMap>
```

## Live example

<ClientOnly>
  <EllipseComponentDemo />
</ClientOnly>

<script setup lang="ts">
import EllipseComponentDemo from '../examples/EllipseComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface EllipseProps {
  center: LngLatLike
  radius: [number, number]
  options?: Partial<AMap.EllipseOptions>
  visible?: boolean
  extData?: any
}
```

### Common pitfalls

- Radius values are distances in meters; convert from degrees if you start with geographic deltas.
- Provide stable array references for `radius` and `center` updates to ensure Vue reactivity propagates.
- Use `extData` to store identifiers that editor hooks or mouse tools can later resolve.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
