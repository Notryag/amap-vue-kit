# `<AmapEllipse>`

`<AmapEllipse>` 以响应式方式控制中心点、半径、样式和可见性，用于渲染 JSAPI 椭圆。适合高亮覆盖范围或不确定区域，无需手动管理覆盖物。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `center` | `LngLatLike` | – | 椭圆地理中心点。 |
| `radius` | `[number, number]` | – | 水平和垂直半径，单位为米。 |
| `options` | `Partial<AMap.EllipseOptions>` | `{}` | 额外 JSAPI 选项，例如描边、填充样式或光标。 |
| `visible` | `boolean` | `true` | 切换显示状态但不销毁覆盖物。 |
| `extData` | `any` | – | 存储在椭圆实例上的元数据。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Ellipse` | 椭圆实例创建后触发。 |
| `click` | `any` | 指针点击椭圆时触发。 |
| `mouseover` | `any` | 指针进入椭圆时触发。 |
| `mouseout` | `any` | 指针离开椭圆时触发。 |

## 最小示例

```vue
<AmapMap :center="[116.406, 39.912]" :zoom="13" class="map-shell">
  <AmapEllipse
    :center="[116.406, 39.912]"
    :radius="[900, 500]"
    :options="{ strokeColor: '#fd7e14', strokeWeight: 2, fillColor: 'rgba(253, 126, 20, 0.3)' }"
  />
</AmapMap>
```

## 完整示例

<ClientOnly>
  <EllipseComponentDemo />
</ClientOnly>

<script setup lang="ts">
import EllipseComponentDemo from '../examples/EllipseComponentDemo.vue'
</script>

### TS 签名

```ts
export interface EllipseProps {
  center: LngLatLike
  radius: [number, number]
  options?: Partial<AMap.EllipseOptions>
  visible?: boolean
  extData?: any
}
```

### 常见错误

- `radius` 使用米作为距离单位；如果来源是经纬度差值，请先换算。
- 更新 `radius` 和 `center` 时尽量提供稳定数组引用，确保 Vue 响应式能正确传播。
- 使用 `extData` 存储标识，便于编辑器 hooks 或鼠标工具后续解析。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
