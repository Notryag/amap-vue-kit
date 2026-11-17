# 鹰眼控件 `<AmapHawkEye>`

在地图右下角显示缩略地图，支持独立控制显示与展开状态。组件自动加载 `AMap.HawkEye`，地图切换和卸载时自动清理。

## 最小示例

完成[入门配置](../guide/getting-started.md)后：

```vue
<script setup lang="ts">
import { AmapHawkEye, AmapMap } from '@amap-vue/core'
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="12" style="height: 360px">
    <AmapHawkEye :is-open="true" width="180px" height="140px" />
  </AmapMap>
</template>
```

## 完整示例

<ClientOnly><HawkEyeDemo /></ClientOnly>

<<< ../../examples/basic/src/HawkEyeDemo.vue

<script setup lang="ts">
import HawkEyeDemo from '../examples/HawkEyeDemo.vue'
</script>

## 属性与事件

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | 显示或隐藏，保留实例。 |
| `isOpen` | `boolean` | SDK 默认值 | 展开或收起缩略图。 |
| `width` / `height` | `string` | SDK 默认值 | CSS 尺寸。 |
| `offset` | `[number, number]` | SDK 默认值 | 相对右下角的像素距离。 |
| `options` | `UseHawkEyeOptions` | `{}` | 边框、图层、自动跟随等选项；独立 props 优先。 |

`ready(control)` 在每次创建并挂载新实例后触发。`isOpen`、`visible` 更新复用实例；尺寸、偏移、图层等初始化配置变化会重建控件，因此 `ready` 可能再次触发。

## TS 签名

```ts
interface HawkEyeProps {
  visible?: boolean
  isOpen?: boolean
  width?: string
  height?: string
  offset?: [number, number]
  options?: UseHawkEyeOptions
}
```

组件 ref 暴露 `control`、`open()`、`close()`、`show()`、`hide()`。完整选项和返回值见 [useHawkEye](../hooks/use-hawk-eye.md)。

## 常见错误

- 组件应放在 `<AmapMap>` 内，且地图容器必须有高度。
- `isOpen` 控制展开；`visible` 控制整个控件的显示，两者互不替代。
- 原生按钮可以改变展开状态，`isOpen` 不会自动回写；需要强制受控时通过 `options.showButton: false` 隐藏原生按钮。
- 使用 `isOpen`，不要使用旧示例中的 `opened`。API 依据[官方参考](https://a.amap.com/jsapi/static/doc/index.html#amaphawkeye)。

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/master/examples/basic)
