# Loca & Visualizations

Loca builds on top of JSAPI WebGL capabilities to render dense visualizations. The shared loader exposes a `loca` option to request the Loca script together with the base JSAPI.

```ts
import { loader } from '@amap-vue/shared'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  loca: true
})
```

From there you can instantiate `Loca.Container` instances inside `ready` callbacks. Future releases of AMap Vue Kit will ship dedicated helpers for common visualizations.

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
- Remember to destroy layers during unmount to release WebGL resources.
