# `<AmapWeatherPanel>`

Display live and forecast weather with an opinionated panel that wraps `useWeather`. The component ships with a dropdown selector, refresh button, and exposes imperative methods for deeper integrations.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Currently selected city. Works with `v-model`. |
| `cities` | `string[]` | `['北京', '上海', '广州', '深圳']` | Preset list of selectable cities shown in the dropdown. |
| `auto` | `boolean` | `true` | Automatically fetch weather data when the component mounts or the city changes. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Custom loader configuration passed to `useWeather`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted when the user picks a different city. |
| `ready` | `AMap.Weather` | Fires once after the weather service is initialised. |
| `error` | `string` | Emitted whenever a fetch request fails or returns empty data. |

## Usage

```vue
<AmapWeatherPanel v-model="city" :cities="['北京', '上海', '深圳']" @error="handleError" />
```

The component exposes `weather`, `live`, `forecast`, `loading`, `error`, and `refresh` via `ref`. Pair it with [`useWeather`](/hooks/use-weather) if you need fine-grained control or background refreshes.

<ClientOnly>
  <WeatherPanelDemo />
</ClientOnly>

<script setup lang="ts">
import WeatherPanelDemo from '../examples/WeatherPanelDemo.vue'
</script>

### TypeScript signature

```ts
export interface WeatherPanelProps {
  modelValue?: string
  cities?: string[]
  auto?: boolean
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- Provide your `VITE_AMAP_KEY` and enable the `AMap.Weather` plugin before mounting the panel; otherwise no data will load.
- Use the `error` event to surface network or quota issues to users and consider retry strategies.
- When `auto` is `false`, call the exposed `refresh(city)` method manually after updating `modelValue`.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
