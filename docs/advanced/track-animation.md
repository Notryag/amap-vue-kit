# 轨迹动画

轨迹动画可以直接使用 JSAPI 的 `AMap.MoveAnimation` 插件，也可以在更复杂的数据可视化场景里使用 Loca 轨迹图层。AMap Vue Kit 会负责地图生命周期和 loader，你可以在 `ready` 回调里拿到原生地图实例后调用插件能力。

```ts
ready((map) => {
  map.plugin(['AMap.MoveAnimation'], () => {
    const marker = new AMap.Marker({ position: path[0], map })
    marker.moveAlong(path, { duration: 5000 })
  })
})
```

常见做法是用 `<AmapPolyline>` 先画出路线轮廓，再让 Marker 沿同一组坐标移动，这样用户能同时看到起点、终点和运动方向。

## 在线示例

<ClientOnly>
  <TrackAnimationDemo />
</ClientOnly>

<script setup lang="ts">
import TrackAnimationDemo from '../examples/advanced/TrackAnimationDemo.vue'
</script>

### 说明

- 调用 `moveAlong` 前要先加载 `AMap.MoveAnimation`，否则运行时会找不到动画方法。
- 可以把 `pauseMove`、`resumeMove`、`stopMove` 暴露成按钮，方便暂停和重播。
- 批量车辆轨迹建议把静态点位交给 `MassMarks` 或 `LabelsLayer`，只对当前活跃对象执行动画。
