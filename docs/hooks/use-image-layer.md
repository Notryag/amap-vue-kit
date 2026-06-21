# `useImageLayer`

Create and control `AMap.ImageLayer` overlays from the Composition API. The hook watches reactive options, converts `BoundsLike`
inputs, and exposes imperative setters for fine-grained tweaks.

```ts
import { useImageLayer } from '@amap-vue/hooks'

const imageLayer = useImageLayer(() => map.value, () => ({
  url: currentOverlay.value.url,
  bounds: currentOverlay.value.bounds,
  opacity: 0.7,
  visible: showOverlay.value,
}))

watch(currentOverlay, (next) => {
  imageLayer.setImageUrl(next.url)
  imageLayer.setBounds(next.bounds)
})
```

## 参数

| Key | Type | Description |
| --- | --- | --- |
| `url` | `string` | Image URL to display. |
| `bounds` | `BoundsLike` | Geographic bounds of the image. Arrays are converted to `AMap.Bounds`. |
| `visible` | `boolean` | Show or hide the overlay. |
| `opacity` | `number` | Blend the image against the base map. |
| `zIndex` | `number` | Rendering order. |
| `…options` | `Partial<AMap.ImageLayerOptions>` | Additional JSAPI options forwarded during creation. |

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.ImageLayer \| null>` referencing the image layer instance. |
| `show()` / `hide()` | Toggle visibility without recreating the layer. |
| `setImageUrl(url)` | Swap the image URL at runtime. |
| `setBounds(bounds)` | Update the geographic bounds (`BoundsLike` accepted). |
| `set透明度(opacity)` | Adjust opacity dynamically. |
| `setzIndex(zIndex)` | Raise or lower the layer relative to others. |
| `setOptions(options)` | Forward arbitrary options to the JSAPI instance. |
| `destroy()` | Remove the layer from the map and release references. |

### 说明

- The hook automatically requests the `AMap.ImageLayer` plugin the first time it runs.
- When the map reference becomes `null` the layer detaches itself and reattaches once a new map instance is provided.
- Bounds and offsets are normalised via the shared helpers from `@amap-vue/shared`, so you can safely pass array shorthand values.

## 在线示例

<ClientOnly>
  <UseImageLayerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseImageLayerHookDemo from '../examples/hooks/UseImageLayerHookDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
