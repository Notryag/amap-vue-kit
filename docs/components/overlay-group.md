# `<AmapOverlayGroup>`

Batch-manage large collections of overlays without juggling individual lifecycle hooks. The component wraps `AMap.OverlayGroup`,
allowing you to swap datasets, hide or show the whole group, and call imperative helpers through `ref`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `overlays` | `any[]` | `[]` | Array of JSAPI overlay instances to manage. Each item should be created with `new AMap.Marker(...)`, `new AMap.Circle(...)`, etc. |
| `visible` | `boolean` | `true` | Show or hide the entire group without rebuilding its contents. |
| `extData` | `any` | – | Arbitrary metadata forwarded to the underlying overlay group. |
| `options` | `Record<string, any>` | `{}` | Additional options passed to the JSAPI constructor. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.OverlayGroup` | Fired once the group instance is created and attached to the map. |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const overlays = ref<AMap.Marker[]>([])
const showGroup = ref(true)
const groupRef = ref<any>(null)

function clearGroup() {
  groupRef.value?.clearOverlays?.()
}
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell">
    <AmapOverlayGroup ref="groupRef" :overlays="overlays" :visible="showGroup" />
  </AmapMap>
  <button type="button" @click="clearGroup">
    Clear overlays
  </button>
</template>
```

Call the exposed methods on the component ref to mutate the group imperatively:

```ts
const api = groupRef.value
api?.addOverlays(nextBatch)
api?.clearOverlays()
api?.hide()
```

<ClientOnly>
  <OverlayGroupDemo />
</ClientOnly>

<script setup lang="ts">
import OverlayGroupDemo from '../examples/OverlayGroupDemo.vue'
</script>

### Exposed helpers

`<AmapOverlayGroup>` exposes the overlay group ref plus utility methods via `defineExpose`:

- `group` – shallow ref of the underlying `AMap.OverlayGroup`.
- `addOverlay(overlay)`, `addOverlays(overlays)` – append overlays in bulk.
- `removeOverlay(overlay)`, `removeOverlays(overlays)` – detach overlays from the group.
- `clearOverlays()` – remove every overlay managed by the group.
- `getOverlays()` – snapshot of the current overlay list.

### TypeScript signature

```ts
export interface OverlayGroupProps {
  overlays?: any[]
  visible?: boolean
  extData?: any
  options?: Record<string, any>
}

type OverlayGroupReadyPayload = AMap.OverlayGroup
```

### Common pitfalls

- Overlays must be instantiated before passing them to the component. When swapping datasets, dispose of the previous array (e.g. call `setMap(null)` on markers) to avoid leaks.
- The component does not render child content. Render interactive UIs elsewhere and mutate the `overlays` prop reactively.
- If you need per-overlay reactivity, combine `<AmapOverlayGroup>` with watchers that rebuild the overlays array whenever your data changes.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
