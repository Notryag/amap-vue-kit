# `<AmapRiding>`

Plan cycling routes with a built-in form and optional JSAPI panel. `<AmapRiding>` wraps [`useRiding`](/hooks/use-riding), handles search state, and reports routing results.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `origin` | `RidingEndpoint` | `undefined` | Start point (address string or `LngLatLike`). |
| `destination` | `RidingEndpoint` | `undefined` | End point (address string or `LngLatLike`). |
| `auto` | `boolean` | `true` | Automatically trigger routing whenever origin/destination changes. |
| `panel` | `boolean` | `true` | Render the native Riding result panel. |
| `options` | `Partial<AMap.RidingOptions>` | `{}` | Extra JSAPI riding options such as `policy`, `hideMarkers`, etc. |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | `undefined` | Bind the route rendering to a map instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | Loader configuration for custom key/plugins. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Riding` | Fired once the Riding service is created. |
| `search` | `{ origin: RidingEndpoint, destination: RidingEndpoint, result: AMap.RidingResult \| null }` | Fired after each routing request. |
| `error` | `string` | Emitted when the component cannot compute a route. |

## Usage

```vue
<AmapRiding :map="map" origin="天安门" destination="北海公园" :options="{ policy: 0 }" />
```

## Live example

<ClientOnly>
  <RidingComponentDemo />
</ClientOnly>

<script setup lang="ts">
import RidingComponentDemo from '../examples/RidingComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface AmapRidingProps {
  origin?: RidingEndpoint
  destination?: RidingEndpoint
  auto?: boolean
  panel?: boolean
  options?: Partial<AMap.RidingOptions>
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- Provide the `map` prop if you want the cycling path rendered on the map.
- Set `auto=false` to disable automatic routing and call `search` manually.
- Disable `panel` when you plan to build a custom panel UI.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
