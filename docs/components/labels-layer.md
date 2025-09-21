# `<AmapLabelsLayer>`

Render hundreds of rich text markers with GPU-accelerated performance. The labels layer batches all `LabelMarker` instances and
handles collision detection so the map remains responsive even with dense datasets.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Toggles whether the layer is displayed on the map. |
| `opacity` | `number \| undefined` | – | Blend the layer against the base map. |
| `zIndex` | `number \| undefined` | – | Rendering order when stacking multiple layers. |
| `zooms` | `[number, number] \| undefined` | – | Minimum and maximum zoom levels that keep the layer visible. |
| `collision` | `boolean \| undefined` | – | Enable JSAPI collision avoidance between label markers. |
| `allowCollision` | `boolean \| undefined` | – | Force labels to overlap even when collisions are detected. |
| `options` | `Partial<AMap.LabelsLayerOptions>` | `{}` | Extra JSAPI options forwarded to the underlying layer. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.LabelsLayer` | Fired once the layer instance is created and attached to the map. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="13" class="map-shell">
  <AmapLabelsLayer :collision="true">
    <AmapLabelMarker
      v-for="office in offices"
      :key="office.id"
      :position="office.position"
      :text="{
        content: office.name,
        direction: 'top',
        offset: [0, -12]
      }"
    />
  </AmapLabelsLayer>
</AmapMap>
```

Use the `visible` and `collision` props to toggle visibility and overlap rules without recreating the layer. Individual label ma
rkers can also control their own visibility using the `visible` prop.

<ClientOnly>
  <LabelsLayerDemo />
</ClientOnly>

<script setup lang="ts">
import LabelsLayerDemo from '../examples/LabelsLayerDemo.vue'
</script>

### TypeScript signature

```ts
export interface LabelsLayerProps {
  visible?: boolean
  opacity?: number
  zIndex?: number
  zooms?: [number, number]
  collision?: boolean
  allowCollision?: boolean
  options?: Partial<AMap.LabelsLayerOptions>
}
```

### Common pitfalls

- Mount `<AmapLabelsLayer>` inside `<AmapMap>` so the injected map instance is available.
- Collision detection only applies to label markers inside the same layer. Create separate layers when combining different data
sets.
- Remember to configure the AMap loader with the `AMap.LabelsLayer` plugin if you instantiate the layer manually. The component
requests it automatically.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
