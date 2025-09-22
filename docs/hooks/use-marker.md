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

`useMarker` mirrors the props exposed by `<AmapMarker>` so you can switch between declarative and imperative code paths as needed.

## Return value

| Key | Description |
| --- | --- |
| `marker` | `ShallowRef<AMap.Marker \| null>` referencing the marker instance. |
| `setPosition`, `setIcon`, `setLabel`, `setExtData`, `setDraggable`, `setZIndex`, `setOffset`, `setContent`, `setAnchor`, `setIsCustom` | Imperative setters mirroring JSAPI methods. |
| `show` / `hide` | Toggle marker visibility. |
| `on` / `off` | Subscribe to marker events. |
| `destroy` | Remove the marker from the map. |

When the map reference becomes `null` (e.g. during unmount) the marker is automatically removed and destroyed.

## Live example

<ClientOnly>
  <UseMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMarkerHookDemo from '../examples/hooks/UseMarkerHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
