# `<AmapToolBar>`, `<AmapScale>`, `<AmapControlBar>`, `<AmapMapType>`

These wrapper components expose the built-in JSAPI map controls so you can toggle navigation chrome without writing imperative code. Each control automatically loads the required plugin, attaches itself to the nearest `<AmapMap>`, and tears down on unmount.

## Shared props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Shows or hides the control without destroying it. |
| `position` | `'LT' \| 'RT' \| 'LB' \| 'RB' \| undefined` | – | Corner of the map to anchor to (Left/Right × Top/Bottom). |
| `offset` | `PixelLike \| undefined` | – | Pixel offset from the anchor corner. Accepts `[x, y]` arrays or `AMap.Pixel`. |
| `options` | `Partial<UseToolBarOptions \| UseScaleOptions \| UseControlBarOptions \| UseMapTypeOptions>` | `{}` | Extra JSAPI options passed to the control. Each component narrows this union to its concrete hook type (see below). |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.ToolBar \| AMap.Scale \| AMap.ControlBar \| AMap.MapType` | Emits once the control is created and added to the map. |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showZoomBar = ref(true)
const showControlButton = ref(true)
const mapTypeDefaultType = ref<0 | 1>(0)
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="12" style="height: 320px">
    <AmapToolBar position="RT" :offset="[16, 16]" />
    <AmapScale :offset="[16, 86]" />
    <AmapControlBar
      :show-zoom-bar="showZoomBar"
      :show-control-button="showControlButton"
    />
    <AmapMapType
      :default-type="mapTypeDefaultType"
      :show-traffic="false"
      :show-road="true"
    />
  </AmapMap>
</template>
```

Toggle the props reactively to reposition the controls, reveal advanced toggles, or hide them without destroying the underlying JSAPI instance.

<ClientOnly>
  <ControlsDemo />
</ClientOnly>

<script setup lang="ts">
import ControlsDemo from '../examples/ControlsDemo.vue'
</script>

### Component-specific props

- **`<AmapControlBar>`** — Accepts `showZoomBar` and `showControlButton` to fine-tune the zoom slider and rotation/tilt switch. Provide extra ControlBar options (such as `liteStyle`) through `options: Partial<UseControlBarOptions>`.
- **`<AmapMapType>`** — Supports `defaultType` (0 = standard, 1 = satellite), `showTraffic`, and `showRoad` to expose quick toggles on the control. Additional MapType options (like custom layer lists) can also be passed via `options: Partial<UseMapTypeOptions>`.

### Positioning tips

- Align multiple controls by reusing the same `position` and staggering them with incremental `offset` values.
- The offset `[x, y]` values are measured in CSS pixels from the anchor corner. Use positive `y` values to push controls downward when anchored at the top.
- Controls can be mixed and matched—e.g. keep `<AmapToolBar>` on `RT` while anchoring `<AmapScale>` to `LB` to avoid overlapping overlays.

### Common pitfalls

- Controls must live within `<AmapMap>` so they can access the injected map context. A warning is emitted in development when the context is missing.
- Loading the same control twice in one corner without adjusting `offset` will stack them. Offset each instance or hide duplicates based on breakpoints.
- When pairing `<AmapMapType>` with `<AmapTrafficLayer>`, prefer the control's built-in traffic toggle (`showTraffic`) to avoid conflicting state.

### TypeScript signature

```ts
export interface ToolBarProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  options?: Partial<UseToolBarOptions>
}

export interface ScaleProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  options?: Partial<UseScaleOptions>
}

export interface ControlBarProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  showZoomBar?: boolean
  showControlButton?: boolean
  options?: Partial<UseControlBarOptions>
}

export interface MapTypeProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  defaultType?: number
  showTraffic?: boolean
  showRoad?: boolean
  options?: Partial<UseMapTypeOptions>
}

type ControlReadyPayload = AMap.ToolBar | AMap.Scale | AMap.ControlBar | AMap.MapType
```

These interfaces reuse the shared `PixelLike` type from `@amap-vue/shared` and hook option types exported by `@amap-vue/hooks`.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
