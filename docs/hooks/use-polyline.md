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

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

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

## 完整示例

<ClientOnly>
  <UsePolylineHookDemo />
</ClientOnly>

<script setup lang="ts">
import UsePolylineHookDemo from '../examples/hooks/UsePolylineHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
