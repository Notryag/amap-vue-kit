# `useWalking`

Use the AMap Walking service programmatically. The composable lazily loads the walking plugin, binds to an optional map, and exposes helpers for searching and clearing routes.

```ts
import { useWalking } from '@amap-vue/hooks'

const walking = useWalking({ map })
const result = await walking.search('天安门', '景山公园')
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| ...`AMap.WalkingOptions` | `Partial<AMap.WalkingOptions>` | Native walking options such as `isOutline`, `hideMarkers`, etc. |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | Bind the walking service to an existing map instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Forwarded to `loader.load` for custom keys or plugins. |

## Return value

| Key | Description |
| --- | --- |
| `walking` | `ShallowRef<AMap.Walking \| null>` exposing the underlying service. |
| `search(origin, destination)` | Compute a walking route between two endpoints. |
| `setOptions(options)` | Update native walking options. |
| `setMap(map)` | Rebind the service to a different map instance. |
| `clear()` | Clear the rendered route and panel. |
| `destroy()` | Dispose the service and detach it from the map. |

## Live example

<ClientOnly>
  <UseWalkingHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseWalkingHookDemo from '../examples/hooks/UseWalkingHookDemo.vue'
</script>

### Notes

- Provide `map` so the walking route can render directly on the map.
- You can pass a custom `panel` element via `AMap.WalkingOptions` to show details.
- The hook resolves `null` when no route is found.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
