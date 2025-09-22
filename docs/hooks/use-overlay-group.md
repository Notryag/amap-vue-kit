# `useOverlayGroup`

Group and manage batches of overlays with a single composable. `useOverlayGroup` wraps `AMap.OverlayGroup`, queues updates when the overlays array changes, and gives you imperative helpers for high-volume operations.

```ts
const overlayGroup = useOverlayGroup(() => map.value, () => ({
  overlays: markers.value,
  visible: showGroup.value,
  extData: { type: 'points-of-interest' },
}))

overlayGroup.addOverlay(createMarker(feature))
overlayGroup.clearOverlays()
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `overlays` | `any[]` | Array of JSAPI overlays managed by the group. |
| `visible` | `boolean` | Show or hide the group without destroying it. |
| `extData` | `any` | Arbitrary metadata forwarded to the JSAPI group. |
| `…options` | `Record<string, any>` | Additional constructor options passed straight through. |

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.OverlayGroup \| null>` referencing the overlay group instance. |
| `show()` / `hide()` | Toggle group visibility. |
| `addOverlay(overlay)` / `addOverlays(overlays)` | Append overlays to the group. |
| `removeOverlay(overlay)` / `removeOverlays(overlays)` | Remove specific overlays from the group. |
| `clearOverlays()` | Remove every overlay the group manages. |
| `getOverlays()` | Snapshot of the current overlays array. |
| `setExtData(extData)` | Update the group's metadata. |
| `destroy()` | Dispose of the overlay group and detach listeners. |

### Notes

- The hook clears and readds overlays when the reactive `overlays` array changes, ensuring the JSAPI group stays in sync.
- Combine the hook with the loader helpers to instantiate overlays lazily after the JSAPI bundle is ready.
- Call `destroy()` or `clearOverlays()` when tearing down large datasets to avoid leaving detached markers on the map.

## Live example

<ClientOnly>
  <UseOverlayGroupHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseOverlayGroupHookDemo from '../examples/hooks/UseOverlayGroupHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
