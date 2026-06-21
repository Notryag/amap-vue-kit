# `<AmapPolyline>`

Draw polylines representing paths or routes. The component consumes the map context and updates reactively as props change.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `path` | `LngLatLike[]` | Ordered list of coordinates. |
| `options` | `Partial<AMap.PolylineOptions>` | Additional JSAPI options. |
| `visible` | `boolean` | Toggles visibility. |
| `extData` | `any` | Custom metadata. |

## 事件

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Polyline` | Fired after creation. |
| `click` | `any` | Click events along the line. |
| `mouseover` | `any` | Pointer enter events. |
| `mouseout` | `any` | Pointer leave events. |

## 用法

```vue
<AmapPolyline
  :path="[
    [116.397, 39.908],
    [116.427, 39.903],
    [116.45, 39.92]
  ]"
  :options="{ stroke颜色: '#4b8bff', strokeWeight: 4 }"
/>
```

## 在线示例

<ClientOnly>
  <PolylineComponentDemo />
</ClientOnly>

<script setup lang="ts">
import PolylineComponentDemo from '../examples/PolylineComponentDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
