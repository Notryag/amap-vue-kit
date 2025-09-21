# `usePolyline`

Create and update JSAPI polylines declaratively from Vue state. Paths are normalized from `LngLatLike[]` and the instance reattaches when the map reference changes.

```ts
import { usePolyline } from '@amap-vue/hooks'
import { ref } from 'vue'

const path = ref([
  [116.38, 39.9],
  [116.41, 39.92],
])

const polylineApi = usePolyline(() => map.value, () => ({
  path: path.value,
  strokeColor: '#2979ff',
  strokeWeight: 4,
}))

polylineApi.on('click', () => {
  console.log('polyline clicked')
})
```

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Polyline \| null>` pointing to the active polyline instance. |
| `setPath` | Replace the polyline path with an array of `LngLatLike` coordinates. Values are converted to `AMap.LngLat`. |
| `setOptions` | Call `Polyline#setOptions` for bulk option updates (style, zIndex, etc.). |
| `setExtData` | Store arbitrary metadata on the overlay. |
| `show` / `hide` | Toggle the visibility flag without destroying the instance. |
| `destroy` | Remove the polyline from the map and release listeners. |

### Notes

- The composable watches the reactive options and updates the JSAPI object incrementally, so you can mutate `path.value` or `strokeColor` without manual glue code.
- Setting `visible: false` in the options will hide the overlay until the flag becomes truthy again.
