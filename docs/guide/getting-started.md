# Getting Started

AMap Vue Kit provides Vue 3 components and composables on top of the [AMap JSAPI 2.x](https://lbs.amap.com/api/javascript-api/summary). This guide walks you through installing the packages, configuring your API key, and rendering your first map.

## Installation

```bash
pnpm add @amap-vue/core @amap-vue/hooks @amap-vue/shared vue
```

If you are using `npm` or `yarn`, substitute the install command accordingly.

## Configure the loader

Before creating any maps, configure the shared loader with your [AMap Web JSAPI key](https://lbs.amap.com/api/javascript-api/guide/create-project/get-key):

```ts
import { loader } from '@amap-vue/shared'
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0'
})

createApp(App).mount('#app')
```

The loader ensures that the JSAPI script is injected only once, even when multiple maps are rendered across your application.

If you want to fail fast when the JSAPI cannot be reached, provide a `timeout` (in milliseconds). The loader will reject when the script does not load within that window so you can surface a friendly message to users:

```ts
loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  timeout: 15000,
})
```

You can also pass the same option to individual `loader.load()` calls when you need a per-request override.

## Render a map

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

The `<AmapMap>` component accepts all standard JSAPI map options and emits native AMap events (`ready`, `moveend`, `click`, `complete`, and `error`). Child overlays such as `<AmapMarker>` automatically register with the nearest map instance.

## Use composables

Prefer the Composition API? The `@amap-vue/hooks` package exposes the same functionality through composables:

```vue
<script setup lang="ts">
import { useMap, useMarker } from '@amap-vue/hooks'
import { ref } from 'vue'

const mapContainer = ref<HTMLDivElement | null>(null)
const { map, ready } = useMap(() => ({
  container: mapContainer,
  center: [116.397, 39.908],
  zoom: 11
}))

ready(() => {
  useMarker(() => map.value, {
    position: [116.397, 39.908]
  })
})
</script>

<template>
  <div ref="mapContainer" style="height: 320px" />
</template>
```

With the basics in place you are ready to explore the component and composable documentation, advanced guides, and performance tips.
