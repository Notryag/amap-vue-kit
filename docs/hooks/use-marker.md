# `useMarker`

Create and manage JSAPI markers imperatively.

```ts
const markerApi = useMarker(() => map.value, () => ({
  position: [116.397, 39.908],
  label: 'AMap HQ',
  draggable: true
}))

markerApi.on('click', (event) => {
  console.log('marker clicked', event)
})
```

## Return value

| Key | Description |
| --- | --- |
| `marker` | `ShallowRef<AMap.Marker \| null>` referencing the marker instance. |
| `setPosition`, `setIcon`, `setLabel`, `setExtData`, `setDraggable`, `setZIndex`, `setOffset` | Imperative setters mirroring JSAPI methods. |
| `show` / `hide` | Toggle marker visibility. |
| `on` / `off` | Subscribe to marker events. |
| `destroy` | Remove the marker from the map. |

When the map reference becomes `null` (e.g. during unmount) the marker is automatically removed and destroyed.
