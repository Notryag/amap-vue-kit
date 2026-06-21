# `<AmapText>`

`<AmapText>` 渲染 `AMap.Text` 覆盖物，用于在地理坐标点上显示带样式的文本标签。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `position` | `LngLatLike` | 文本覆盖物坐标。 |
| `text` | `string` | 要显示的文本内容。 |
| `textStyle` | `Record<string, any>` | 应用于文本元素的内联 CSS 样式。模板中建议使用该属性，因为 Vue 会把 `style` 保留给 DOM 样式。 |
| `style` | `Record<string, any>` | 已废弃的兼容别名，模板中避免使用。 |
| `offset` | `AMap.Pixel \| [number, number]` | 相对锚点的像素偏移。 |
| `anchor` | `AMap.MarkerAnchor` | 文本元素的锚点对齐方式。 |
| `zIndex` | `number` | 覆盖物层级。 |
| `extData` | `any` | 附加到覆盖物的任意元数据。 |
| `visible` | `boolean` | 控制可见性。 |
| `options` | `Partial<AMap.TextOptions>` | 额外 JSAPI 选项。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Text` | 文本实例创建后触发。 |
| `click` | `any` | 文本元素点击事件。 |
| `mouseover` | `any` | 鼠标移入事件。 |
| `mouseout` | `any` | 鼠标移出事件。 |
| `dragend` | `any` | 启用拖拽后，拖拽结束时触发。 |

## 最小示例

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="13" style="height: 320px">
  <AmapText
    :position="[116.397, 39.908]"
    text="朝阳区"
    :text-style="{ padding: '6px 10px', borderRadius: '12px', background: 'rgba(22, 119, 255, 0.92)', color: '#fff' }"
    :offset="[0, -26]"
    anchor="bottom-center"
  />
</AmapMap>
```

## 完整示例

<ClientOnly>
  <TextComponentDemo />
</ClientOnly>

<script setup lang="ts">
import TextComponentDemo from '../examples/TextComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本组件的 props、emits 与插槽类型由 `@amap-vue/core` 的 `.d.ts` 文件导出；上方属性和事件表与发布类型保持同步。

## 常见错误

- 地图空白时，先确认容器有明确高度，并已配置有效的高德 JSAPI Key。
- 需要插件的组件应通过组件内部自动加载或在 `<AmapMap :plugins>` 中提前声明，避免实例创建时插件缺失。
- 在 SSR 环境中不要在 setup 顶层直接访问 `window` 或 `AMap`；等待 `ready` 事件后再读取实例。
