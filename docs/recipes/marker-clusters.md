# Marker Clusters

AMap exposes `AMap.MarkerClusterer` to cluster dense marker sets.

```ts
ready((map) => {
  map.plugin(['AMap.MarkerClusterer'], () => {
    const cluster = new AMap.MarkerClusterer(map, markers, {
      gridSize: 80,
      maxZoom: 16
    })
    cluster.on('click', (event) => {
      console.log('Cluster clicked', event)
    })
  })
})
```

Use Vue refs to store the cluster instance and call `setMarkers` or `addMarkers` when your reactive data changes.

## Live example

<ClientOnly>
  <MarkerClusterRecipe />
</ClientOnly>

<script setup lang="ts">
import MarkerClusterRecipe from '../examples/recipes/MarkerClusterRecipe.vue'
</script>
