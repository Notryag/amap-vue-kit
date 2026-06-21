# `useMarkerClusterer`

以命令式方式管理点聚合。

```ts
const cluster = useMarkerClusterer(() => map.value, () => ({
  points: Array.from({ length: 100 }, (_, i) => ({
    position: [116.3 + Math.random() * 0.6, 39.8 + Math.random() * 0.6],
    extData: { id: i },
  })),
  gridSize: 80,
}))

cluster.on('click', (event) => {
  console.log('点击聚合点', event)
})
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `cluster` | `ShallowRef<AMap.MarkerCluster \| null>`，指向聚合实例。 |
| `set点位`, `setMarkers`, `setOptions` | 命令式 setter。 |
| `show` / `hide` | 切换可见性。 |
| `on` / `off` | 订阅聚合事件。 |
| `destroy` | 清空标记并销毁聚合实例。 |

## 在线示例

<ClientOnly>
  <UseMarkerClustererHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMarkerClustererHookDemo from '../examples/hooks/UseMarkerClustererHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
