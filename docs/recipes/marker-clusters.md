# 点聚合

AMap 暴露了 `AMap.MarkerClusterer`，用于对密集标记集合进行聚合。

```ts
ready((map) => {
  map.plugin(['AMap.MarkerClusterer'], () => {
    const cluster = new AMap.MarkerClusterer(map, markers, {
      gridSize: 80,
      maxZoom: 16
    })
    cluster.on('click', (event) => {
      console.log('点击聚合点', event)
    })
  })
})
```

使用 Vue ref 保存聚合实例，并在响应式数据变化时调用 `setMarkers` 或 `addMarkers`。

## 在线示例

<ClientOnly>
  <MarkerClusterRecipe />
</ClientOnly>

<script setup lang="ts">
import MarkerClusterRecipe from '../examples/recipes/MarkerClusterRecipe.vue'
</script>
