# 轨迹动画

用 [`useMoveAnimation`](../hooks/use-move-animation) 让点标记沿一组坐标移动。用 `AmapPolyline` 绘制整条路线，再通过 `onMoving` 提供的 `passedPath` 更新已走过的路段。

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

如果需要在不同路段使用不同速度，可以给每个点传入 `{ position, duration }`，其中 `duration` 以毫秒计。批量车辆轨迹可用 `MassMarks` 或 `LabelsLayer` 显示静态点位，再对选中的对象播放轨迹。

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
