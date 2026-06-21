# `<AmapElasticMarker>`

`<AmapElasticMarker>` 暴露高德 ElasticMarker 插件，用于渲染会随缩放级别调整尺寸和样式的可伸缩 HTML 标记。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `position` | `LngLatLike` | 标记坐标。 |
| `styles` | `AMap.ElasticMarkerStyles` | 各缩放级别的样式定义。 |
| `zoomStyleMapping` | `Record<number, number>` | 从缩放级别到样式索引的映射。 |
| `visible` | `boolean` | 控制标记可见性。 |
| `extData` | `any` | 任意元数据。 |
| `options` | `Partial<AMap.ElasticMarkerOptions>` | 额外 JSAPI 选项。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.ElasticMarker` | 标记实例创建完成后触发。 |
| `click` | `any` | 标记点击事件。 |
| `mouseover` | `any` | 鼠标移入事件。 |
| `mouseout` | `any` | 鼠标移出事件。 |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="12" style="height: 320px">
  <AmapElasticMarker
    :position="[116.397, 39.908]"
    :styles="{
      0: { icon: { img: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png', size: [26, 40], anchor: [13, 40] } },
      1: { icon: { img: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png', size: [34, 52], anchor: [17, 52] } },
    }"
    :zoom-style-mapping="{ 10: 0, 14: 1 }"
  />
</AmapMap>
```

## 在线示例

<ClientOnly>
  <ElasticMarkerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import ElasticMarkerComponentDemo from '../examples/ElasticMarkerComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
