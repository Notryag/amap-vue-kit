# `useElasticMarker`

Wraps the ElasticMarker plugin with a composable interface.

```ts
const marker = useElasticMarker(() => map.value, () => ({
  position: [116.397, 39.908],
  styles: {
    0: { icon: { img: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png', size: [26, 40], anchor: [13, 40] } },
    1: { icon: { img: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png', size: [34, 52], anchor: [17, 52] } },
  },
  zoomStyleMapping: { 10: 0, 13: 1 },
}))

marker.on('click', () => console.log('Elastic marker clicked'))
```

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.ElasticMarker \| null>` referencing the marker instance. |
| `setPosition`, `setStyles`, `setZoomStyleMapping`, `setExtData`, `setOptions` | Imperative setters mirroring JSAPI methods. |
| `show` / `hide` | Toggle marker visibility. |
| `on` / `off` | Subscribe to ElasticMarker events. |
| `destroy` | Remove the marker from the map. |

## Live example

<ClientOnly>
  <UseElasticMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseElasticMarkerHookDemo from '../examples/hooks/UseElasticMarkerHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
