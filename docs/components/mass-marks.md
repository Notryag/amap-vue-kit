# `<AmapMassMarks>`

使用 JSAPI `MassMarks` 插件渲染数万级轻量点标记。组件会让实例与 Vue 状态保持同步，并暴露方法在不重建覆盖物的情况下更新数据集。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `{ lnglat: [number, number], style?: number }[]` | `[]` | 普通点数据数组，包含 `lnglat` 坐标和可选样式索引。 |
| `styles` | `AMap.MassMarkersStyleOptions \| AMap.MassMarkersStyleOptions[] \| undefined` | – | 传给 JSAPI 实例的样式定义。模板中优先使用该 prop，因为 Vue 会把 `style` 保留给 DOM 样式。 |
| `style` | `AMap.MassMarkersStyleOptions \| AMap.MassMarkersStyleOptions[] \| undefined` | – | 已废弃的兼容别名，请避免在模板中使用。 |
| `options` | `Partial<AMap.MassMarkersOptions> \| undefined` | – | 额外 JSAPI 配置，例如 `zooms` 或 `opacity`。 |
| `visible` | `boolean` | `true` | 切换标记可见性但不销毁实例。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions>> \| undefined` | – | 透传给 `loader.load` 的加载配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.MassMarks` | 海量点实例创建后触发一次。 |
| `click` | `any` | 点被点击时触发。 |
| `mouseover` | `any` | 鼠标悬停到点上时触发。 |
| `mouseout` | `any` | 鼠标离开点时触发。 |

## 最小示例

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="11" class="map-shell">
  <AmapMassMarks :data="points" :styles="styles" :options="{ zooms: [3, 19] }" />
</AmapMap>
```

组件会自动加载 `AMap.MassMarks` 所需的 JSAPI 兼容插件，深度监听 `data` 数组，并在样式或配置的响应式来源变化时重新应用。

<ClientOnly>
  <MassMarksComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MassMarksComponentDemo from '../examples/MassMarksComponentDemo.vue'
</script>

### TS 签名

```ts
export interface MassMarksProps {
  data?: Array<{ lnglat: [number, number], style?: number }>
  styles?: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]
  style?: AMap.MassMarkersStyleOptions | AMap.MassMarkersStyleOptions[]
  options?: Partial<AMap.MassMarkersOptions>
  visible?: boolean
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 提供有限数量的样式，并在每个点数据中通过 `style` 索引引用，可降低 GC 压力。
- 在 Vue 模板中使用组件 prop `styles`，不要使用 `style`。`style` 名称会被 Vue 作为 DOM/CSS 样式处理，可能在到达组件前被消费。
- 流式追加数据时优先使用 `ref`/`reactive` 集合，不要在每次 tick 都重建数组。
- `MassMarks` 与其他覆盖物混用时，调整 `options.zIndex` 以保证期望的层级顺序。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
