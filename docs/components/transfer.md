# `<AmapTransfer>`

查询公交换乘方案，并在地图上绘制选中方案。步行使用灰色虚线，公交使用蓝色线，地铁使用紫色线。

<DemoPreview>
<ClientOnly>
  <TransferDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/TransferDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import TransferDemo from '../../examples/basic/src/TransferDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[116.375, 39.9]" :zoom="12" style="height: 420px">
  <AmapTransfer origin="北京西站" destination="北京站" :options="{ city: '北京市' }" />
</AmapMap>
```

## TS 签名

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `origin`、`destination` | `TransferEndpoint` | 两端同时使用坐标，或同时使用地点名称。 |
| `options` | `UseTransferOptions` | 城市、策略、夜班车和可选 Loader 参数。 |
| `auto` | `boolean` | 启用后在参数变化时自动查询。默认 `false`。 |

`search` 事件返回 `AMap.TransferResult | null`，`error` 事件返回错误提示。默认插槽提供 `result`、`plan`、`loading`、`error`、`search()` 和 `clear()`。

## 常见错误

- 请将组件放在 `<AmapMap>` 内，并为地图设置高度。
- 使用地点名称时传入 `options.city`。查询失败时检查起终点和高德 Key 对应的安全密钥。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德公交路线规划指南](https://lbs.amap.com/api/javascript-api-v2/guide/services/navigation)
