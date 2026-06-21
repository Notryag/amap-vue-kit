# `<AmapMarker>`

`<AmapMarker>` 渲染标准 JSAPI 点标记，并自动注册到最近的 `<AmapMap>`。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `position` | `LngLatLike` | 标记坐标。 |
| `icon` | `string \| AMap.Icon` | 自定义图标配置。 |
| `label` | `string \| AMap.MarkerLabelOptions` | 显示在标记旁的可选标签。 |
| `draggable` | `boolean` | 启用拖拽交互。 |
| `zIndex` | `number` | 层级顺序。 |
| `extData` | `any` | 存储在标记上的任意业务数据。 |
| `offset` | `AMap.Pixel \| [number, number]` | 相对锚点的像素偏移。 |
| `anchor` | `AMap.MarkerAnchor` | 与 `offset` 配合使用的锚点位置，用于精确对齐。 |
| `content` | `string \| HTMLElement` | 自定义 HTML/SVG 内容。未传入时渲染默认标记图标。 |
| `isCustom` | `boolean` | 强制启用或禁用自定义渲染；提供插槽或 `content` 时会自动推断。 |
| `visible` | `boolean` | 控制标记可见性。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Marker` | 标记创建完成时触发。 |
| `click` | `any` | 标记点击事件。 |
| `dragend` | `any` | 拖拽结束后触发。 |
| `mouseover` | `any` | 鼠标移入事件。 |
| `mouseout` | `any` | 鼠标移出事件。 |

## 最小示例

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="11" style="height: 320px">
  <AmapMarker :position="[116.397, 39.908]" @click="handleClick" />
</AmapMap>
```

### 自定义 HTML 或 SVG 内容

`<AmapMarker>` 已对齐 JSAPI 的 `content` 能力。可以通过 `content` prop 传入字符串或 HTMLElement，也可以使用默认插槽把 Vue 模板渲染成标记内容。存在插槽内容时，组件会自动切换 `isCustom`，并使用传入的 HTML/SVG 替代默认图标。

```vue
<AmapMarker
  :position="[116.397, 39.908]"
  anchor="bottom-center"
  :offset="[0, -28]"
>
  <div class="custom-marker">
    <span class="custom-marker__emoji">🍜</span>
    <span>北京面馆</span>
  </div>
</AmapMarker>
```

将 `anchor` 与 `offset` 搭配使用，可以让插槽内容相对地理坐标精确对齐。例如 `anchor="bottom-center"` 加负向 Y 偏移，可以让 HTML 卡片底部固定在坐标点上。

## 完整示例

<ClientOnly>
  <MarkerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MarkerComponentDemo from '../examples/MarkerComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本组件的 props、emits 与插槽类型由 `@amap-vue/core` 的 `.d.ts` 文件导出；上方属性和事件表与发布类型保持同步。

## 常见错误

- 地图空白时，先确认容器有明确高度，并已配置有效的高德 JSAPI Key。
- 需要插件的组件应通过组件内部自动加载或在 `<AmapMap :plugins>` 中提前声明，避免实例创建时插件缺失。
- 在 SSR 环境中不要在 setup 顶层直接访问 `window` 或 `AMap`；等待 `ready` 事件后再读取实例。
