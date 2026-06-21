# `useRiding`

Use the AMap Riding service programmatically. The composable loads the riding plugin on demand, supports map binding, and exposes helpers for searching and clearing routes.

```ts
import { useRiding } from '@amap-vue/hooks'

const riding = useRiding({ map })
const result = await riding.search('天安门', '北海公园')
```

## 参数

| Key | Type | Description |
| --- | --- | --- |
| ...`AMap.Riding.Options` | `Partial<AMap.Riding.Options>` | Native riding options such as `policy`, `hideMarkers`, etc. |
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

## 在线示例

<ClientOnly>
  <UseRidingHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseRidingHookDemo from '../examples/hooks/UseRidingHookDemo.vue'
</script>

### 说明

- Provide `map` to render cycling routes on the map.
- Supply a custom `panel` element via `AMap.Riding.Options` if you want result summaries.
- The hook resolves `null` when no route is found.

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
