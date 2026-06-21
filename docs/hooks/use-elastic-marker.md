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

marker.on('click', () => console.log('点击灵活点标记'))
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.ElasticMarker \| null>`，指向标记实例。 |
| `setPosition`, `setStyles`, `setZoomStyleMapping`, `setExtData`, `setOptions` | 对应 JSAPI 方法的命令式 setter。 |
| `show` / `hide` | 切换标记可见性。 |
| `on` / `off` | 订阅 ElasticMarker 事件。 |
| `destroy` | 从地图上移除标记。 |

## 在线示例

<ClientOnly>
  <UseElasticMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseElasticMarkerHookDemo from '../examples/hooks/UseElasticMarkerHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
