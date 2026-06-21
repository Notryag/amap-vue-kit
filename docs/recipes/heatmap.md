# 热力图

热力图可以快速呈现密度分布。请通过共享 loader 加载 `Heatmap` 插件。

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

如果需要频繁更新数据集，建议把热力图实例封装到 composable 中，以便响应 props 变化。

## 在线示例

<ClientOnly>
  <HeatmapRecipe />
</ClientOnly>

<script setup lang="ts">
import HeatmapRecipe from '../examples/recipes/HeatmapRecipe.vue'
</script>
