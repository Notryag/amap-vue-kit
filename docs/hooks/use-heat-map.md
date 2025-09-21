# `useHeatMap`

Drive the heat map plugin from Composition API code. The hook defers instantiation until both the JSAPI and the map are ready,
then synchronises the dataset whenever the reactive options change.

```ts
import { useHeatMap } from '@amap-vue/hooks'

const heatMap = useHeatMap(() => map.value, () => ({
  data: points.value,
  radius: 32,
  gradient: gradients.sunset,
}))

watch(points, (next) => {
  heatMap.setDataSet({ data: next, max: 120 })
})
```

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.HeatMap \| null>` referencing the heat map instance. |
| `ready` | Register callbacks triggered when the plugin has been created. |
| `setOptions` | Update plugin options such as `radius`, `opacity`, or `gradient`. |
| `setDataSet` | Replace the full dataset (`{ data, max }`). The hook caches the latest values. |
| `addDataPoint` | Append a single point without rebuilding the dataset. |
| `show` / `hide` | Toggle visibility imperatively. |
| `destroy` | Dispose of the heat map and release references. |

### Notes

- The hook requests the `AMap.HeatMap` plugin automatically; no need to preload it via `loader.config`.
- The `data` option is watched deeply. Pushing to the reactive array triggers incremental updates without recreating the instanc
e.
- When the map reference becomes `null`, the heat map detaches itself and waits for a new map instance before reattaching.
