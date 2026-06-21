# `<AmapPolyline>`

绘制表示路径或路线的折线。组件会消费地图上下文，并在属性变化时响应式更新。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `LngLatLike[]` | 按顺序排列的坐标列表。 |
| `options` | `Partial<AMap.PolylineOptions>` | 额外 JSAPI 选项。 |
| `visible` | `boolean` | 切换可见性。 |
| `extData` | `any` | 自定义元数据。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Polyline` | 创建完成后触发。 |
| `click` | `any` | 折线上的点击事件。 |
| `mouseover` | `any` | 指针移入事件。 |
| `mouseout` | `any` | 指针移出事件。 |

## 用法

```vue
<AmapPolyline
  :path="[
    [116.397, 39.908],
    [116.427, 39.903],
    [116.45, 39.92]
  ]"
  :options="{ strokeColor: '#4b8bff', strokeWeight: 4 }"
/>
```

## 在线示例

<ClientOnly>
  <PolylineComponentDemo />
</ClientOnly>

<script setup lang="ts">
import PolylineComponentDemo from '../examples/PolylineComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
