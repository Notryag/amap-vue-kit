# `usePlaceSearch`

通过 AMap PlaceSearch 服务以编程方式查询 POI。该组合式函数支持关键字、周边、范围检索，并让分页状态保留在 JSAPI 服务侧。

```ts
import { usePlaceSearch } from '@amap-vue/hooks'

const placeSearch = usePlaceSearch({ city: '北京', pageSize: 5 })
const result = await placeSearch.search('咖啡')
console.log(result?.poiList?.pois)
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| ...`AMap.PlaceSearch.Options` | `Partial<AMap.PlaceSearch.Options>` | 原生配置，包括 `city`、`type`、`pageSize` 等。 |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | 将搜索服务绑定到已有地图实例。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 传给 `loader.load` 的自定义 Key 或插件配置。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `placeSearch` | `ShallowRef<AMap.PlaceSearch \| null>`，暴露底层服务实例。 |
| `search(keyword)` | 执行关键字搜索。 |
| `searchNearBy(keyword, center, radius)` | 基于中心点与米级半径执行周边搜索。 |
| `searchInBounds(keyword, bounds)` | 在矩形范围内搜索。 |
| `getDetails(poiId)` | 按 ID 获取 POI 详情。 |
| `setOptions(options)` | 更新原生 PlaceSearch 选项。 |
| `setCity`, `setType`, `setPageIndex`, `setPageSize`, `setMap` | 映射到原生方法的便捷 setter。 |
| `clear()` | 清空 JSAPI 内置覆盖物或结果面板。 |
| `destroy()` | 销毁实例并从地图解绑。 |

## 完整示例

<ClientOnly>
  <UsePlaceSearchHookDemo />
</ClientOnly>

<script setup lang="ts">
import UsePlaceSearchHookDemo from '../examples/hooks/UsePlaceSearchHookDemo.vue'
</script>

### 说明

- 构建自定义分页时，触发新搜索前记得先更新 `pageIndex`。
- 周边搜索需要同时提供 `location` 与 `radius`；请在调用前处理缺失参数，避免得到 `no_data` 响应。
- hook 不缓存结果；如果需要跨视图复用 POI，请在调用方自行保存。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
