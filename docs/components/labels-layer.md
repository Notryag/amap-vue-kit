# `<AmapLabelsLayer>`

以 GPU 加速方式渲染数百个富文本标记。标签图层会批量管理所有 `LabelMarker` 实例并处理碰撞检测，即使数据密集也能保持地图响应。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | 控制图层是否显示在地图上。 |
| `opacity` | `number \| undefined` | – | 图层相对底图的透明度。 |
| `zIndex` | `number \| undefined` | – | 多图层叠加时的渲染顺序。 |
| `zooms` | `[number, number] \| undefined` | – | 图层保持可见的最小和最大缩放级别。 |
| `collision` | `boolean \| undefined` | – | 启用 JSAPI 标签标记避让。 |
| `allowCollision` | `boolean \| undefined` | – | 即使检测到碰撞也强制允许标签重叠。 |
| `options` | `Partial<AMap.LabelsLayerOptions>` | `{}` | 透传给底层图层的额外 JSAPI 配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.LabelsLayer` | 图层实例创建并挂载到地图后触发一次。 |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="13" class="map-shell">
  <AmapLabelsLayer :collision="true">
    <AmapLabelMarker
      v-for="office in offices"
      :key="office.id"
      :position="office.position"
      :text="{
        content: office.name,
        direction: 'top',
        offset: [0, -12]
      }"
    />
  </AmapLabelsLayer>
</AmapMap>
```

使用 `visible` 和 `collision` props 可在不重建图层的情况下切换可见性和避让规则。单个标签标记也可以通过自己的 `visible` prop 控制可见性。

<ClientOnly>
  <LabelsLayerDemo />
</ClientOnly>

<script setup lang="ts">
import LabelsLayerDemo from '../examples/LabelsLayerDemo.vue'
</script>

### TypeScript 签名

```ts
export interface LabelsLayerProps {
  visible?: boolean
  opacity?: number
  zIndex?: number
  zooms?: [number, number]
  collision?: boolean
  allowCollision?: boolean
  options?: Partial<AMap.LabelsLayerOptions>
}
```

### 常见错误

- 将 `<AmapLabelsLayer>` 放在 `<AmapMap>` 内部，确保能拿到注入的地图实例。
- 碰撞检测只作用于同一图层内的标签标记。组合不同数据集时可以创建独立图层。
- 如果手动实例化图层，请记得在 AMap loader 中配置 `AMap.LabelsLayer` 插件；组件会自动请求它。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
