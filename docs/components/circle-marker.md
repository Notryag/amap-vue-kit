# `<AmapCircleMarker>`

`<AmapCircleMarker>` 封装轻量 JSAPI 圆点覆盖物，用于在地图坐标上渲染可缩放的矢量圆。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `center` | `LngLatLike` | 标记中心坐标。 |
| `radius` | `number` | 半径，单位为像素。 |
| `visible` | `boolean` | 控制标记可见性。 |
| `extData` | `any` | 附加到标记的任意元数据。 |
| `options` | `Partial<AMap.CircleMarkerOptions>` | 额外 JSAPI 选项，例如颜色或光标。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.CircleMarker` | 标记实例就绪后触发。 |
| `click` | `any` | 圆点标记点击事件。 |
| `mouseover` | `any` | 鼠标移入事件。 |
| `mouseout` | `any` | 鼠标移出事件。 |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="14" style="height: 320px">
  <AmapCircleMarker
    :center="[116.397, 39.908]"
    :radius="16"
    :options="{ fillColor: 'rgba(22, 119, 255, 0.45)', strokeColor: '#1677ff' }"
  />
</AmapMap>
```

## 在线示例

<ClientOnly>
  <CircleMarkerComponentDemo />
</ClientOnly>

<script setup lang="ts">
import CircleMarkerComponentDemo from '../examples/CircleMarkerComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
