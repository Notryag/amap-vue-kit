# `<AmapDriving>`

Plan driving routes with a built-in form and optional result panel. `<AmapDriving>` wraps [`useDriving`](/hooks/use-driving), handles user input, and renders the JSAPI Driving panel when enabled.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `origin` | `DrivingEndpoint` | `undefined` | Start point (address string or `LngLatLike`). |
| `destination` | `DrivingEndpoint` | `undefined` | End point (address string or `LngLatLike`). |
| `auto` | `boolean` | `true` | Automatically trigger routing whenever origin/destination changes. |
| `panel` | `boolean` | `true` | Render the native Driving result panel. |
| `options` | `Partial<AMap.DrivingOptions>` | `{}` | Extra JSAPI driving options such as `policy`, `ferry`, etc. |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | `undefined` | Bind the route rendering to a map instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | Loader configuration for custom key/plugins. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Driving` | Fired once the Driving service is created. |
| `search` | `{ origin: DrivingEndpoint, destination: DrivingEndpoint, result: AMap.DrivingResult \| null }` | Fired after each routing request. |
| `error` | `string` | Emitted when the component cannot compute a route. |

## Usage

```vue
<AmapDriving :map="map" origin="天安门" destination="故宫" :options="{ policy: 0 }" />
```

## Live example

<ClientOnly>
  <DrivingComponentDemo />
</ClientOnly>

<script setup lang="ts">
import DrivingComponentDemo from '../examples/DrivingComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface AmapDrivingProps {
  origin?: DrivingEndpoint
  destination?: DrivingEndpoint
  auto?: boolean
  panel?: boolean
  options?: Partial<AMap.DrivingOptions>
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- Provide the `map` prop if you want the route line rendered on an existing `<AmapMap>` instance.
- Set `auto=false` when you need manual control and call the exposed `search` method.
- Disable `panel` and supply your own slot layout if you want to render a custom result panel.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
