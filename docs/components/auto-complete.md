# `<AmapAutoComplete>`

Provide instant search suggestions backed by the AMap AutoComplete service. The component wraps [`useAutoComplete`](/hooks/use-auto-complete) with an opinionated input, loading state, and exposes renderless slots for custom UIs.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Current keyword. Works with `v-model`. |
| `auto` | `boolean` | `true` | Automatically trigger search when the keyword changes. |
| `debounce` | `number` | `250` | Debounce interval (ms) applied before firing a search. |
| `placeholder` | `string` | `'搜索地点'` | Placeholder text for the built-in input. |
| `options` | `Partial<AMap.AutoCompleteOptions>` | `{}` | Native AutoComplete options such as `city`, `type`, or `datatype`. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | Extra loader configuration passed to `loader.load`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted whenever the keyword changes. |
| `ready` | `AMap.AutoComplete` | Fires once after the service is initialised. |
| `search` | `{ keyword: string, tips: AMap.AutoCompleteTip[], result: AMap.AutoCompleteResult \| null }` | Emitted after each search (including empty results). |
| `select` | `AMap.AutoCompleteTip` | Fired when a suggestion is clicked in the default slot. |
| `error` | `string` | Emitted when the service reports a failure. |

## Usage

```vue
<AmapAutoComplete v-model="keyword" @select="handleSelect" />
```

Use the default slot for full control over rendering:

```vue
<AmapAutoComplete v-model="keyword" v-slot="{ tips, select, loading }">
  <MyCustomInput v-model="keyword" />
  <MySuggestionList :tips="tips" :loading="loading" @pick="select" />
</AmapAutoComplete>
```

<ClientOnly>
  <AutoCompleteDemo />
</ClientOnly>

<script setup lang="ts">
import AutoCompleteDemo from '../examples/AutoCompleteDemo.vue'
</script>

### TypeScript signature

```ts
export interface AmapAutoCompleteProps {
  modelValue?: string
  auto?: boolean
  debounce?: number
  placeholder?: string
  options?: Partial<AMap.AutoCompleteOptions>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- Load the `AMap.AutoComplete` plugin via `loadOptions.plugins` or `useDemoLoader` before mounting the component.
- When `auto` is `false`, call the exposed `search(keyword)` method manually.
- Handle the `error` event to surface quota issues or network failures to users.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
