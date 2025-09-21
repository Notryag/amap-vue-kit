# Heatmap

Heatmaps provide an at-a-glance view of density. Load the `Heatmap` plugin via the shared loader.

```ts
ready((map) => {
  map.plugin(['AMap.Heatmap'], () => {
    const heatmap = new AMap.Heatmap(map, {
      radius: 25,
      opacity: [0, 0.8]
    })
    heatmap.setDataSet({
      data: points.map(point => ({
        lng: point[0],
        lat: point[1],
        count: point[2]
      })),
      max: 10
    })
  })
})
```

Wrap the heatmap instance in a composable to react to prop changes if you plan to update the dataset frequently.
