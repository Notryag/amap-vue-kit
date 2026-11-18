# `<AmapRangingTool>`

在地图上点击添加测点，双击完成一段测量。停止时可以保留结果，也可以清除全部测距覆盖物。

<DemoPreview>
<ClientOnly>
  <RangingToolDemo :enabled="demoHasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/RangingToolDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import RangingToolDemo from '../../examples/basic/src/RangingToolDemo.vue'
import { demoHasKey } from '../examples/demo-access'
</script>

## 最小示例

```vue
<AmapMap :center="[116.397, 39.909]" :zoom="13" style="height: 360px">
  <AmapRangingTool v-slot="{ tool, start, stop }">
    <button :disabled="!tool" @click="start()">开始测距</button>
    <button :disabled="!tool" @click="stop(true)">清除</button>
  </AmapRangingTool>
</AmapMap>
```

## TS 签名

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `options` | `AMap.RangingToolOptions` | 创建实例时读取的原生配置，如 `lineOptions` 和 `startLabelText`。 |
| `loadOptions` | `UseRangingToolOptions['loadOptions']` | 可选的 SDK 加载配置。 |

| 事件 | 载荷 |
| --- | --- |
| `ready` | `AMap.RangingTool` 实例。 |
| `addnode` | `AMap.RangingToolEventMap['addnode']`，包含坐标与标记。 |
| `end`、`removenode` | `AMap.RangingToolEventMap` 中的同名类型，包含 `points`、`polyline` 和以米为单位的 `distance`。 |

默认插槽和组件 ref 提供 `tool`、`active`、`start(): Promise<boolean>` 和 `stop(removeOverlays?: boolean): void`。

## 常见错误

- 请把测距组件放在 `<AmapMap>` 内。`tool` 非空后即可操作。
- `stop()` 会保留测距结果。调用 `stop(true)` 可清除结果，组件卸载时也会自动清理。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德官方示例](https://lbs.amap.com/demo/javascript-api-v2/example/mouse-operate-map/measure-distance)
