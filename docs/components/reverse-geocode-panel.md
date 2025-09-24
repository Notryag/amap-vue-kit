# `<AmapReverseGeocodePanel>`

Combine forward and reverse geocoding in a ready-to-use panel. The component wraps `useGeocoder`, handles loading state, and renders a default UI that can be customised via slots or exposed methods.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `[number, number] \| undefined` | – | Coordinates used for reverse geocoding. |
| `address` | `string` | `''` | Optional address keyword for forward geocoding. |
| `auto` | `boolean` | `true` | Automatically trigger geocoding when props change. |
| `geocoderOptions` | `Partial<AMap.GeocoderOptions>` | `{}` | Custom options forwarded to the underlying geocoder. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions>> \| undefined` | – | Loader configuration when requesting the plugin. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Geocoder` | Fired once the geocoder instance is created. |
| `result` | `{ mode: 'forward' \| 'reverse', result: AMap.GeocoderResult \| null }` | Emitted whenever a geocode completes. |
| `error` | `string` | Emitted when the geocoder fails to resolve a request. |

## Usage

```vue
<AmapReverseGeocodePanel :position="position" @result="handleResult" />
```

The panel exposes imperative `search`, `reverse`, and `clear` methods via `ref` for advanced use cases.

<ClientOnly>
  <ReverseGeocodePanelDemo />
</ClientOnly>

<script setup lang="ts">
import ReverseGeocodePanelDemo from '../examples/ReverseGeocodePanelDemo.vue'
</script>

### TypeScript signature

```ts
export interface ReverseGeocodePanelProps {
  position?: [number, number]
  address?: string
  auto?: boolean
  geocoderOptions?: Partial<AMap.GeocoderOptions>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- Provide both `position` and `auto=false` if you plan to control lookups manually via the exposed `reverse` method.
- The default slot receives `result`, `loading`, `error`, `search`, and `reverse` helpers when you need custom layouts.
- Use the `result` event to synchronise the resolved address with other UI components.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
