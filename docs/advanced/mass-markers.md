# Mass Markers

Mass markers allow you to render tens of thousands of points efficiently by delegating rendering to the JSAPI.

```ts
import { useMassMarkers } from '@amap-vue/hooks'

const mass = useMassMarkers(() => map.value, () => ({
  data: points,
  style: [{
    url: 'https://a.amap.com/jsapi_demos/static/resource/img/markers/mark_b.png',
    anchor: [6, 6],
    size: [11, 11]
  }]
}))
```

Use the composable inside `ready` handlers to ensure the map exists before instantiation. Mass markers share the loader so additional plugins are only requested once.

## Live example

<ClientOnly>
  <UseMassMarkersHookDemo />
</ClientOnly>

## Mass markers vs labels layer

Switch between high-density mass markers and rich label markers using the same dataset.

<ClientOnly>
  <MassMarksComparisonDemo />
</ClientOnly>

<script setup lang="ts">
import UseMassMarkersHookDemo from '../examples/hooks/UseMassMarkersHookDemo.vue'
import MassMarksComparisonDemo from '../examples/MassMarksComparisonDemo.vue'
</script>

### Tips

- Use multiple style entries to support conditional colouring via the data `style` index.
- Keep `extData` payloads tiny—mass markers shine when each row is a few numbers rather than complex objects.
- Call `setData` with a new array when streaming updates from the server; the plugin reuses internal buffers.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
