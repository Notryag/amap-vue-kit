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
