# `useEllipse`

Manage an `AMap.Ellipse` overlay reactively. The hook handles plugin loading, converts centers to native `AMap.LngLat`, and exposes helpers for radii, styling, and visibility.

```ts
import { useEllipse } from '@amap-vue/hooks'

const ellipse = useEllipse(() => map.value, () => ({
  center: [116.406, 39.912],
  radius: [900, 500],
  strokeColor: '#fd7e14',
  fillColor: 'rgba(253, 126, 20, 0.3)',
}))

ellipse.setRadius([1200, 600])
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `center` | `LngLatLike` | Ellipse center point. |
| `radius` | `[number, number]` | Major/minor axes in meters. |
| `visible` | `boolean` | Toggle visibility without destroying the overlay. |
| `…options` | `Partial<AMap.EllipseOptions>` | Additional JSAPI options forwarded to `setOptions`. |

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Ellipse \| null>` referencing the ellipse instance. |
| `setCenter(center)` | Update the center. Accepts any `LngLatLike` value. |
| `setRadius(radius)` | Update both axes in meters. |
| `setOptions(options)` | Forward additional options. |
| `setExtData(extData)` | Attach metadata for later lookup. |
| `show()` / `hide()` | Explicitly toggle visibility. |
| `destroy()` | Dispose of the ellipse and clean up listeners. |
| `on(event, handler)` / `off(event, handler)` | Subscribe to JSAPI events. |

## Live example

<ClientOnly>
  <UseEllipseHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseEllipseHookDemo from '../examples/hooks/UseEllipseHookDemo.vue'
</script>

### Tips

- Radii smaller than ~20 meters are hard to manipulate at low zoom levels—zoom in or switch to pixel overlays in those cases.
- Combine with `useEditorEllipse` to let end-users drag handles while keeping Vue state in sync.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
