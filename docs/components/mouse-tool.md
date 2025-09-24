# `<AmapMouseTool>`

Create interactive drawing experiences with the JSAPI `MouseTool`. The component coordinates tool lifecycle with the surrounding `<AmapMap>` and exposes a simple `mode` prop plus renderless slot utilities.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'none' \| 'circle' \| 'rectangle' \| 'polygon' \| 'polyline' \| 'bezierCurve' \| 'ellipse'` | `'none'` | Current drawing mode. When set to `'none'` the tool closes. |
| `autoClose` | `boolean` | `true` | Close the tool and emit `update:mode="'none'"` after each draw. |
| `drawOptions` | `Partial<AMap.CircleOptions> & ...` | `{}` | Optional per-shape options keyed by mode (`circle`, `polygon`, etc.). |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions>> \| undefined` | – | Loader config forwarded to `loader.load`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.MouseTool` | Emitted once when the tool instance is created. |
| `draw` | `any` | Fired after an overlay is drawn. The payload contains the newly created overlay (`event.obj`). |
| `update:mode` | `DrawMode` | Emitted whenever the component requests a mode change (used for `v-model:mode`). |

## Usage

```vue
<AmapMap :center="[116.397, 39.909]" :zoom="13">
  <AmapMouseTool v-model:mode="mode" @draw="handleDraw" />
</AmapMap>
```

The component provides a default slot with helper functions (`drawCircle`, `activate`, `close`) if you prefer to render custom controls inside the map.

<ClientOnly>
  <MouseToolComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MouseToolComponentDemo from '../examples/MouseToolComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface MouseToolProps {
  mode?: DrawMode
  autoClose?: boolean
  drawOptions?: {
    circle?: Partial<AMap.CircleOptions>
    rectangle?: Partial<AMap.RectangleOptions>
    polygon?: Partial<AMap.PolygonOptions>
    polyline?: Partial<AMap.PolylineOptions>
    bezierCurve?: Partial<AMap.BezierCurveOptions>
    ellipse?: Partial<AMap.EllipseOptions>
  }
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- When driving the component via `v-model:mode`, remember to reset the mode back to `'none'` once the desired overlay is drawn.
- Combine `autoClose=false` with the exposed `close()` method if you need to draw multiple shapes of the same type in a row.
- The `draw` event exposes the raw overlay via `event.obj`; store references if you plan to edit or remove them later.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
