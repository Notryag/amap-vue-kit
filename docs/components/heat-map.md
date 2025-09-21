# `<AmapHeatMap>`

Visualise density-based metrics using the JSAPI heat map plugin. The component keeps the dataset in sync with Vue state and
exposes helpers to push incremental updates.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `AMap.HeatMapDataPoint[]` | `[]` | Collection of points with `lng`, `lat`, and `count`. |
| `max` | `number \| undefined` | – | Optional maximum value used to normalise the gradient. |
| `radius` | `number \| undefined` | – | Radius of influence for each point (in pixels). |
| `gradient` | `Record<string, string> \| undefined` | – | Custom colour stops mapping ratios (`'0.5'`) to CSS colours. |
| `opacity` | `[number, number] \| undefined` | – | Min/max opacity bounds passed to the JSAPI plugin. |
| `visible` | `boolean` | `true` | Toggle the heat map without destroying it. |
| `options` | `Partial<AMap.HeatMapOptions>` | `{}` | Additional JSAPI options such as `zoomFactor` or `unit`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.HeatMap` | Emitted when the plugin instance is created. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell">
  <AmapHeatMap :data="points" :radius="32" :gradient="gradient" />
</AmapMap>
```

The component requests the `AMap.HeatMap` plugin on demand and automatically reapplies options when `data`, `radius`, or the grad
ient change.

<ClientOnly>
  <HeatMapDemo />
</ClientOnly>

<script setup lang="ts">
import HeatMapDemo from '../examples/HeatMapDemo.vue'
</script>

### TypeScript signature

```ts
export interface HeatMapProps {
  data?: AMap.HeatMapDataPoint[]
  max?: number
  radius?: number
  gradient?: Record<string, string>
  opacity?: [number, number]
  visible?: boolean
  options?: Partial<AMap.HeatMapOptions>
}
```

### Common pitfalls

- Large datasets benefit from pre-aggregating values on the server to reduce payload size.
- The heat map uses pixel radii. Increase the radius at low zoom levels to avoid sparse visuals.
- When mixing heat maps with other WebGL overlays, prefer the same `zIndex` ordering to avoid flickering artefacts.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
