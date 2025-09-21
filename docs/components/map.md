# `<AmapMap>`

`<AmapMap>` renders an interactive JSAPI map instance and provides context for nested overlays.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `center` | `LngLatLike \| undefined` | – | Initial center of the map. Accepts `[lng, lat]` or an `AMap.LngLat` instance. |
| `zoom` | `number \| undefined` | – | Initial zoom level. |
| `viewMode` | `'2D' \| '3D'` | `'2D'` | Map rendering mode. |
| `theme` | `string \| undefined` | – | Theme identifier registered with AMap. |
| `pitch` | `number \| undefined` | – | Initial pitch angle. |
| `rotation` | `number \| undefined` | – | Initial rotation angle. |
| `mapStyle` | `string \| undefined` | – | Custom style ID. |
| `plugins` | `string[]` | `[]` | Additional JSAPI plugins to load. |
| `loaderOptions` | `Partial<LoaderOptions>` | `{}` | Overrides passed to the shared loader (e.g. custom version). |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Map` | Emitted once the map instance is available. |
| `moveend` | `any` | Fires when map movement ends. |
| `click` | `any` | Map click events. |
| `complete` | `any` | Fired after all resources are loaded. |
| `error` | `any` | Emitted if the underlying JSAPI reports an error. |

## Usage

```vue
<script setup lang="ts">
import { AmapMap, AmapMarker } from '@amap-vue/core'

const center = [116.397, 39.908]
</script>

<template>
  <AmapMap :center="center" :zoom="11" style="height: 320px">
    <AmapMarker :position="center" />
  </AmapMap>
</template>
```

<ClientOnly>
  <BasicMapDemo />
</ClientOnly>

<script setup lang="ts">
import BasicMapDemo from '../examples/BasicMapDemo.vue'
</script>

### StackBlitz

[Open in StackBlitz](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
