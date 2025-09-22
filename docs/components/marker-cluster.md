# `<AmapMarkerCluster>`

Declaratively configure the MarkerCluster plugin to group dense point data.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `points` | `MarkerClusterPoint[]` | Array of plain data points from which markers are generated. |
| `markers` | `AMap.Marker[]` | Alternatively provide pre-built marker instances. |
| `visible` | `boolean` | Controls cluster visibility. |
| `options` | `Partial<AMap.MarkerClusterOptions>` | Additional JSAPI options such as `gridSize` or custom renderers. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.MarkerCluster` | Fired when the cluster instance is created. |
| `click` | `any` | Click events on clusters. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="11" style="height: 320px">
  <AmapMarkerCluster :points="points" :options="{ gridSize: 80 }" />
</AmapMap>
```

## Live example

<ClientOnly>
  <MarkerClusterComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MarkerClusterComponentDemo from '../examples/MarkerClusterComponentDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
