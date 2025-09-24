# `<AmapDistrictLayer>`

Wrap the JSAPI administrative district layer plugin with reactive props for `type`, `adcode`, and styling. The component makes it easy to toggle between country, province, and city visualisations without imperative code.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'World' \| 'Country' \| 'Province' \| 'City' \| 'District'` | `'Country'` | Selects which district layer variant to instantiate. |
| `adcode` | `string \| number \| Array<string \| number> \| undefined` | `undefined` | Administrative code(s) to render. When omitted the default view for the chosen type is used. |
| `depth` | `number \| undefined` | – | Depth of sub-districts to include. |
| `styles` | `Record<string, any> \| undefined` | – | Style map passed directly to the JSAPI layer. |
| `visible` | `boolean` | `true` | Controls layer visibility without destroying it. |
| `options` | `Partial<AMap.DistrictLayerOptions>` | `{}` | Additional plugin options such as `opacity` or `zooms`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.DistrictLayer` | Fired when the layer instance becomes available. |
| `complete` | `any` | Re-emitted when the underlying layer triggers `complete`. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="6">
  <AmapDistrictLayer
    type="Province"
    adcode="110000"
    :depth="2"
    :styles="{ fill: 'rgba(59, 130, 246, 0.12)', stroke: '#2563eb' }"
  />
</AmapMap>
```

Switching the `type` or `adcode` props automatically calls the relevant JSAPI setters and keeps the existing instance around for snappy updates.

<ClientOnly>
  <DistrictLayerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import DistrictLayerComponentDemo from '../examples/DistrictLayerComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface DistrictLayerProps {
  type?: DistrictLayerType
  adcode?: string | number | Array<string | number>
  depth?: number
  styles?: Record<string, any>
  visible?: boolean
  options?: Partial<AMap.DistrictLayerOptions>
}
```

### Common pitfalls

- Set `depth` to `2` or `3` when drilling into provinces or cities; otherwise sub-districts may not render.
- Combine `styles` with opacity in `options` to create subtle base maps that still highlight boundaries.
- When animating between regions, reuse the same `AmapDistrictLayer` instance to avoid flashing.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
