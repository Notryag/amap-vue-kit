# `useMoveAnimation`

让已有的 Marker、Text 或 LabelMarker 移到指定位置或沿轨迹移动。首次播放时按需加载 `AMap.MoveAnimation`。

## 最小示例

```ts
import { useMoveAnimation } from '@amap-vue/hooks'

// marker 是 useMarker() 返回的点标记 ref。等 ref 有值后再播放。
const animation = useMoveAnimation(marker)
await animation.moveAlong([
  [116.397, 39.908],
  [116.405, 39.912],
], { duration: 1200 })
```

## 完整示例

<DemoPreview>
<ClientOnly>
  <TrackAnimationDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/TrackAnimationDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import TrackAnimationDemo from '../../examples/basic/src/TrackAnimationDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## TS 签名

```ts
function useMoveAnimation(
  target: MaybeRefOrGetter<AMap.Marker | AMap.LabelMarker | null | undefined>,
  options?: UseMoveAnimationOptions,
): UseMoveAnimationReturn
```

| 成员 | 说明 |
| --- | --- |
| `moveTo(position, options?)` | 移到坐标，返回 `Promise<boolean>`。 |
| `moveAlong(path, options?)` | 沿坐标数组或 `{ position, duration, delay }` 数组移动，返回 `Promise<boolean>`。 |
| `pause()` / `resume()` | 暂停和继续当前动画。 |
| `stop()` | 停止当前动画，也会取消等待插件加载的播放请求。 |
| `destroy()` | 停止动画，解绑事件并销毁 Hook。 |

通过 `onMoving` 读取 `event.passedPath`，通过 `onMoveAlong` 监听整条路线完成。还可通过 `onMoveEnd` 监听原生 `moveend` 事件，沿多段路线移动时也可能收到该事件。

## 常见错误

- 点标记还没创建、坐标无效或插件加载失败时，启动方法会返回 `false`。等待点标记准备好后再调用。
- `duration` 按路段计算，单位为毫秒。让标记回到起点时，在 `stop()` 后手动调用 `setPosition(path[0])`。
- 替换标记或卸载组件时，Hook 会停止动画并清理监听。在 Vue 作用域之外使用时，结束后调用 `destroy()`。

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 Marker API](https://lbs.amap.com/api/maps-javascript-api/reference/amap-marker/marker)
