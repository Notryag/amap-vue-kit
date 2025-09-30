# `useLabelMarker`

Create high-performance label markers in Composition API code. The composable shares the same lifecycle guarantees as the compo
nent: markers are lazily created once the layer is ready, listeners are rebound after option changes, and everything is cleaned
up on unmount.

```ts
import { useLabelMarker, useLabelsLayer } from '@amap-vue/hooks'

const layer = useLabelsLayer(() => map.value, () => ({ collision: true }))

const marker = useLabelMarker(layer, () => ({
  position: [116.397, 39.908],
  text: { content: 'HQ', direction: 'top' },
}))

marker.on('click', () => console.log('label clicked'))
```

## Return value

| Key | Description |
| --- | --- |
| `marker` | `ShallowRef<AMap.LabelMarker \| null>` referencing the marker instance. |
| `setPosition` | Update the marker position with `LngLatLike` data. |
| `setText` | Apply text configuration including offsets and styles. |
| `setIcon` | Change the icon sprite. |
| `setZooms` | Restrict the zoom range. |
| `setOpacity` / `setZIndex` | Adjust visual properties without recreating the marker. |
| `setExtData` | Attach arbitrary metadata. |
| `show` / `hide` | Toggle visibility imperatively. |
| `on` / `off` | Subscribe to and unsubscribe from marker events. |
| `destroy` | Remove the marker from its parent layer and tear down listeners. |

### Notes

- The composable automatically reattaches the marker if the labels layer instance changes.
- `text.offset` accepts tuples such as `[0, -12]`; they are converted to `AMap.Pixel` behind the scenes when the JSAPI is available.
- When the supplied layer reference is `null`, the marker detaches itself and waits until a layer becomes available again.
- You can pass a raw `LabelsLayer` instance, the object returned by `useLabelsLayer`, or the `<AmapLabelsLayer>` injection context—the hook queues and attaches markers appropriately in each scenario.

## Live example

<ClientOnly>
  <UseLabelMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseLabelMarkerHookDemo from '../examples/hooks/UseLabelMarkerHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
