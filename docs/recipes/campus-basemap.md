# Campus Basemap

Large campuses or parks often rely on a custom illustrated plan instead of the default tiles. Combine a neutral map style with an image layer so visitors keep the familiar JSAPI gestures while navigating a bespoke base map.

```vue
<script setup lang="ts">
import { useImageLayer, useMap, useTileLayer } from '@amap-vue/hooks'
import { ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)

const { map, ready } = useMap(() => ({
  container,
  center: [121.49856, 31.23944],
  zoom: 17,
  viewMode: '3D',
  mapStyle: 'amap://styles/whitesmoke',
}))

// Hide the default base tiles so the plan is unobstructed.
useTileLayer(() => map.value, {
  visible: false,
})

const campusLayer = useImageLayer(() => map.value, {
  url: 'https://your-domain.example/assets/campus-plan.png',
  bounds: [
    [121.49693, 31.23863],
    [121.50019, 31.24022],
  ],
  opacity: 0.85,
})

ready(() => {
  campusLayer.show()
})
</script>

<template>
  <div ref="container" class="map" />
</template>

<style scoped>
.map {
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
```

Adjust the `bounds` to match the coordinates that enclose your artwork. Hosting the PNG or SVG under `public/` works well in Vite-based projects—swap the URL for `new URL('../assets/campus-plan.png', import.meta.url).href` when bundling locally.

## Tips

- Keep the original base map available in UI so users can switch back to satellite or vector tiles for orientation.
- Because image layers do not reproject, ensure your plan uses the GCJ-02 coordinate system to avoid drifting from overlays.
- Pair the plan with vector overlays (buildings, navigation paths) rendered by standard components so they stay interactive.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
