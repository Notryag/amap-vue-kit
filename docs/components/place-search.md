# `<AmapPlaceSearch>`

Search points of interest with pagination, optional nearby/bounds modes, and a ready-to-use panel UI. Internally it orchestrates [`usePlaceSearch`](/hooks/use-place-search), handles debouncing, and exposes renderless slots for custom rendering.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Current keyword. Works with `v-model`. |
| `mode` | `'keyword' \| 'nearby' \| 'bounds'` | `'keyword'` | Select the search strategy: regular keyword search, nearby by `location + radius`, or bounds search. |
| `location` | `LngLatLike` | `undefined` | Centre point used when `mode="nearby"`. |
| `radius` | `number` | `1000` | Search radius in metres for nearby mode. |
| `bounds` | `BoundsLike` | `undefined` | Rectangular bounds used when `mode="bounds"`. |
| `auto` | `boolean` | `true` | Trigger searches automatically when inputs change. |
| `debounce` | `number` | `300` | Debounce interval (ms) before firing a search. |
| `placeholder` | `string` | `'搜索地点、地址或兴趣点'` | Placeholder text for the built-in input. |
| `options` | `Partial<AMap.PlaceSearchOptions>` | `{}` | Native PlaceSearch options like `city`, `type`, `pageSize`, etc. |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | `undefined` | Associate the search results with an existing `<AmapMap>` instance (for automatic markers). |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | Extra loader configuration. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted whenever the keyword changes. |
| `ready` | `AMap.PlaceSearch` | Fires once after the PlaceSearch instance is created. |
| `search` | `{ keyword: string, result: AMap.PlaceSearchResult \| null }` | Fired after each search (including empty or failed responses). |
| `select` | `AMap.PlaceSearchPoi` | Fired when a POI is clicked in the default template. |
| `error` | `string` | Emitted whenever the JSAPI reports an error. |

## Usage

```vue
<AmapPlaceSearch v-model="keyword" mode="nearby" :location="center" :radius="1500" @select="handlePoi" />
```

<ClientOnly>
  <PlaceSearchDemo />
</ClientOnly>

<script setup lang="ts">
import PlaceSearchDemo from '../examples/PlaceSearchDemo.vue'
</script>

### TypeScript signature

```ts
export interface AmapPlaceSearchProps {
  modelValue?: string
  mode?: 'keyword' | 'nearby' | 'bounds'
  location?: LngLatLike
  radius?: number
  bounds?: BoundsLike
  auto?: boolean
  debounce?: number
  placeholder?: string
  options?: Partial<AMap.PlaceSearchOptions>
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- When using `mode="nearby"`, keep the `radius` reasonable (≤ 3000m) to avoid slow responses.
- Provide the `map` prop if you want native PlaceSearch to render POI markers automatically; otherwise, handle results through slots.
- Call the exposed `goToPage(page)` method to implement custom pagination controls.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
