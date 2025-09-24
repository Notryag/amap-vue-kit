# `useWeather`

Query live and forecast weather information for a city from the JSAPI weather service. The composable handles plugin loading and exposes typed helpers for synchronous UIs or background refresh tasks.

```ts
import { useWeather } from '@amap-vue/hooks'

const weather = useWeather()

const live = await weather.getLive('北京')
const forecast = await weather.getForecast('北京')
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Loader configuration (key, securityJsCode, plugin list). |

## Return value

| Key | Description |
| --- | --- |
| `weather` | `ShallowRef<AMap.Weather \| null>` exposing the JSAPI instance. |
| `getLive(city)` | Fetch real-time weather conditions for the given city. |
| `getForecast(city)` | Fetch the 3-4 day forecast for the given city. |
| `destroy()` | Release the plugin instance and cached references. |

### Notes

- Both helpers return `null` if the JSAPI returns `no_data`; handle fallbacks in your UI.
- Batch multiple requests using `Promise.all` when displaying live and forecast data together.
- Pair with [`<AmapWeatherPanel>`](/components/weather-panel) for a prebuilt city selector and presentation layer.

## Live example

<ClientOnly>
  <UseWeatherHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseWeatherHookDemo from '../examples/hooks/UseWeatherHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
