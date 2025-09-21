# `<AmapTileLayer>` & friends

`<AmapTileLayer>` wraps the JSAPI tile layer so you can stack additional imagery on top of the base map. It also powers the convenience components `<AmapTrafficLayer>`, `<AmapRoadNetLayer>`, and `<AmapSatelliteLayer>`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Controls whether the layer is added to the map. |
| `opacity` | `number \| undefined` | – | Blends the layer against the base map. |
| `zIndex` | `number \| undefined` | – | Rendering order between layers. |
| `tileUrl` | `string \| ((x: number, y: number, level: number) => string)` | – | Custom tile URL template. Mutually exclusive with `getTileUrl`. |
| `getTileUrl` | `(x: number, y: number, level: number) => string` | – | Imperative URL resolver. |
| `options` | `Partial<AMap.TileLayerOptions>` | `{}` | Additional JSAPI options such as `zooms` or `tileSize`. Forward variant-specific values (like traffic refresh intervals) via each component's dedicated `options` prop. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.TileLayer` | Fires once the layer instance is created and added to the map. |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showTraffic = ref(true)
const showRoadNet = ref(false)
const showSatellite = ref(false)
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="11" class="map-shell">
    <AmapTrafficLayer v-if="showTraffic" auto-refresh />
    <AmapRoadNetLayer v-if="showRoadNet" />
    <AmapSatelliteLayer v-if="showSatellite" />
  </AmapMap>
</template>
```

Toggle the reactive flags to add or remove each overlay. The components automatically dispose their instances when unmounted.

<ClientOnly>
  <TileLayerDemo />
</ClientOnly>

<script setup lang="ts">
import TileLayerDemo from '../examples/TileLayerDemo.vue'
</script>

### Variants

- **`<AmapTrafficLayer>`** – renders live congestion information. Use the `auto-refresh` and `interval` props for periodic updates.
- **`<AmapRoadNetLayer>`** – displays road grid lines on top of the base map. Useful when the underlying theme omits boundaries.
- **`<AmapSatelliteLayer>`** – swaps the imagery tiles to satellite photos while keeping vector overlays intact.

All variants accept the shared `visible`, `opacity`, `zIndex`, and `options` props. Their `ready` event emits the concrete JSAPI layer (`AMap.TileLayer.Traffic`, `AMap.TileLayer.RoadNet`, etc.).

### Custom sources

Provide a `tileUrl` template to connect to custom raster services:

```vue
<AmapTileLayer
  tile-url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x=[x]&y=[y]&z=[z]"
  :options="{ detectRetina: true }"
/>
```

When the URL depends on complex logic (authentication headers, signed URLs) prefer the `getTileUrl` callback instead.

### TypeScript signature

```ts
export interface TileLayerProps {
  visible?: boolean
  opacity?: number
  zIndex?: number
  tileUrl?: string | ((x: number, y: number, level: number) => string)
  getTileUrl?: (x: number, y: number, level: number) => string
  options?: Partial<AMap.TileLayerOptions>
}

export interface TrafficLayerProps extends TileLayerProps {
  autoRefresh?: boolean
  interval?: number
  options?: Partial<AMap.TileLayer.Traffic.Options>
}

export interface RoadNetLayerProps extends TileLayerProps {
  options?: Partial<AMap.TileLayerOptions>
}

export interface SatelliteLayerProps extends TileLayerProps {
  options?: Partial<AMap.TileLayerOptions>
}

type TileLayerReadyPayload = AMap.TileLayer | AMap.TileLayer.Traffic | AMap.TileLayer.RoadNet | AMap.TileLayer.Satellite
```

The prop interfaces and ready payload types mirror the component exports and reuse hook typings from `@amap-vue/hooks`.

### Common pitfalls

- Ensure `<AmapTileLayer>` (and its variants) live inside `<AmapMap>` so they can access the injected map context.
- Do not configure conflicting loaders per map. Call `loader.config` once to share plugin configuration.
- `auto-refresh` triggers network requests every few seconds; disable it when the layer is outside the viewport to conserve quota.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
