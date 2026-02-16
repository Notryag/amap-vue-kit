# `useDriving`

Use the AMap Driving service programmatically. The composable loads the driving plugin on demand, supports map binding, and exposes helpers for searching and clearing routes.

```ts
import { useDriving } from '@amap-vue/hooks'

const driving = useDriving({ map })
const result = await driving.search('天安门', '故宫')
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| ...`AMap.DrivingOptions` | `Partial<AMap.DrivingOptions>` | Native driving options such as `policy`, `ferry`, `hideMarkers`, etc. |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | Bind the driving service to an existing map instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Forwarded to `loader.load` for custom keys or plugins. |

## Return value

| Key | Description |
| --- | --- |
| `driving` | `ShallowRef<AMap.Driving \| null>` exposing the underlying service. |
| `search(origin, destination, options?)` | Compute a driving route between two endpoints. |
| `setOptions(options)` | Update native driving options. |
| `setMap(map)` | Rebind the service to a different map instance. |
| `clear()` | Clear the rendered route and panel. |
| `destroy()` | Dispose the service and detach it from the map. |

## Live example

<ClientOnly>
  <UseDrivingHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseDrivingHookDemo from '../examples/hooks/UseDrivingHookDemo.vue'
</script>

### Notes

- Provide `map` if you want the JSAPI to draw route polylines automatically.
- You can pass a custom `panel` element via `AMap.DrivingOptions` if you need a summary list.
- Route planning returns `null` when the JSAPI responds with `no_data` or an error.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
