# `<AmapMap>`

`<AmapMap>` 渲染一个可交互的 JSAPI 地图实例，并为内部覆盖物提供地图上下文。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `center` | `LngLatLike \| undefined` | – | 地图初始中心点，支持 `[lng, lat]` 或 `AMap.LngLat` 实例。 |
| `zoom` | `number \| undefined` | – | 初始缩放级别。 |
| `viewMode` | `'2D' \| '3D'` | `'2D'` | 地图渲染模式。 |
| `theme` | `string \| undefined` | – | 已在高德地图注册的主题标识。 |
| `pitch` | `number \| undefined` | – | 初始俯仰角。 |
| `rotation` | `number \| undefined` | – | 初始旋转角。 |
| `mapStyle` | `string \| undefined` | – | 自定义地图样式 ID。 |
| `plugins` | `string[]` | `[]` | 额外加载的 JSAPI 插件。 |
| `loaderOptions` | `Partial<LoaderOptions>` | `{}` | 传给共享 loader 的覆盖配置，例如自定义版本号。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Map` | 地图实例可用后触发一次。 |
| `moveend` | `any` | 地图移动结束时触发。 |
| `click` | `any` | 地图点击事件。 |
| `complete` | `any` | 资源全部加载完成后触发。 |
| `error` | `any` | 底层 JSAPI 报错时触发。 |

## 用法

```vue
<script setup lang="ts">
import { AmapMap, AmapMarker } from '@amap-vue/core'

const center = [116.397, 39.908]
</script>

<template>
  <AmapMap :center="center" :zoom="11" style="height: 320px">
    <AmapMarker :position="center" />
  </AmapMap>
</template>
```

<ClientOnly>
  <BasicMapDemo />
</ClientOnly>

<script setup lang="ts">
import BasicMapDemo from '../examples/BasicMapDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
