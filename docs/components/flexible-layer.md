# `<AmapFlexibleLayer>`

按瓦片的行、列和缩放级别生成图片或 Canvas。示例在每张瓦片上显示 `z / x / y`，缩放或平移时可以看到新瓦片，切换配色会重载当前瓦片。

<DemoPreview>
<ClientOnly>
  <FlexibleLayerDemo :enabled="hasKey" />
</ClientOnly>

<template #code>

<<< ../../examples/basic/src/FlexibleLayerDemo.vue

</template>
</DemoPreview>

<script setup lang="ts">
import FlexibleLayerDemo from '../../examples/basic/src/FlexibleLayerDemo.vue'
import { useDemoLoader } from '../examples/useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

## 最小示例

```vue
<AmapMap :center="[116.3975, 39.9115]" :zoom="13" style="height: 360px">
  <AmapFlexibleLayer :create-tile="drawTile" />
</AmapMap>
```

`drawTile(x, y, z, success, fail)` 接收瓦片列、行和缩放级别。生成后调用 `success(canvas)` 或 `success(image)`，跳过或失败时调用 `fail()`。

## TS 签名

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `createTile` | `FlexibleCreateTile` | 同步或异步生成瓦片，替换函数会触发重载。 |
| `tileSize` | `64 \| 128 \| 256` | 创建时设置的瓦片边长，默认 256。 |
| `cacheSize` | `number` | 创建时交给高德的瓦片缓存数量。 |
| `visible`、`opacity`、`zIndex`、`zooms` | `boolean`、`number`、`number`、`[number, number]` | 响应式显示配置。 |

`ready` 提供原生图层。组件 ref 提供 `layer` 和 `reload()`。

## 常见错误

- Canvas 的宽高应与 `tileSize` 一致。如果异步加载图片，请等待加载成功后调用 `success()`。
- 回调捕获的数据变化后，可调用 `reload()` 刷新已有瓦片。旧请求返回时会被忽略。

[在 StackBlitz 打开完整示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic) · [高德 Flexible API](https://lbs.amap.com/api/maps-javascript-api/reference/custom-layer/flexible)
