# `<AmapImageLayer>`

将自定义栅格覆盖物（热力图、楼层平面图、历史影像等）投射到地图上，无需编写命令式胶水代码。组件会监听 URL、范围和透明度变化，并同步底层 `AMap.ImageLayer`。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `url` | `string` | – | 要渲染的图片 URL，必填且响应式。 |
| `bounds` | `BoundsLike` | – | 图片的地理范围，支持 `[southWest, northEast]` 数组或 `AMap.Bounds`。 |
| `visible` | `boolean` | `true` | 切换图层是否显示在地图上。 |
| `opacity` | `number \| undefined` | – | 图片相对底图的透明度（0 为透明，1 为不透明）。 |
| `zIndex` | `number \| undefined` | – | 相对其他图层的渲染顺序。 |
| `zooms` | `[number, number] \| undefined` | – | 图层保持可见的最小与最大缩放级别。 |
| `options` | `Partial<AMap.ImageLayerOptions>` | `{}` | 透传给图片图层实例的额外 JSAPI 配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.ImageLayer` | 图片图层创建并挂载到地图后触发一次。 |

## 最小示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const overlay = ref<'footprints' | 'satellite'>('footprints')
const opacity = ref(0.75)
const showOverlay = ref(true)
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell">
    <AmapImageLayer
      :url="overlay === 'footprints' ? 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay.png' : 'https://a.amap.com/jsapi_demos/static/demo-center-v2/overlay/overlay-heat.png'"
      :bounds="overlay === 'footprints' ? [[116.357, 39.903], [116.412, 39.949]] : [[116.365, 39.897], [116.418, 39.946]]"
      :opacity="opacity"
      :visible="showOverlay"
      :z-index="120"
    />
  </AmapMap>
</template>
```

切换下方示例中的下拉框和滑块，可以更换影像源、调整透明度，或在不销毁实例的情况下临时隐藏图层。

<ClientOnly>
  <ImageLayerDemo />
</ClientOnly>

<script setup lang="ts">
import ImageLayerDemo from '../examples/ImageLayerDemo.vue'
</script>

### TS 签名

```ts
export interface ImageLayerProps {
  url: string
  bounds: BoundsLike
  visible?: boolean
  opacity?: number
  zIndex?: number
  zooms?: [number, number]
  options?: Partial<AMap.ImageLayerOptions>
}

type ImageLayerReadyPayload = AMap.ImageLayer
```

### 常见错误

- `bounds` 必须描述西南角和东北角。使用城市级图片时，请确认经纬度顺序。
- 确保图片 URL 可通过 HTTPS 访问；浏览器会在安全页面中阻止不安全资源。
- 如果需要频繁切换多个覆盖图片，复用同一个组件实例并更新 `url` / `bounds` 属性即可，不必反复重新挂载。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
