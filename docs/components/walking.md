# `<AmapWalking>`

Plan walking routes with a built-in form and optional JSAPI panel. `<AmapWalking>` wraps [`useWalking`](/hooks/use-walking) and keeps the routing form reactive.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `origin` | `WalkingEndpoint` | `undefined` | Start point (address string or `LngLatLike`). |
| `destination` | `WalkingEndpoint` | `undefined` | End point (address string or `LngLatLike`). |
| `auto` | `boolean` | `true` | Automatically trigger routing whenever origin/destination changes. |
| `panel` | `boolean` | `true` | Render the native Walking result panel. |
| `options` | `Partial<AMap.WalkingOptions>` | `{}` | Extra JSAPI walking options such as `isOutline`, `hideMarkers`, etc. |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | `undefined` | Bind the route rendering to a map instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | Loader configuration for custom key/plugins. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Walking` | Fired once the Walking service is created. |
| `search` | `{ origin: WalkingEndpoint, destination: WalkingEndpoint, result: AMap.WalkingResult \| null }` | Fired after each routing request. |
| `error` | `string` | Emitted when the component cannot compute a route. |

## Usage

```vue
<AmapWalking :map="map" origin="天安门" destination="景山公园" :options="{ isOutline: true }" />
```

## Live example

<ClientOnly>
  <WalkingComponentDemo />
</ClientOnly>

<script setup lang="ts">
import WalkingComponentDemo from '../examples/WalkingComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface AmapWalkingProps {
  origin?: WalkingEndpoint
  destination?: WalkingEndpoint
  auto?: boolean
  panel?: boolean
  options?: Partial<AMap.WalkingOptions>
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- Provide the `map` prop to render walking paths on the map.
- Set `auto=false` and call the exposed `search` method if you want a custom trigger.
- Disable `panel` when rendering your own result list or summary.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
