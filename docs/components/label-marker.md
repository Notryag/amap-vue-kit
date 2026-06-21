# `<AmapLabelMarker>`

将高性能文本或图标标记挂载到 `<AmapLabelsLayer>`。组件会代理 `LabelMarker` 配置并暴露事件，让你像处理普通标记一样响应点击和悬停。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `position` | `LngLatLike \| undefined` | 标记坐标，支持 `[lng, lat]` 元组或 `AMap.LngLat`。 |
| `text` | `AMap.LabelMarkerTextOptions \| undefined` | 由 JSAPI 渲染的富文本内容，支持偏移、样式和多行文本。 |
| `icon` | `AMap.LabelMarkerIconOptions \| undefined` | 可选图片精灵，可显示在文本下方或旁边。 |
| `zooms` | `[number, number] \| undefined` | 标记保持可见的缩放范围。 |
| `opacity` | `number \| undefined` | 标记透明度。 |
| `zIndex` | `number \| undefined` | 相对其他标签标记的渲染层级。 |
| `extData` | `any` | 存储在标记实例上的任意元数据。 |
| `visible` | `boolean \| undefined` | 控制可见性但不销毁标记。 |
| `collision` | `boolean \| undefined` | 覆盖父图层对该标记的避让行为。 |
| `options` | `Partial<AMap.LabelMarkerOptions>` | 创建时合并的额外 JSAPI 配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.LabelMarker` | 标记实例可用时触发。 |
| `click` | `any` | 从 JSAPI 实例转发的点击事件。 |
| `mouseover` | `any` | 指针移入事件。 |
| `mouseout` | `any` | 指针移出事件。 |

## 用法

```vue
<AmapLabelsLayer :collision="true">
  <AmapLabelMarker
    v-for="item in data"
    :key="item.id"
    :position="item.position"
    :text="item.text"
    :icon="item.icon"
    @click="handleSelect(item)"
  />
</AmapLabelsLayer>
```

请把标签标记放在标签图层内，以便共享 GPU 资源。组件会通过 `ready` 事件以及 `template ref`/`expose` 暴露底层实例，必要时可以调用命令式方法。

<ClientOnly>
  <LabelsLayerDemo />
</ClientOnly>

<script setup lang="ts">
import LabelsLayerDemo from '../examples/LabelsLayerDemo.vue'
</script>

### TypeScript 签名

```ts
export interface LabelMarkerProps {
  position?: LngLatLike
  text?: AMap.LabelMarkerTextOptions
  icon?: AMap.LabelMarkerIconOptions
  zooms?: [number, number]
  opacity?: number
  zIndex?: number
  extData?: any
  visible?: boolean
  collision?: boolean
  options?: Partial<AMap.LabelMarkerOptions>
}
```

### 常见错误

- 标签标记必须放在 `<AmapLabelsLayer>` 内部，否则开发环境会给出 warning。
- 传入 `text.offset` 时可以使用 `[x, y]` 元组，组件内部会转换为 `AMap.Pixel`。
- 避让行为取决于父图层。需要精细控制时，同时设置图层的 `collision` prop 和标记自身的 `collision` 覆盖项。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
