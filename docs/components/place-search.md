# `<AmapPlaceSearch>`

搜索兴趣点，支持分页、附近/范围模式，以及开箱即用的面板 UI。组件内部组合了 [`usePlaceSearch`](/hooks/use-place-search)，处理防抖，并通过无渲染插槽支持自定义渲染。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 当前关键词，支持 `v-model`。 |
| `mode` | `'keyword' \| 'nearby' \| 'bounds'` | `'keyword'` | 选择搜索策略：普通关键词搜索、基于 `location + radius` 的附近搜索，或范围搜索。 |
| `location` | `LngLatLike` | `undefined` | `mode="nearby"` 时使用的中心点。 |
| `radius` | `number` | `1000` | 附近搜索半径，单位米。 |
| `bounds` | `BoundsLike` | `undefined` | `mode="bounds"` 时使用的矩形范围。 |
| `auto` | `boolean` | `true` | 输入变化时自动触发搜索。 |
| `debounce` | `number` | `300` | 触发搜索前的防抖间隔，单位毫秒。 |
| `placeholder` | `string` | `'搜索地点、地址或兴趣点'` | 内置输入框的占位文本。 |
| `options` | `Partial<AMap.PlaceSearch.Options>` | `{}` | 原生 PlaceSearch 配置，例如 `city`、`type`、`pageSize` 等。 |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | `undefined` | 将搜索结果关联到已有 `<AmapMap>` 实例，用于自动渲染标记。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | `undefined` | 额外加载配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 关键词变化时触发。 |
| `ready` | `AMap.PlaceSearch` | PlaceSearch 实例创建后触发一次。 |
| `search` | `{ keyword: string, result: AMap.PlaceSearch.SearchResult \| null }` | 每次搜索后触发，包括空结果或失败响应。 |
| `select` | `AMap.PlaceSearch.Poi` | 默认模板中的 POI 被点击时触发。 |
| `error` | `string` | JSAPI 报错时触发。 |

## 用法

```vue
<AmapPlaceSearch v-model="keyword" mode="nearby" :location="center" :radius="1500" @select="handlePoi" />
```

<ClientOnly>
  <PlaceSearchDemo />
</ClientOnly>

<script setup lang="ts">
import PlaceSearchDemo from '../examples/PlaceSearchDemo.vue'
</script>

### TypeScript 签名

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
  options?: Partial<AMap.PlaceSearch.Options>
  map?: MaybeRefOrGetter<AMap.Map | null | undefined>
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 使用 `mode="nearby"` 时，保持合理半径（建议不超过 3000m），避免响应变慢。
- 如果希望原生 PlaceSearch 自动渲染 POI 标记，请传入 `map` prop；否则通过插槽自行处理结果。
- 调用暴露的 `goToPage(page)` 方法可以实现自定义分页控件。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
