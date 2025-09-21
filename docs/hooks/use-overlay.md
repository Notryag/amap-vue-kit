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
