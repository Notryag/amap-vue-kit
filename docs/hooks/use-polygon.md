# `usePolygon`

Manage polygons (single or multi-ring) through Vue reactivity. The hook normalizes the supplied path, keeps visibility in sync, and cleans up automatically.

```ts
import { ref } from 'vue'
import { usePolygon } from '@amap-vue/hooks'

const polygonOptions = ref({
  path: [
    [116.38, 39.9],
    [116.41, 39.91],
    [116.4, 39.94],
  ],
  fillOpacity: 0.3,
})

const polygonApi = usePolygon(() => map.value, polygonOptions)

polygonApi.setExtData({ regionId: 'beijing-core' })
```

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Polygon \| null>` referencing the active polygon instance. |
| `setPath` | Accepts either a simple ring (`LngLatLike[]`) or an array of rings and converts them into `AMap.LngLat` objects. |
| `setOptions` | Forward additional option updates to `Polygon#setOptions`. |
| `setExtData` | Attach arbitrary metadata to the polygon. |
| `show` / `hide` | Toggle visibility without disposing the overlay. |
| `destroy` | Remove the polygon from the map and free listeners. |

### Notes

- The `path` option can be reactive and represent holes or multiple rings. Each segment is normalized to JSAPI coordinates.
- Setting `visible` to `false` hides the polygon until the flag is flipped back to `true`.
