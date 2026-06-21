# `<AmapBezierCurve>`

Render bezier polylines using the JSAPI plugin.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `path` | `BezierCurvePath` | Array of bezier segments. Each segment is a four-point array `[start, ctrl1, ctrl2, end]`. |
| `visible` | `boolean` | Controls visibility. |
| `extData` | `any` | Custom metadata. |
| `options` | `Partial<AMap.BezierCurveOptions>` | Additional JSAPI options. |

## 事件

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.BezierCurve` | Fired when the curve is created. |
| `click` | `any` | Click events. |
| `mouseover` | `any` | Hover enter events. |
| `mouseout` | `any` | Hover leave events. |

## 用法

```vue
<AmapMap :center="[116.4, 39.93]" :zoom="12" style="height: 320px">
  <AmapBezierCurve
    :path="[
      [[116.35, 39.9], [116.36, 39.94], [116.38, 39.96], [116.41, 39.97]],
      [[116.41, 39.97], [116.43, 39.96], [116.45, 39.92], [116.46, 39.9]]
    ]"
    :options="{ stroke颜色: '#722ed1', strokeWeight: 4 }"
  />
</AmapMap>
```

## 在线示例

<ClientOnly>
  <BezierCurveComponentDemo />
</ClientOnly>

<script setup lang="ts">
import BezierCurveComponentDemo from '../examples/BezierCurveComponentDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
