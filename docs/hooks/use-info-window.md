# `useInfoWindow`

Imperatively manage JSAPI info windows with Vue reactivity. The composable delays instantiation until both the map and loader are ready, keeps the open state in sync, and cleans up automatically on unmount.

```ts
import { useInfoWindow } from '@amap-vue/hooks'
import { ref } from 'vue'

const options = ref({
  position: [116.397, 39.908],
  content: 'Hello AMap',
  open: true,
  offset: [12, 16],
})

const infoWindowApi = useInfoWindow(() => map.value, options)

infoWindowApi.on('open', () => {
  console.log('info window opened')
})
```

`useInfoWindow` powers `<AmapInfoWindow>` behind the scenes, so you can graduate from declarative slots to fully custom content strings or DOM nodes whenever necessary.

## Return value

| Key | Description |
| --- | --- |
| `infoWindow` | `ShallowRef<AMap.InfoWindow \| null>` referencing the underlying instance. |
| `open` / `close` | Programmatically toggle visibility while keeping the reactive `open` flag in sync. |
| `setPosition`, `setOffset`, `setAnchor`, `setIsCustom`, `setContent` | Typed helpers that proxy to the matching JSAPI methods and accept Vue-friendly inputs (`LngLatLike`, `PixelLike`). |
| `setOptions` | Batch update any other option via `InfoWindow#setOptions`. |
| `on` / `off` | Subscribe to and remove JSAPI event listeners. |
| `destroy` | Dispose the info window and clear internal state. |

### Notes

- Passing reactive `open`, `position`, or `content` options keeps the JSAPI instance in sync without manual watchers.
- When the provided map reference becomes `null`, the info window closes itself and reattaches once a map is available again.

## Live example

<ClientOnly>
  <UseInfoWindowHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseInfoWindowHookDemo from '../examples/hooks/UseInfoWindowHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
