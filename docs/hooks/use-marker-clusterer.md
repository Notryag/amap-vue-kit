# `useMarkerClusterer`

Imperatively manage point clustering.

```ts
const cluster = useMarkerClusterer(() => map.value, () => ({
  points: Array.from({ length: 100 }, (_, i) => ({
    position: [116.3 + Math.random() * 0.6, 39.8 + Math.random() * 0.6],
    extData: { id: i },
  })),
  gridSize: 80,
}))

cluster.on('click', (event) => {
  console.log('Cluster clicked', event)
})
```

## Return value

| Key | Description |
| --- | --- |
| `cluster` | `ShallowRef<AMap.MarkerCluster \| null>` referencing the clusterer instance. |
| `set点位`, `setMarkers`, `setOptions` | Imperative setters. |
| `show` / `hide` | Toggle visibility. |
| `on` / `off` | Subscribe to cluster events. |
| `destroy` | Clear markers and dispose the cluster. |

## 在线示例

<ClientOnly>
  <UseMarkerClustererHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMarkerClustererHookDemo from '../examples/hooks/UseMarkerClustererHookDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
