# `useMassMarkers`

Render thousands of lightweight markers using the JSAPI `MassMarks` plugin. The composable defers plugin loading, keeps the data
set reactive, and exposes setters for styles and datasets.

```ts
import { useMassMarkers } from '@amap-vue/hooks'

const mass = useMassMarkers(() => map.value, () => ({
  data: points.value,
  style: [
    { url: '/images/cluster-blue.png', anchor: [6, 6], size: [12, 12] },
    { url: '/images/cluster-orange.png', anchor: [10, 10], size: [20, 20] },
  ],
}))

watch(points, value => mass.setData(value))
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `data` | `AMap.MassData[]` | Marker dataset (required). |
| `style` | `AMap.MassMarkersStyleOptions \| AMap.MassMarkersStyleOptions[]` | Single or multi-style configuration. |
| `options` | `Partial<AMap.MassMarkersOptions>` | Additional plugin options (opacity, zoom range, etc.). |

## Return value

| Key | Description |
| --- | --- |
| `mass` | `ShallowRef<AMap.MassMarks \| null>` referencing the mass markers instance. |
| `setData(data)` | Replace the dataset. |
| `setStyle(style)` | Update the style definition. |
| `destroy()` | Dispose of the plugin and release references. |

### Notes

- The hook automatically loads the `AMap.MassMarks` plugin; ensure your loader key is authorised for it.
- When the map reference becomes `null` the mass markers detach from the map and reattach once the map is back online.
- Use lightweight point data objects (no large payloads in `extData`) to keep updates cheap.

## Live example

<ClientOnly>
  <UseMassMarkersHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMassMarkersHookDemo from '../examples/hooks/UseMassMarkersHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
