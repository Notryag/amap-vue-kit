# `<AmapCircleMarker>`

`<AmapCircleMarker>` wraps the lightweight JSAPI circle marker overlay which renders as a scalable vector circle anchored to map coordinates.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `center` | `LngLatLike` | Marker center coordinates. |
| `radius` | `number` | Radius in pixels. |
| `visible` | `boolean` | Controls marker visibility. |
| `extData` | `any` | Arbitrary metadata attached to the marker. |
| `options` | `Partial<AMap.CircleMarkerOptions>` | Additional JSAPI options such as colors or cursor. |

## 事件

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.CircleMarker` | Fired when the marker instance is ready. |
| `click` | `any` | Click events on the circle marker. |
| `mouseover` | `any` | Hover enter events. |
| `mouseout` | `any` | Hover leave events. |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="14" style="height: 320px">
  <AmapCircleMarker
    :center="[116.397, 39.908]"
    :radius="16"
    :options="{ fill颜色: 'rgba(22, 119, 255, 0.45)', stroke颜色: '#1677ff' }"
  />
</AmapMap>
```

## 在线示例

<ClientOnly>
  <CircleMarkerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import CircleMarkerComponentDemo from '../examples/CircleMarkerComponentDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
