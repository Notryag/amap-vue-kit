# `<AmapPolygon>`

渲染可带洞的填充多边形，支持单环和多环路径。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `LngLatLike[] \| LngLatLike[][]` | 多边形坐标。 |
| `options` | `Partial<AMap.PolygonOptions>` | 额外 JSAPI 配置，例如描边颜色、填充透明度等。 |
| `visible` | `boolean` | 切换可见性。 |
| `extData` | `any` | 任意元数据。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Polygon` | 创建完成后触发。 |
| `click` | `any` | 点击事件。 |
| `mouseover` | `any` | 指针移入事件。 |
| `mouseout` | `any` | 指针移出事件。 |

## 最小示例

```vue
<AmapPolygon
  :path="[
    [116.39, 39.90],
    [116.42, 39.90],
    [116.42, 39.92],
    [116.39, 39.92]
  ]"
  :options="{ fillColor: 'rgba(75,139,255,0.25)', strokeColor: '#4b8bff' }"
/>
```

## 完整示例

<ClientOnly>
  <PolygonComponentDemo />
</ClientOnly>

<script setup lang="ts">
import PolygonComponentDemo from '../examples/PolygonComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本组件的 props、emits 与插槽类型由 `@amap-vue/core` 的 `.d.ts` 文件导出；上方属性和事件表与发布类型保持同步。

## 常见错误

- 地图空白时，先确认容器有明确高度，并已配置有效的高德 JSAPI Key。
- 需要插件的组件应通过组件内部自动加载或在 `<AmapMap :plugins>` 中提前声明，避免实例创建时插件缺失。
- 在 SSR 环境中不要在 setup 顶层直接访问 `window` 或 `AMap`；等待 `ready` 事件后再读取实例。
