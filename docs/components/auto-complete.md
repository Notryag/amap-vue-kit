# `<AmapAutoComplete>`

基于高德 AutoComplete 服务提供即时搜索建议。组件封装了 [`useAutoComplete`](/hooks/use-auto-complete)，内置输入框、加载状态，并通过无渲染插槽支持自定义 UI。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 当前关键词，支持 `v-model`。 |
| `auto` | `boolean` | `true` | 关键词变化时自动触发搜索。 |
| `debounce` | `number` | `250` | 触发搜索前的防抖间隔，单位毫秒。 |
| `placeholder` | `string` | `'搜索地点'` | 内置输入框的占位文本。 |
| `options` | `Partial<AMap.Autocomplete.Options>` | `{}` | 原生 AutoComplete 配置，例如 `city`、`type` 或 `datatype`。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | 传给 `loader.load` 的额外加载配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 关键词变化时触发。 |
| `ready` | `AMap.AutoComplete` | 服务初始化完成后触发一次。 |
| `search` | `{ keyword: string, tips: AMap.Autocomplete.Tip[], result: AMap.Autocomplete.SearchResult \| null }` | 每次搜索后触发，包括空结果。 |
| `select` | `AMap.Autocomplete.Tip` | 默认列表中的建议项被点击时触发。 |
| `error` | `string` | 服务返回失败时触发。 |

## 最小示例

```vue
<AmapAutoComplete v-model="keyword" @select="handleSelect" />
```

使用默认插槽可以完全接管渲染：

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

### TS 签名

```ts
export interface AmapAutoCompleteProps {
  modelValue?: string
  auto?: boolean
  debounce?: number
  placeholder?: string
  options?: Partial<AMap.Autocomplete.Options>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 组件挂载前通过 `loadOptions.plugins` 或 `useDemoLoader` 加载 `AMap.AutoComplete` 插件。
- `auto` 为 `false` 时，需要手动调用暴露的 `search(keyword)` 方法。
- 监听 `error` 事件，将配额或网络错误反馈给用户。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
