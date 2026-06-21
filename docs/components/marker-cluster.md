# `<AmapMarkerCluster>`

声明式配置 MarkerCluster 插件，用于聚合密集点数据。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `points` | `MarkerClusterPoint[]` | 用于生成标记的普通点数据数组。 |
| `markers` | `AMap.Marker[]` | 也可以直接提供已创建的标记实例。 |
| `visible` | `boolean` | 控制聚合可见性。 |
| `options` | `Partial<AMap.MarkerClusterOptions>` | 额外 JSAPI 选项，例如 `gridSize` 或自定义渲染器。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.MarkerCluster` | 聚合实例创建完成后触发。 |
| `click` | `any` | 聚合点点击事件。 |

## 最小示例

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="11" style="height: 320px">
  <AmapMarkerCluster :points="points" :options="{ gridSize: 80 }" />
</AmapMap>
```

## 完整示例

<ClientOnly>
  <MarkerClusterComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MarkerClusterComponentDemo from '../examples/MarkerClusterComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本组件的 props、emits 与插槽类型由 `@amap-vue/core` 的 `.d.ts` 文件导出；上方属性和事件表与发布类型保持同步。

## 常见错误

- 地图空白时，先确认容器有明确高度，并已配置有效的高德 JSAPI Key。
- 需要插件的组件应通过组件内部自动加载或在 `<AmapMap :plugins>` 中提前声明，避免实例创建时插件缺失。
- 在 SSR 环境中不要在 setup 顶层直接访问 `window` 或 `AMap`；等待 `ready` 事件后再读取实例。
