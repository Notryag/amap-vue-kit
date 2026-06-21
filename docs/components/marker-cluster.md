# `<AmapMarkerCluster>`

Declaratively configure the MarkerCluster plugin to group dense point data.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `points` | `MarkerClusterPoint[]` | Array of plain data points from which markers are generated. |
| `markers` | `AMap.Marker[]` | Alternatively provide pre-built marker instances. |
| `visible` | `boolean` | Controls cluster visibility. |
| `options` | `Partial<AMap.MarkerClusterOptions>` | Additional JSAPI options such as `gridSize` or custom renderers. |

## 事件

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.MarkerCluster` | Fired when the cluster instance is created. |
| `click` | `any` | Click events on clusters. |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="11" style="height: 320px">
  <AmapMarkerCluster :points="points" :options="{ gridSize: 80 }" />
</AmapMap>
```

## 在线示例

<ClientOnly>
  <MarkerClusterComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MarkerClusterComponentDemo from '../examples/MarkerClusterComponentDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
