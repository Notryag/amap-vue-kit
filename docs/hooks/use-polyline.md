# `usePolyline`

用 Vue 状态声明式创建并更新 JSAPI 折线。路径会从 `LngLatLike[]` 规范化，地图引用变化时实例会自动重新挂载。

```ts
import { usePolyline } from '@amap-vue/hooks'
import { ref } from 'vue'

const path = ref([
  [116.38, 39.9],
  [116.41, 39.92],
])

const polylineApi = usePolyline(() => map.value, () => ({
  path: path.value,
  strokeColor: '#2979ff',
  strokeWeight: 4,
}))

polylineApi.on('click', () => {
  console.log('点击折线')
})
```

`usePolyline` 暴露与 `<AmapPolyline>` 一致的选项，便于复用样式预设，或从组件写法平滑迁移到组合式函数。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Polyline \| null>`，指向当前折线实例。 |
| `setPath` | 使用 `LngLatLike` 坐标数组替换折线路径，并自动转换为 `AMap.LngLat`。 |
| `setOptions` | 调用 `Polyline#setOptions` 批量更新配置，例如样式、zIndex 等。 |
| `setExtData` | 在覆盖物上存储任意元数据。 |
| `show` / `hide` | 切换可见性但不销毁实例。 |
| `destroy` | 从地图上移除折线并释放监听器。 |

### 说明

- 该组合式函数会监听响应式配置并增量更新 JSAPI 对象，因此可以直接修改 `path.value` 或描边颜色，无需手写同步代码。
- 在选项中设置 `visible: false` 会隐藏覆盖物，直到该值重新变为真值。

## 在线示例

<ClientOnly>
  <UsePolylineHookDemo />
</ClientOnly>

<script setup lang="ts">
import UsePolylineHookDemo from '../examples/hooks/UsePolylineHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
