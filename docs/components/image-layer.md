# `<AmapImageLayer>`

Project custom raster overlays (heat maps, floor plans, historical imagery) onto the map without writing imperative glue code. The component watches Vue state for URL, bounds, or opacity changes and keeps the underlying `AMap.ImageLayer` in sync.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `string` | – | Image URL to render. Required and reactive. |
| `bounds` | `BoundsLike` | – | Geographic bounds of the image. Accepts `[southWest, northEast]` arrays or `AMap.Bounds`. |
| `visible` | `boolean` | `true` | Toggles whether the layer is displayed on the map. |
| `opacity` | `number \| undefined` | – | Blend the image with the base map (0 = transparent, 1 = opaque). |
| `zIndex` | `number \| undefined` | – | Rendering order relative to other layers. |
| `zooms` | `[number, number] \| undefined` | – | Minimum and maximum zoom levels that keep the layer visible. |
| `options` | `Partial<AMap.ImageLayerOptions>` | `{}` | Extra JSAPI options forwarded to the image layer instance. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.ImageLayer` | Emitted once the image layer is created and attached to the map. |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const overlay = ref<'footprints' | 'satellite'>('footprints')
const opacity = ref(0.75)
const showOverlay = ref(true)
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell">
    <AmapImageLayer
      :url="overlay === 'footprints' ? 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay.png' : 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay-heat.png'"
      :bounds="overlay === 'footprints' ? [[116.357, 39.903], [116.412, 39.949]] : [[116.365, 39.897], [116.418, 39.946]]"
      :opacity="opacity"
      :visible="showOverlay"
      :z-index="120"
    />
  </AmapMap>
</template>
```

Switch the dropdown and slider in the example below to change imagery sources, adjust opacity, or temporarily hide the layer without destroying the instance.

<ClientOnly>
  <ImageLayerDemo />
</ClientOnly>

<script setup lang="ts">
import ImageLayerDemo from '../examples/ImageLayerDemo.vue'
</script>

### TypeScript signature

```ts
export interface ImageLayerProps {
  url: string
  bounds: BoundsLike
  visible?: boolean
  opacity?: number
  zIndex?: number
  zooms?: [number, number]
  options?: Partial<AMap.ImageLayerOptions>
}

type ImageLayerReadyPayload = AMap.ImageLayer
```

### Common pitfalls

- `bounds` must describe the south-west and north-east corners. When using city-level images, double-check longitude/latitude order.
- Keep the image URL HTTPS-accessible; browsers block insecure resources on secure origins.
- If you need to swap multiple overlays frequently, reuse a single component instance and update the `url`/`bounds` props instead of re-mounting.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
