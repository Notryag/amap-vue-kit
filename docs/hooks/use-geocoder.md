# `useGeocoder`

Perform forward and reverse geocoding without leaving the Composition API. The composable lazily loads the `AMap.Geocoder` plugin, exposes promise-based helpers, and can be paired with `<AmapReverseGeocodePanel>` for a ready-to-use UI.

```ts
import { useGeocoder } from '@amap-vue/hooks'

const geocoder = useGeocoder({
  city: '北京',
})

const result = await geocoder.getLocation('天安门')
if (result)
  console.log(result.geocodes[0].location)
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Extra loader configuration (key, security code, plugins). |
| ...`AMap.GeocoderOptions` | `Partial<AMap.GeocoderOptions>` | All native geocoder options such as `batch`, `extensions`, or default `city`. |

## Return value

| Key | Description |
| --- | --- |
| `geocoder` | `ShallowRef<AMap.Geocoder \| null>` with the underlying instance. |
| `getLocation(address, city?)` | Resolve an address string to geocodes (forward geocoding). |
| `getAddress(position)` | Resolve coordinates to a readable address (reverse geocoding). |
| `setOptions(options)` | Patch the geocoder options at runtime. |
| `destroy()` | Dispose the instance and release references. |

### Notes

- `getLocation` and `getAddress` return `null` when the JSAPI reports `no_data`; guard your UI accordingly.
- Call `setOptions` when switching between cities or toggling the `extensions` flag instead of re-creating the hook.
- Combine with [`<AmapReverseGeocodePanel>`](/components/reverse-geocode-panel) for an opinionated panel with built-in loading and error states.

## Live example

<ClientOnly>
  <UseGeocoderHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseGeocoderHookDemo from '../examples/hooks/UseGeocoderHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
