# `useCircleMarker`

以命令式方式管理 JSAPI 圆点标记，适合渲染大量简单点位。

```ts
const circle = useCircleMarker(() => map.value, () => ({
  center: [116.397, 39.908],
  radius: 10,
  options: {
    strokeColor: '#1677ff',
    fillColor: 'rgba(22, 119, 255, 0.45)',
  },
}))

circle.on('click', () => console.log('点击圆点标记'))
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.CircleMarker \| null>`，指向标记实例。 |
| `setCenter`, `setRadius`, `setOptions`, `setExtData` | 对应 JSAPI 方法的命令式 setter。 |
| `show` / `hide` | 切换可见性。 |
| `on` / `off` | 订阅标记事件。 |
| `destroy` | 从地图上移除标记。 |

## 在线示例

<ClientOnly>
  <UseCircleMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseCircleMarkerHookDemo from '../examples/hooks/UseCircleMarkerHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
