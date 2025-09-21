# `useMap`

`useMap` is a composition API wrapper around the map lifecycle. It lazily loads the JSAPI, instantiates the map, and exposes imperative helpers.

```ts
const { map, ready, setCenter, setZoom, on, off, destroy } = useMap(() => ({
  container: containerRef,
  center: [116.397, 39.908],
  zoom: 11,
  plugins: ['AMap.ToolBar']
}))
```

## Return value

| Key | Type | Description |
| --- | --- | --- |
| `map` | `ShallowRef<AMap.Map \| null>` | Reactive reference to the map instance. |
| `ready` | `(callback: (map: AMap.Map) => void) => void` | Registers a callback for when the map is available. |
| `setCenter` | `(center?: LngLatLike) => void` | Updates the center. |
| `setZoom` | `(zoom?: number) => void` | Updates the zoom level. |
| `setPitch` | `(pitch?: number) => void` | Updates the pitch. |
| `setRotation` | `(rotation?: number) => void` | Updates the rotation. |
| `setMapStyle` | `(style?: string) => void` | Updates the map style. |
| `setTheme` | `(theme?: string) => void` | Applies a registered theme. |
| `setViewMode` | `(mode?: AMap.MapViewMode) => void` | Switch between 2D and 3D rendering. |
| `on` / `off` | `(event: string, handler: (event: any) => void)` | Subscribe to JSAPI events. |
| `destroy` | `() => void` | Dispose the map and detach listeners. |

Because the loader is shared, calling `useMap` in multiple components will reuse the same script injection and plugin configuration.
