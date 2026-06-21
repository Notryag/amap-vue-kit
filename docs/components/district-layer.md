# `<AmapDistrictLayer>`

用响应式 props 封装 JSAPI 行政区图层插件，支持 `type`、`adcode` 和样式配置。无需命令式代码即可在国家、省、市视图之间切换。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'World' \| 'Country' \| 'Province' \| 'City' \| 'District'` | `'Country'` | 选择要创建的行政区图层类型。 |
| `adcode` | `string \| number \| Array<string \| number> \| undefined` | `undefined` | 需要渲染的行政区编码；省略时使用当前类型的默认视图。 |
| `depth` | `number \| undefined` | – | 包含下级行政区的深度。 |
| `styles` | `Record<string, any> \| undefined` | – | 直接传给 JSAPI 图层的样式映射。 |
| `visible` | `boolean` | `true` | 控制图层可见性但不销毁实例。 |
| `options` | `Partial<AMap.DistrictLayerOptions>` | `{}` | 额外插件选项，例如 `opacity` 或 `zooms`。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.DistrictLayer` | 图层实例可用后触发。 |
| `complete` | `any` | 底层图层触发 `complete` 时透传。 |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="6">
  <AmapDistrictLayer
    type="Province"
    adcode="110000"
    :depth="2"
    :styles="{ fill: 'rgba(59, 130, 246, 0.12)', stroke: '#2563eb' }"
  />
</AmapMap>
```

切换 `type` 或 `adcode` 属性时会自动调用对应 JSAPI setter，并复用现有实例以保持更新流畅。

<ClientOnly>
  <DistrictLayerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import DistrictLayerComponentDemo from '../examples/DistrictLayerComponentDemo.vue'
</script>

### TypeScript 签名

```ts
export interface DistrictLayerProps {
  type?: DistrictLayerType
  adcode?: string | number | Array<string | number>
  depth?: number
  styles?: Record<string, any>
  visible?: boolean
  options?: Partial<AMap.DistrictLayerOptions>
}
```

### 常见错误

- 下钻到省市时将 `depth` 设为 `2` 或 `3`，否则下级行政区可能不会渲染。
- 将 `styles` 与 `options` 中的透明度组合使用，可以创建更克制但仍突出边界的底图。
- 在区域之间切换动画时，复用同一个 `AmapDistrictLayer` 实例可以避免闪烁。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
