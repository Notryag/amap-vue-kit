# `<AmapMassMarks>`

Render tens of thousands of lightweight markers using the JSAPI `MassMarks` plugin. The component keeps the instance in sync with Vue state and exposes helpers to update datasets without re-creating the overlay.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `{ lnglat: [number, number], style?: number }[]` | `[]` | Array of plain items with `lnglat` coordinates and optional style index. |
| `style` | `AMap.MassMarkersStyleOptions \| AMap.MassMarkersStyleOptions[] \| undefined` | – | Style definition(s) passed to the JSAPI instance. |
| `options` | `Partial<AMap.MassMarkersOptions> \| undefined` | – | Additional JSAPI options such as `zooms` or `opacity`. |
| `visible` | `boolean` | `true` | Toggle marker visibility without destroying the instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions>> \| undefined` | – | Loader configuration forwarded to `loader.load`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.MassMarks` | Emitted once when the mass markers instance is created. |
| `click` | `any` | Fired when a marker is clicked. |
| `mouseover` | `any` | Fired when a marker is hovered. |
| `mouseout` | `any` | Fired when the cursor leaves a marker. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="11" class="map-shell">
  <AmapMassMarks :data="points" :style="style" :options="{ zooms: [3, 19] }" />
</AmapMap>
```

The component automatically loads `AMap.MassMarks`, watches the `data` array for deep changes, and re-applies styles or options when their reactive sources update.

<ClientOnly>
  <MassMarksComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MassMarksComponentDemo from '../examples/MassMarksComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface MassMarksProps {
  data?: Array<{ lnglat: [number, number], style?: number }>
  style?: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]
  options?: Partial<AMap.MassMarkersOptions>
  visible?: boolean
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- Provide a limited set of styles and reference them using the `style` index in each item to minimise GC pressure.
- Prefer `ref`/`reactive` collections instead of rebuilding the array on every tick when streaming new data.
- When mixing `MassMarks` with other overlays, adjust `options.zIndex` to ensure the desired stacking order.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
