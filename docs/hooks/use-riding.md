# `useRiding`

Use the AMap Riding service programmatically. The composable loads the riding plugin on demand, supports map binding, and exposes helpers for searching and clearing routes.

```ts
import { useRiding } from '@amap-vue/hooks'

const riding = useRiding({ map })
const result = await riding.search('天安门', '北海公园')
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| ...`AMap.RidingOptions` | `Partial<AMap.RidingOptions>` | Native riding options such as `policy`, `hideMarkers`, etc. |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | Bind the riding service to an existing map instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Forwarded to `loader.load` for custom keys or plugins. |

## Return value

| Key | Description |
| --- | --- |
| `riding` | `ShallowRef<AMap.Riding \| null>` exposing the underlying service. |
| `search(origin, destination)` | Compute a riding route between two endpoints. |
| `setOptions(options)` | Update native riding options. |
| `setMap(map)` | Rebind the service to a different map instance. |
| `clear()` | Clear the rendered route and panel. |
| `destroy()` | Dispose the service and detach it from the map. |

## Live example

<ClientOnly>
  <UseRidingHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseRidingHookDemo from '../examples/hooks/UseRidingHookDemo.vue'
</script>

### Notes

- Provide `map` to render cycling routes on the map.
- Supply a custom `panel` element via `AMap.RidingOptions` if you want result summaries.
- The hook resolves `null` when no route is found.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
