# 输入提示与 POI 搜索

输入「天安门」之类的关键词，选择一条建议可定位到具体地点。按回车或点「搜索地点」可查询多个结果，再点击结果把地图移到对应位置。

<DemoPreview>
<ClientOnly>
  <PoiSearchDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/PoiSearchDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import PoiSearchDemo from '../../examples/basic/src/PoiSearchDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 在应用里接入

1. 用 `<AmapAutoComplete v-model="keyword" @select="selectTip" />` 显示输入建议。`select` 直接提供选中的 Tip。
2. Tip 有 `location` 时可直接更新地图中心和 Marker。只有 POI ID 时，调用 `usePlaceSearch().getDetails(tip.id)`；也可以用 `search(keyword)` 查询关键词，从 `result.poiList.pois` 读取候选地点。
3. 已有搜索面板需求时，可以直接使用 `<AmapPlaceSearch>`。自定义输入框和结果列表时，分别使用 `useAutoComplete().search(keyword)` 和 `usePlaceSearch()`。

示例按北京限定结果。配置 Web 端高德 Key 及同一应用的安全密钥，或使用项目配置的安全代理。

[输入提示组件](../components/auto-complete) · [地点搜索组件](../components/place-search) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/master/examples/basic) · [高德 JS API 2.0 指南](https://lbs.amap.com/api/javascript-api-v2/guide/services/autocomplete)
