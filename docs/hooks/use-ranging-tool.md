# `useRangingTool`

在已有地图实例上启动测距，获取测点和总距离。Hook 会在地图就绪后按需加载 `AMap.RangingTool`。

## 最小示例

```ts
import { useRangingTool } from '@amap-vue/hooks'

const { start } = useRangingTool(() => map.value, {
  onEnd: ({ distance, points }) => console.log(distance, points),
})
```

将 `start()` 绑定到按钮，地图就绪后点击按钮开始测量。`onEnd` 回调中的 `distance` 以米为单位。

## TS 签名

```ts
function useRangingTool(
  map: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options?: MaybeRefOrGetter<UseRangingToolOptions>,
): {
  tool: ShallowRef<AMap.RangingTool | null>
  active: Readonly<Ref<boolean>>
  start: () => Promise<boolean>
  stop: (removeOverlays?: boolean) => void
  destroy: () => void
}
```

`UseRangingToolOptions` 支持原生构造参数 `options`、加载配置 `loadOptions`，以及 `onAddNode`、`onRemoveNode`、`onEnd` 三个回调。

## 常见错误

- `start()` 返回 `false` 表示地图或插件尚不可用，或者启动已取消。等待地图就绪后可重试。
- `stop(true)` 结束测距并清除覆盖物。在组件外使用时，主动调用 `destroy()` 清理实例及监听。

## 完整示例

```vue
<script setup lang="ts">
import { AmapMap } from '@amap-vue/core'
import { useRangingTool } from '@amap-vue/hooks'
import { ref, shallowRef } from 'vue'

const map = shallowRef<AMap.Map | null>(null)
const distance = ref<number | null>(null)
const { tool, active, start, stop } = useRangingTool(map, {
  onEnd: event => distance.value = event.distance,
})
</script>

<template>
  <button :disabled="!tool || active" @click="start()">开始测距</button>
  <button :disabled="!active" @click="stop()">停止</button>
  <output v-if="distance !== null">{{ distance.toFixed(1) }} 米</output>
  <AmapMap :center="[116.397, 39.909]" :zoom="13" style="height: 360px" @ready="map = $event" />
</template>
```

[打开在线地图和完整源码](../components/ranging-tool) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
