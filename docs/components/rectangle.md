# `<AmapRectangle>`

通过声明式组件封装 JSAPI `AMap.Rectangle` 覆盖物，用于绘制轴对齐矩形。矩形会响应属性变化，因此可以用 Vue 状态驱动范围、样式或可见性变化。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `bounds` | `BoundsLike` | – | 定义矩形的西南角与东北角坐标。 |
| `options` | `Partial<AMap.RectangleOptions>` | `{}` | 额外 JSAPI 选项，例如描边、填充样式或 `draggable`。 |
| `visible` | `boolean` | `true` | 切换矩形可见性但不重建实例。 |
| `extData` | `any` | – | 透传给覆盖物的任意元数据。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Rectangle` | 矩形创建并挂载到地图后触发。 |
| `click` | `any` | 指针点击矩形表面时触发。 |
| `mouseover` | `any` | 指针进入矩形时触发。 |
| `mouseout` | `any` | 指针离开矩形时触发。 |

## 最小示例

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell">
  <AmapRectangle
    :bounds="[[116.35, 39.88], [116.44, 39.94]]"
    :options="{ strokeColor: '#20c997', strokeWeight: 2, fillColor: 'rgba(32, 201, 151, 0.35)' }"
  />
</AmapMap>
```

## 完整示例

<ClientOnly>
  <RectangleComponentDemo />
</ClientOnly>

<script setup lang="ts">
import RectangleComponentDemo from '../examples/RectangleComponentDemo.vue'
</script>

### TS 签名

```ts
export interface RectangleProps {
  bounds: BoundsLike
  options?: Partial<AMap.RectangleOptions>
  visible?: boolean
  extData?: any
}
```

### 常见错误

- 确保组件嵌套在 `<AmapMap>` 内部，以便获取注入的地图实例。
- 响应式计算 `bounds` 时返回全新的数组，避免原地修改同一引用导致无法触发更新。
- 使用 `extData`（或 `setExtData`）附加标识，便于编辑器 hooks 后续解析。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
