# `usePolygon`

通过 Vue 响应式状态管理单环或多环多边形。该 hook 会规范化传入路径，同步可见性，并在卸载时自动清理。

```ts
import { usePolygon } from '@amap-vue/hooks'
import { ref } from 'vue'

const polygonOptions = ref({
  path: [
    [116.38, 39.9],
    [116.41, 39.91],
    [116.4, 39.94],
  ],
  fillOpacity: 0.3,
})

const polygonApi = usePolygon(() => map.value, polygonOptions)

polygonApi.setExtData({ regionId: 'beijing-core' })
```

`<AmapPolygon>` 也基于同一套 API，因此从声明式模板迁移到组合式函数只需要很少改动。

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Polygon \| null>`，指向当前多边形实例。 |
| `setPath` | 接收单环路径（`LngLatLike[]`）或多环数组，并转换为 `AMap.LngLat` 对象。 |
| `setOptions` | 将额外配置更新转发给 `Polygon#setOptions`。 |
| `setExtData` | 为多边形绑定任意元数据。 |
| `show` / `hide` | 切换可见性但不释放覆盖物。 |
| `destroy` | 从地图上移除多边形并释放监听器。 |

### 说明

- `path` 选项可以是响应式数据，并可表达孔洞或多环结构；每段路径都会规范化为 JSAPI 坐标。
- 将 `visible` 设为 `false` 会隐藏多边形，直到重新切回 `true`。

## 完整示例

<ClientOnly>
  <UsePolygonHookDemo />
</ClientOnly>

<script setup lang="ts">
import UsePolygonHookDemo from '../examples/hooks/UsePolygonHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
