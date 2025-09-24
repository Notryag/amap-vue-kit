# `useGeolocation`

Access the JSAPI geolocation service with a Composition API friendly wrapper. The hook loads `AMap.Geolocation` on demand, exposes promise utilities, and keeps watcher IDs manageable for you.

```ts
import { useGeolocation } from '@amap-vue/hooks'

const geolocation = useGeolocation({ enableHighAccuracy: true })

const result = await geolocation.getCurrentPosition()
if (result)
  console.log(result.position.toString())
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Loader configuration for custom keys, plugins, or security codes. |
| ...`AMap.GeolocationOptions` | `Partial<AMap.GeolocationOptions>` | All native options such as `timeout`, `zoomToAccuracy`, or `GeoLocationFirst`. |

## Return value

| Key | Description |
| --- | --- |
| `geolocation` | `ShallowRef<AMap.Geolocation \| null>` with the instantiated plugin. |
| `getCurrentPosition()` | Promise that resolves with a single geolocation snapshot. |
| `watchPosition(handler)` | Start continuous tracking; resolves with a numeric watch ID or `null`. |
| `clearWatch(id?)` | Stop one watcher or all of them when no ID is provided. |
| `getCityInfo()` | Fetch the current province/city metadata. |
| `setOptions(options)` | Update plugin configuration without re-instantiating. |
| `destroy()` | Clear watchers and release the plugin instance. |

### Notes

- Always call `clearWatch`/`destroy` when a component unmounts to prevent background timers.
- Combine with `<AmapWeatherPanel>` or custom overlays by reacting to the resolved coordinates.
- Some browsers require HTTPS and explicit user consent before geolocation results are available.

## Live example

<ClientOnly>
  <UseGeolocationHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseGeolocationHookDemo from '../examples/hooks/UseGeolocationHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
