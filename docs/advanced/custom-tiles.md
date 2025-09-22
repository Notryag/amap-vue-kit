# Custom Tiles

AMap supports custom tile layers for offline or domain-specific datasets. Use the map instance obtained from `ready` to add tile layers manually.

```ts
ready((map) => {
  const layer = new AMap.TileLayer({
    tileUrl: 'https://your-tile-server/{z}/{x}/{y}.png',
    zIndex: 10
  })
  layer.setMap(map)
})
```

Combine tile layers with Vue reactivity by storing references in `shallowRef` instances and updating options inside watchers.

## Live example

<ClientOnly>
  <CustomTilesDemo />
</ClientOnly>

<script setup lang="ts">
import CustomTilesDemo from '../examples/advanced/CustomTilesDemo.vue'
</script>

### Tips

- Keep custom tiles on their own layer so you can fade between them and native AMap imagery.
- When pointing to third-party servers, ensure CORS headers allow the JSAPI to fetch PNG/JPG resources.
- Use `useTileLayer` with a computed `tileUrl` when switching providers without recreating the map.
