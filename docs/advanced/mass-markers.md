# 海量点

海量点适合一次渲染成千上万的点位。它把绘制工作交给 JSAPI 内部批处理，比逐个创建普通 Marker 更轻量。

```ts
import { useMassMarkers } from '@amap-vue/hooks'

const mass = useMassMarkers(() => map.value, () => ({
  data: points,
  style: [{
    url: 'https://a.amap.com/jsapi_demos/static/resource/img/markers/mark_b.png',
    anchor: [6, 6],
    size: [11, 11]
  }]
}))
```

建议在地图 ready 后再创建海量点，确保地图实例已经存在。`useMassMarkers` 会复用共享 loader，额外插件只会请求一次。

## 在线示例

<ClientOnly>
  <UseMassMarkersHookDemo />
</ClientOnly>

## 海量点与标签图层对比

同一份数据可以在高密度海量点和更丰富的 LabelMarker 标签图层之间切换，按场景选择性能或展示能力。

<ClientOnly>
  <MassMarksComparisonDemo />
</ClientOnly>

<script setup lang="ts">
import UseMassMarkersHookDemo from '../examples/hooks/UseMassMarkersHookDemo.vue'
import MassMarksComparisonDemo from '../examples/MassMarksComparisonDemo.vue'
</script>

### 说明

- 可以配置多组 `style`，再通过数据项里的 `style` 索引实现条件配色。
- `extData` 尽量保持精简；海量点最适合每条数据只有坐标、分类、数值这类轻量字段的场景。
- 服务端持续推送点位时，用新数组调用 `setData`；插件会复用内部缓冲区。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
