# `usePlaceSearch`

Programmatically query POIs via the AMap PlaceSearch service. The composable supports keyword, nearby, and bounds searches while keeping pagination state on the JSAPI side.

```ts
import { usePlaceSearch } from '@amap-vue/hooks'

const placeSearch = usePlaceSearch({ city: '北京', pageSize: 5 })
const result = await placeSearch.search('咖啡')
console.log(result?.poiList?.pois)
```

## 参数

| Key | Type | Description |
| --- | --- | --- |
| ...`AMap.PlaceSearch.Options` | `Partial<AMap.PlaceSearch.Options>` | Native options including `city`, `type`, `pageSize`, etc. |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | Bind the search service to an existing map instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Forwarded to `loader.load` for custom keys or plugins. |

## Return value

| Key | Description |
| --- | --- |
| `placeSearch` | `ShallowRef<AMap.PlaceSearch \| null>` exposing the underlying service. |
| `search(keyword)` | Perform a keyword search. |
| `searchNearBy(keyword, center, radius)` | Perform a nearby search using a centre point and radius in metres. |
| `searchInBounds(keyword, bounds)` | Search within a rectangular bounds area. |
| `getDetails(poiId)` | Fetch POI details by ID. |
| `setOptions(options)` | Update native PlaceSearch options. |
| `setCity`, `setType`, `setPageIndex`, `setPageSize`, `setMap` | Convenience setters mapped to native methods. |
| `clear()` | Clear the built-in JSAPI overlays/panel. |
| `destroy()` | Dispose the instance and detach from the map. |

## 在线示例

<ClientOnly>
  <UsePlaceSearchHookDemo />
</ClientOnly>

<script setup lang="ts">
import UsePlaceSearchHookDemo from '../examples/hooks/UsePlaceSearchHookDemo.vue'
</script>

### 说明

- Remember to update `pageIndex` before triggering a new search when building custom pagination.
- Nearby searches require both `location` and `radius`; guard against missing props to avoid `no_data` responses.
- The hook does not cache results—callers should store POIs if they need to reuse them across views.

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
