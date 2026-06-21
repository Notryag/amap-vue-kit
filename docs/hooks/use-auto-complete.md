# `useAutoComplete`

`useAutoComplete` 用组合式 API 封装高德输入提示服务。它会按需加载 `AMap.AutoComplete` 插件，提供 Promise 风格的 `search` 方法，也可以和 [`<AmapAutoComplete>`](/components/auto-complete) 组件搭配使用。

```ts
import { useAutoComplete } from '@amap-vue/hooks'

const autoComplete = useAutoComplete({ city: '北京' })
const result = await autoComplete.search('咖啡')
console.log(result?.tips)
```

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| ...`AMap.Autocomplete.Options` | `Partial<AMap.Autocomplete.Options>` | 原生输入提示参数，例如 `city`、`type`、`datatype`。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 传给 `loader.load` 的配置，可用于覆盖 key、插件或超时时间。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `autoComplete` | `ShallowRef<AMap.AutoComplete \| null>`，指向原生输入提示实例。 |
| `search(keyword)` | 搜索关键词，成功时返回 `AMap.Autocomplete.SearchResult`，服务失败时返回 `null`。 |
| `setOptions(options)` | 初始化后更新原生参数。 |
| `setCity(city)` | `setOptions({ city })` 的快捷方法。 |
| `setType(type)` | `setOptions({ type })` 的快捷方法。 |
| `destroy()` | 释放内部实例引用。 |

## 在线示例

<ClientOnly>
  <UseAutoCompleteHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseAutoCompleteHookDemo from '../examples/hooks/UseAutoCompleteHookDemo.vue'
</script>

### 说明

- 空关键词会直接返回 `null`，建议在 UI 层禁用提交按钮或做输入校验。
- hook 会复用同一个输入提示实例，避免每次渲染都重新加载插件。
- 如果需要完整输入框和候选列表，可以直接使用 [`<AmapAutoComplete>`](/components/auto-complete)。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
