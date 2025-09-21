# Getting Started

AMap Vue Kit wraps the [AMap JSAPI 2.x](https://lbs.amap.com/api/javascript-api/summary) with Vue 3 components and composables. Follow this guide to install the packages, register your API key, render a minimal map, and avoid common pitfalls during the first setup.

## Prerequisites

- Node.js 18+ and [pnpm](https://pnpm.io/) (other package managers work as well).
- An [AMap Web JSAPI key](https://lbs.amap.com/api/javascript-api/guide/create-project/get-key). You can optionally enable a security code in the AMap console and pass it through the loader.

## Install the packages

```bash
pnpm add @amap-vue/core @amap-vue/hooks @amap-vue/shared vue
```

> Use the equivalent `npm install` or `yarn add` command if you prefer a different package manager.

## Configure your AMap key

Register the key once at application bootstrap so every map shares the same loader instance:

```ts
// main.ts
import { loader } from '@amap-vue/shared'
import { createApp } from 'vue'
import App from './App.vue'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY, // optional
})

createApp(App).mount('#app')
```

The loader injects the JSAPI script only once, no matter how many maps are rendered. To fail fast when the CDN is unreachable, provide a `timeout` value (in milliseconds). The returned promise rejects so you can surface a friendly message to users:

```ts
loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  timeout: 15_000,
})
```

You can override individual calls with `loader.load({ timeout: 10_000 })` when a specific view requires stricter timeouts.

## Minimal example

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

`<AmapMap>` accepts the same options as `new AMap.Map()` and emits native events like `ready`, `moveend`, `click`, `complete`, and `error`. Nested overlays (markers, polylines, info windows…) automatically consume the closest map instance provided by `<AmapMap>`.

### StackBlitz

[Open the minimal example](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)

## Container sizing

The JSAPI requires an explicit height on the container element. Without it, the map renders as a blank square. Either apply inline styles or use a CSS class:

```css
.map-shell {
  height: 320px;
  width: 100%;
}
```

```vue
<template>
  <AmapMap class="map-shell" :center="[116.397, 39.908]" :zoom="11" />
</template>
```

When embedding the map inside flex layouts, make sure the parent elements also have non-zero heights.

## Use composables

Prefer the Composition API? `@amap-vue/hooks` exposes fine-grained helpers. Create the map via `useMap` and imperatively register overlays once the instance is ready:

```vue
<script setup lang="ts">
import { useMap, useMarker } from '@amap-vue/hooks'
import { ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)
const { map, ready } = useMap(() => ({
  container,
  center: [116.397, 39.908],
  zoom: 11,
}))

ready(() => {
  useMarker(() => map.value, { position: [116.397, 39.908] })
})
</script>

<template>
  <div ref="container" class="map-shell" />
</template>
```

All composables guard against SSR by lazily accessing the `window` object only after mount.

## Common errors

- **Map is blank** – the container (or its parents) lack a height. Apply the `map-shell` styles shown above.
- **"Missing key" warning** – call `loader.config({ key: 'YOUR_KEY' })` before rendering the first map. Development builds warn loudly to avoid silent failures.
- **Plugin not found** – ensure the plugin name is included in either the map `plugins` prop or the loader configuration. Components that require plugins (e.g. editors, heatmap) automatically request them, but manual JSAPI code must still call `map.plugin(...)`.
- **`SECURITY_ERROR` from JSAPI** – if you enabled a security code in the AMap console, pass it as `securityJsCode` to the loader.

With these fundamentals covered you can explore component and composable pages, advanced guides, and performance recipes tailored for high-traffic AMap applications.
