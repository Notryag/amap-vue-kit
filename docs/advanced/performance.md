# Performance Guide

1. **Batch updates** – prefer updating reactive props and watchers instead of imperatively mutating overlays in loops. The components queue updates and run them in microtasks.
2. **Reuse the loader** – call `loader.config` once at bootstrap; avoid passing conflicting plugin arrays to every map to prevent redundant network requests.
3. **Prefer Mass Markers** – for >1,000 points use `useMassMarkers` or cluster overlays; standard markers are intended for small batches.
4. **Enable WebGL features** – set `viewMode="3D"` and configure `pitch` and `rotation` when using WebGL-based visualizations.
5. **Use `destroy` hooks** – both components and composables clean up automatically, but when working with raw JSAPI instances always call `destroy` to prevent memory leaks.

## Live example

<ClientOnly>
  <PerformancePlaygroundDemo />
</ClientOnly>

<script setup lang="ts">
import PerformancePlaygroundDemo from '../examples/advanced/PerformancePlaygroundDemo.vue'
</script>
