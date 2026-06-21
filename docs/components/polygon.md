# `<AmapPolygon>`

Render filled polygons with optional holes. Accepts both single-ring and multi-ring paths.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `path` | `LngLatLike[] \| LngLatLike[][]` | Polygon coordinates. |
| `options` | `Partial<AMap.PolygonOptions>` | Extra JSAPI options (stroke color, fill opacity, etc.). |
| `visible` | `boolean` | Toggles visibility. |
| `extData` | `any` | Arbitrary metadata. |

## 事件

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Polygon` | Fired after creation. |
| `click` | `any` | Click events. |
| `mouseover` | `any` | Pointer enter events. |
| `mouseout` | `any` | Pointer leave events. |

## 用法

```vue
<AmapPolygon
  :path="[
    [116.39, 39.90],
    [116.42, 39.90],
    [116.42, 39.92],
    [116.39, 39.92]
  ]"
  :options="{ fill颜色: 'rgba(75,139,255,0.25)', stroke颜色: '#4b8bff' }"
/>
```

## 在线示例

<ClientOnly>
  <PolygonComponentDemo />
</ClientOnly>

<script setup lang="ts">
import PolygonComponentDemo from '../examples/PolygonComponentDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
