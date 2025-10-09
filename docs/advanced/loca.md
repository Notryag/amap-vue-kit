# Loca & Visualizations

Loca builds on top of JSAPI WebGL capabilities to render dense visualizations. The `@amap-vue/loca` package wraps the most common workflows with Vue components and composables so that you can declaratively manage Loca containers, point clouds, heatmaps, polygons, and pulse lines alongside the rest of your map UI.

## Installation & loader setup

```bash
pnpm add @amap-vue/loca
```

The shared loader exposes a `loca` option to request the Loca script together with the base JSAPI. Pass `true` to use the default CDN build or supply a version when you need to pin to a specific release.

```ts
import { loader } from '@amap-vue/shared'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  loca: true, // or { version: '2.0.5' }
})
```

Enable the option before mounting your Vue app. Once both scripts finish loading the `Loca` global becomes available and all helpers from `@amap-vue/loca` can instantiate layers safely.

## Component overview

| Component | Purpose | Key props |
| --- | --- | --- |
| `<AmapLocaProvider>` | Owns a `Loca.Container` bound to an existing `AMap.Map` instance. | `map` (required), `options` to forward to the container constructor. |
| `<AmapLocaPointLayer>` | Declarative wrapper around `Loca.PointLayer`. | `data`, `lngKey`, `latKey`, `style`, `options`, `autoRender`. |
| `<AmapLocaHeatmapLayer>` | Reactive heat map powered by `Loca.HeatmapLayer`. | `data`, `valueField`, `style`, `options`, `autoRender`. |
| `<AmapLocaPolygonLayer>` | Renders GeoJSON-like sources via `Loca.PolygonLayer`. | `source`, `style`, `options`, `events`, `autoRender`. |

All layer components expect to be nested inside a single `<AmapLocaProvider>` so they can access the underlying container instance via Vue provide/inject.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AmapMap } from '@amap-vue/core'
import {
  AmapLocaProvider,
  AmapLocaPointLayer,
} from '@amap-vue/loca'

const mapRef = ref<AMap.Map | null>(null)
const points = ref([
  { lng: 116.397, lat: 39.908, size: 20 },
  { lng: 116.41, lat: 39.92, size: 12 },
])

function handleReady(map: AMap.Map) {
  mapRef.value = map
}

const pointStyle = {
  radius: (item: any) => item.size,
  color: '#4F46E5',
  borderWidth: 0,
}
</script>

<template>
  <AmapMap
    class="map-shell"
    :center="[116.397, 39.908]"
    :zoom="11"
    @ready="handleReady"
  >
    <AmapLocaProvider :map="mapRef">
      <AmapLocaPointLayer :data="points" :style="pointStyle" />
    </AmapLocaProvider>
  </AmapMap>
</template>
```

Layer props are fully reactive. When `points`, styles, or options change the wrapper schedules a render on the next animation frame. Set `autoRender="false"` on any layer to manage redraws manually via the returned layer API or the `render()` method on the provider container.

### Working with heat maps and polygons

Heatmap layers accept arbitrary data arrays. Use `valueField` when your intensity property is named differently and forward native options with the `options` prop:

```vue
<AmapLocaHeatmapLayer
  :data="heatmapData"
  value-field="intensity"
  :options="{ eventSupport: true, mode: 'point' }"
  :style="{ radius: 25, color: ['#34d399', '#2563eb'] }"
/>
```

Polygon layers expect GeoJSON-like feature collections. Provide an `events` object to subscribe to interaction hooks exposed by Loca:

```vue
<AmapLocaPolygonLayer
  :source="geoJson"
  :style="{ color: '#38bdf8', opacity: 0.4 }"
  :events="{ click: handlePolygonClick }"
/>
```

### Composable APIs

Every component is powered by an underlying composable that you can also consume directly for fully custom render flows:

```ts
import { computed } from 'vue'
import {
  useLocaContainer,
  useLocaPointLayer,
  useLocaPulseLineLayer,
} from '@amap-vue/loca'

const container = useLocaContainer({ map: () => mapRef.value })
const pointLayer = useLocaPointLayer(() => container.instance.value, { unit: 'px' })
const pulseLayer = useLocaPulseLineLayer(() => container.instance.value)

container.init()
pointLayer.setData(points.value)
pointLayer.setStyle(pointStyle)
pointLayer.addTo()
pulseLayer.setData(paths.value)
pulseLayer.setStyle({ lineWidth: 2, headColor: '#f97316' })
```

Use the composables when you need to orchestrate manual loading, batching, or advanced Loca features not yet covered by the higher-level components.

## Live example

<ClientOnly>
  <LocaVisualizationDemo />
</ClientOnly>

<script setup lang="ts">
import LocaVisualizationDemo from '../examples/advanced/LocaVisualizationDemo.vue'
</script>

### Tips

- Keep datasets lean; Loca expects simple objects and handles the heavy lifting on the GPU.
- Use the Composition API to regenerate `setData` payloads when filters or time ranges change.
- Remember to destroy layers during unmount to release WebGL resources. All provided composables expose `destroy()` helpers.
- If you need to debounce redraws, disable `autoRender` and call `render()` when your animation frame or worker pipeline is ready.
