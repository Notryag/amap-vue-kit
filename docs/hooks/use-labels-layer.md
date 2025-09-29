# `useLabelsLayer`

Imperatively manage the JSAPI `LabelsLayer` while keeping Vue reactivity. The composable lazy-loads the `AMap.LabelsLayer` plugi
n, attaches the layer to the provided map, and updates visibility/opacities when the reactive options change.

```ts
import { useLabelMarker, useLabelsLayer } from '@amap-vue/hooks'
import { ref } from 'vue'

const markers = ref(points)
const labelsLayer = useLabelsLayer(() => map.value, () => ({
  visible: true,
  zooms: [10, 20],
  collision: true,
}))

markers.value.forEach((item) => {
  useLabelMarker(labelsLayer, { position: item.position, text: item.text })
})
```

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.LabelsLayer \| null>` pointing to the layer instance. |
| `ready` | Register callbacks executed once the layer is available. |
| `setOptions` | Call through to `layer.setOptions()` for incremental updates. |
| `setOpacity` / `setZIndex` | Adjust style attributes without recreating the layer. |
| `show` / `hide` | Toggle visibility. Also triggered when the reactive `visible` option changes. |
| `add` / `remove` | Attach or detach one or many `LabelMarker` instances. |
| `clear` | Remove every registered marker from the layer. |
| `destroy` | Dispose of the layer and detach it from the map. |

### Notes

- The composable watches the reactive options deeply, so `collision`, `visible`, and `opacity` update automatically.
- When the map reference becomes `null`, the layer detaches itself and reattaches once a map is available again.
- Use the higher-level `<AmapLabelsLayer>` component when authoring templates; `useLabelsLayer` is ideal for custom renderers or
server-driven setups.

## Live example

<ClientOnly>
  <UseLabelsLayerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseLabelsLayerHookDemo from '../examples/hooks/UseLabelsLayerHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
