# `<AmapGLCustomLayer>`

在高德 3D 地图的 WebGL 上下文中绘制自定义内容。在线示例绘制一个与经纬度绑定的圆点，可调整直径或隐藏图层。

<DemoPreview>
<ClientOnly>
  <GLCustomLayerDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/GLCustomLayerDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import GLCustomLayerDemo from '../../examples/basic/src/GLCustomLayerDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap view-mode="3D" style="height: 360px">
  <AmapGLCustomLayer :init="init" :render="draw" />
</AmapMap>
```

## TS 签名

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `init` | `UseGLCustomLayerOptions['init']` | 接收 `{ gl, map }`，可返回资源释放函数。 |
| `render` | `UseGLCustomLayerOptions['render']` | 接收 `{ gl, map, state }`，在 SDK 的渲染帧中绘制。 |
| `visible`、`opacity`、`zIndex`、`zooms` | `boolean`、`number`、`number`、`[number, number]` | 图层显示设置。 |

组件通过 `ready` 事件返回原生图层。组件 ref 提供 `layer` 和 `redraw()`，后者请求地图重新渲染。

## 常见错误

- 在 `view-mode="3D"` 的地图内使用。动态数据变化后，用 `redraw()` 请求一帧。
- 在 `init` 返回的函数中释放自己创建的着色程序、缓冲区和纹理。渲染后恢复你改动的 WebGL 状态，避免影响底图。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 GLCustomLayer API](https://lbs.amap.com/api/maps-javascript-api/reference/custom-layer/glcustomlayer)
