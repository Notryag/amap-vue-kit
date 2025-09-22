# `useOverlay`

`useOverlay` is a low-level helper for building overlay composables. It is used internally by the polygon, polyline, and circle components but can be used to wrap any overlay that exposes `setMap`.

```ts
const { overlay, destroy } = useOverlay(
  () => map.value,
  () => ({ path, strokeColor: '#4b8bff' }),
  ({ AMap, map, options }) => {
    const polyline = new AMap.Polyline({
      ...options,
      map,
      path: options.path
    })
    return polyline
  },
  (polyline, options) => {
    polyline.setOptions(options)
  }
)
```

`useOverlay` handles deferred instantiation until both the map and JSAPI are ready, automatically reattaches listeners, and cleans up on unmount.

## Parameters

1. `mapRef` – a getter that returns the current map instance.
2. `options` – reactive options passed to both the factory and updater.
3. `factory` – receives `{ AMap, map, options }` and must return an overlay with `setMap`.
4. `updater` (optional) – called whenever the reactive options change.
5. `loadOptions` (optional) – additional loader config (plugins, timeouts, etc.).

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<TOverlay | null>` referencing the created overlay. |
| `on` / `off` | Register JSAPI event listeners that persist across re-creations. |
| `destroy` | Remove the overlay from the map and release references. |

## Live example

<ClientOnly>
  <UseOverlayHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseOverlayHookDemo from '../examples/hooks/UseOverlayHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
