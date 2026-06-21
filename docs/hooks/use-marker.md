# `useMarker`

以命令式方式创建和管理 JSAPI 标记。

```ts
const markerApi = useMarker(() => map.value, () => ({
  position: [116.397, 39.908],
  label: 'AMap HQ',
  draggable: true
}))

markerApi.on('click', (event) => {
  console.log('点击标记', event)
})
```

`useMarker` mirrors the props exposed by `<AmapMarker>` so you can switch between declarative and imperative code paths as needed.

## 返回值

| 字段 | 说明 |
| --- | --- |
| `marker` | `ShallowRef<AMap.Marker \| null>`，指向标记实例。 |
| `setPosition`, `setIcon`, `setLabel`, `setExtData`, `setDraggable`, `setZIndex`, `setOffset`, `setContent`, `setAnchor`, `setIsCustom` | 对应 JSAPI 方法的命令式 setter。 |
| `show` / `hide` | 切换标记可见性。 |
| `on` / `off` | 订阅标记事件。 |
| `destroy` | 从地图上移除标记。 |

当地图引用变为 `null`（例如组件卸载）时，标记会自动移除并销毁。

## 在线示例

<ClientOnly>
  <UseMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMarkerHookDemo from '../examples/hooks/UseMarkerHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
