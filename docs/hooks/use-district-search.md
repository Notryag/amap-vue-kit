# `useDistrictSearch`

按行政区名称或编码查找行政区，获取中心点、下级区划和边界。在线示例默认填入北京市的 `adcode`，点「查询」后可在地图查看边界，再点下级区划继续查询。

<DemoPreview>
<ClientOnly>
  <DistrictSearchDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/DistrictSearchDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import DistrictSearchDemo from '../../examples/basic/src/DistrictSearchDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```ts
import { useDistrictSearch } from '@amap-vue/hooks'

const { search } = useDistrictSearch({ subdistrict: 1, showbiz: false })

async function findBeijing() {
  const result = await search('110000', { extensions: 'all' })
  return result?.districtList[0]
}
```

## TS 签名

```ts
function useDistrictSearch(options?: MaybeRefOrGetter<UseDistrictSearchOptions | undefined>): UseDistrictSearchReturn

interface UseDistrictSearchReturn {
  search: (keyword?: string, options?: AMap.DistrictSearch.Options) => Promise<AMap.DistrictSearch.Result | null>
  destroy: () => void
}
```

| 选项 | 说明 |
| --- | --- |
| `level` | 限定查询级别，例如 `province`、`city` 或 `district`。 |
| `subdistrict` | `0` 到 `3`，指定返回几级下辖区划。 |
| `extensions` | 设为 `'all'` 请求边界，每段边界通过 `district.boundaries` 返回。 |
| `showbiz` | 设为 `false` 时查询街道等行政区划。 |
| `loadOptions` | Hook 配置中的可选 Loader 参数。 |

`search()` 可省略关键词以查询全国。传入第二个参数时，只覆盖当次查询的配置。查询无结果、SDK 返回错误或 Hook 已释放时，结果为 `null`。

## 常见错误

- 如果高德返回 `INVALID_USER_SCODE`，请为本地示例配置与 `VITE_AMAP_KEY` 匹配的 `VITE_AMAP_SECURITY_CODE`，或在文档的示例表单中填写配套的 Key 和安全密钥。
- 同名地点可能返回多个结果。已知编码时，使用 `adcode` 或加上 `level` 缩小范围。
- 边界需要 `extensions: 'all'`，且边界数据可能缺失。绘制多个边界段时，可逐段传给 [`AmapPolygon`](../components/polygon)。
- 此 Hook 查询的是行政区数据。要直接在底图上渲染行政区，可使用 [`AmapDistrictLayer`](../components/district-layer)。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德行政区查询指南](https://lbs.amap.com/api/javascript-api-v2/guide/services/district-search)
