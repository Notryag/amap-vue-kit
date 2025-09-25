# `useAutoComplete`

Access the AMap AutoComplete service with a lightweight, promise-based composable. It lazily loads the plugin, keeps a singleton instance, and pairs nicely with [`<AmapAutoComplete>`](/components/auto-complete).

```ts
import { useAutoComplete } from '@amap-vue/hooks'

const autoComplete = useAutoComplete({ city: '北京' })
const result = await autoComplete.search('咖啡')
console.log(result?.tips)
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| ...`AMap.AutoCompleteOptions` | `Partial<AMap.AutoCompleteOptions>` | Native options such as `city`, `type`, or `datatype`. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Forwarded to `loader.load` for custom API keys or plugins. |

## Return value

| Key | Description |
| --- | --- |
| `autoComplete` | `ShallowRef<AMap.AutoComplete \| null>` exposing the underlying instance. |
| `search(keyword)` | Promise that resolves to `AMap.AutoCompleteResult` (or `null` when the service fails). |
| `setOptions(options)` | Patch native options after initialisation. |
| `setCity(city)` | Shortcut for `setOptions({ city })`. |
| `setType(type)` | Shortcut for `setOptions({ type })`. |
| `destroy()` | Dispose the internal reference. |

## Live example

<ClientOnly>
  <UseAutoCompleteHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseAutoCompleteHookDemo from '../examples/hooks/UseAutoCompleteHookDemo.vue'
</script>

### Notes

- An empty keyword returns `null`; guard your UI to avoid accidental requests.
- The hook queues `loader.load` only once per app and reuses the instance across re-renders.
- Combine with [`<AmapAutoComplete>`](/components/auto-complete) for a polished UI out of the box.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
