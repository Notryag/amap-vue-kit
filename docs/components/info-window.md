# `<AmapInfoWindow>`

在地图坐标上展示上下文信息。组件会把默认插槽内容渲染到 JSAPI 信息窗体中。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `position` | `LngLatLike \| undefined` | 信息窗体打开位置。 |
| `isOpen` | `boolean` | 控制信息窗体是否打开。 |
| `offset` | `AMap.Pixel \| [number, number]` | 相对锚点的像素偏移。 |
| `anchor` | `AMap.InfoWindowAnchor` | 将信息窗体对齐到地图方向锚点。 |
| `isCustom` | `boolean` | 移除默认气泡外观，以便提供完全自定义的标记。 |
| `content` | `string \| HTMLElement \| null` | 直接提供字符串或 DOM 节点，而不是使用默认插槽。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.InfoWindow` | 信息窗体创建完成后触发。 |
| `open` | `any` | 信息窗体打开时触发。 |
| `close` | `any` | 信息窗体关闭时触发。 |

## 最小示例

```vue
<AmapInfoWindow :position="[116.397, 39.908]" :is-open="showWindow">
  <div class="popup">
    <h4>故宫</h4>
    <p>探索北京中轴线上的宫殿建筑群。</p>
  </div>
</AmapInfoWindow>
```

可以切换 `isOpen` prop，或在暴露实例上调用 `infoWindow.open(map, position)` 进行命令式控制。

如需完全自定义外观，可以设置 `is-custom`，继续使用插槽内容；如果已经持有 DOM 节点，也可以通过 `content` prop 传入。

## 完整示例

<ClientOnly>
  <InfoWindowComponentDemo />
</ClientOnly>

<script setup lang="ts">
import InfoWindowComponentDemo from '../examples/InfoWindowComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本组件的 props、emits 与插槽类型由 `@amap-vue/core` 的 `.d.ts` 文件导出；上方属性和事件表与发布类型保持同步。

## 常见错误

- 地图空白时，先确认容器有明确高度，并已配置有效的高德 JSAPI Key。
- 需要插件的组件应通过组件内部自动加载或在 `<AmapMap :plugins>` 中提前声明，避免实例创建时插件缺失。
- 在 SSR 环境中不要在 setup 顶层直接访问 `window` 或 `AMap`；等待 `ready` 事件后再读取实例。
