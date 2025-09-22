# `useTileLayer`, `useTrafficLayer`, `useRoadNetLayer`, `useSatelliteLayer`

The tile layer hooks wrap the JSAPI tile overlays so you can imperatively toggle imagery, traffic, and vector road grids from the Composition API.

## Basic usage

```ts
import { useMap, useTileLayer, useTrafficLayer } from '@amap-vue/hooks'
import { ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)

const { map, ready } = useMap(() => ({
  container,
  center: [116.397, 39.908],
  zoom: 11,
}))

const baseLayer = useTileLayer(() => map.value, {
  tileUrl: 'https://your.tiles/{z}/{x}/{y}.png',
  opacity: 0.8,
})

const traffic = useTrafficLayer(() => map.value, {
  visible: false,
  autoRefresh: true,
  interval: 120,
})

ready(() => {
  traffic.show()
})

// Later in your component you can hide/show layers reactively
baseLayer.setOpacity(0.6)
traffic.hide()
```

The hook defers instantiation until both the map instance and JSAPI script are available. Specialized hooks automatically request the necessary plugins (`AMap.TileLayer.Traffic`, `AMap.TileLayer.Satellite`, etc.).

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean \| undefined` | `true` | Initial visibility of the layer. |
| `opacity` | `number \| undefined` | – | Blend value between `0` (transparent) and `1` (opaque). |
| `zIndex` | `number \| undefined` | – | Rendering order relative to other overlays. |
| `tileUrl` | `string \| ((x: number, y: number, level: number) => string) \| undefined` | – | URL template or resolver for custom sources. |
| `getTileUrl` | `(x: number, y: number, level: number) => string \| undefined` | – | Alternative callback for dynamic URLs. Ignored when `tileUrl` is provided. |
| `options` | `Partial<AMap.TileLayerOptions>` | `{}` | Pass through any additional JSAPI options (`zooms`, `detectRetina`, etc.). |

`useTrafficLayer` extends the base options with `autoRefresh`, `interval`, and `options: Partial<AMap.TileLayer.Traffic.Options>`. `useSatelliteLayer` and `useRoadNetLayer` accept the same options as `useTileLayer`.

## Return value

| Key | Type | Description |
| --- | --- | --- |
| `overlay` | `ShallowRef<AMap.TileLayer \| null>` | Reactive reference to the layer instance. Each variant narrows this type. |
| `show` / `hide` | `() => void` | Toggle the layer without destroying it. |
| `reload` | `() => void` | Force the JSAPI to refetch tiles (available on standard layers). |
| `setOpacity` | `(opacity: number \| undefined) => void` | Update the opacity in place. |
| `setZIndex` | `(zIndex: number \| undefined) => void` | Adjust rendering order. |
| `setTileUrl` | `(url: string \| ((x: number, y: number, level: number) => string) \| undefined) => void` | Switch the tile source on the fly. |
| `setOptions` | `(options: Partial<AMap.TileLayerOptions>) => void` | Forward updates to the underlying instance. |
| `on` / `off` | `(event: string, handler: (event: any) => void)` | Subscribe to and unsubscribe from JSAPI events. |
| `destroy` | `() => void` | Remove the layer from the map and clean up listeners. |

## Variants

- **`useTrafficLayer`** – Enables congestion overlays. Combine with `autoRefresh` and `interval` to pull fresh data on a schedule.
- **`useRoadNetLayer`** – Draws road boundaries above themed base maps. Useful when the base style removes outlines.
- **`useSatelliteLayer`** – Switches to satellite imagery tiles while keeping vector overlays intact.

Each variant returns the same API surface while narrowing `overlay.value` to the concrete JSAPI class.

## Live example

<ClientOnly>
  <UseTileLayerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseTileLayerHookDemo from '../examples/hooks/UseTileLayerHookDemo.vue'
</script>

## TypeScript signature

```ts
import type { OverlayLifecycle } from '@amap-vue/hooks'
import type { MaybeRefOrGetter } from 'vue'

export interface UseTileLayerOptions extends Partial<AMap.TileLayerOptions> {
  visible?: boolean
}

export interface UseTileLayerReturn<TLayer extends AMap.TileLayer = AMap.TileLayer>
  extends OverlayLifecycle<TLayer> {
  show: () => void
  hide: () => void
  reload: () => void
  setOpacity: (opacity: number | undefined) => void
  setZIndex: (zIndex: number | undefined) => void
  setTileUrl: (
    url: string | ((x: number, y: number, level: number) => string) | undefined
  ) => void
  setOptions: (options: Partial<AMap.TileLayerOptions>) => void
}

export interface UseTrafficLayerOptions
  extends UseTileLayerOptions, Partial<AMap.TileLayer.Traffic.Options> {}

export function useTileLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn

export function useTrafficLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTrafficLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.Traffic>

export function useSatelliteLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.Satellite>

export function useRoadNetLayer(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options: MaybeRefOrGetter<UseTileLayerOptions>,
): UseTileLayerReturn<AMap.TileLayer.RoadNet>
```

All types shown above are re-exported from `@amap-vue/hooks`, while `AMap.*` types come from the JSAPI ambient declarations.

## Common pitfalls

- Always pass a map reference (`() => map.value`) instead of the raw map to guard against SSR and deferred mount.
- Avoid calling both `tileUrl` and `getTileUrl`; the hook prioritizes `getTileUrl` only when `tileUrl` is undefined.
- Traffic layers poll the network when `autoRefresh` is enabled—pause it when the view is hidden to reduce quota usage.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
