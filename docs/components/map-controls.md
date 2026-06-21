# `<AmapToolBar>`, `<AmapScale>`, `<AmapControlBar>`, `<AmapMapType>`

这些封装组件暴露 JSAPI 内置地图控件，让你无需编写命令式代码即可切换导航控件。每个控件都会自动加载所需插件，挂载到最近的 `<AmapMap>`，并在卸载时清理。

## 共享属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | 显示或隐藏控件但不销毁实例。 |
| `position` | `'LT' \| 'RT' \| 'LB' \| 'RB' \| undefined` | – | 控件锚定到地图的角落（Left/Right × Top/Bottom）。 |
| `offset` | `PixelLike \| undefined` | – | 相对锚点角落的像素偏移，支持 `[x, y]` 数组或 `AMap.Pixel`。 |
| `options` | `Partial<UseToolBarOptions \| UseScaleOptions \| UseControlBarOptions \| UseMapTypeOptions>` | `{}` | 传给控件的额外 JSAPI 配置。每个组件会把该联合类型收窄为自己的 hook 类型（见下文）。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.ToolBar \| AMap.Scale \| AMap.ControlBar \| AMap.MapType` | 控件创建并添加到地图后触发一次。 |

## 最小示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showZoomBar = ref(true)
const showControlButton = ref(true)
const mapTypeDefaultType = ref<0 | 1>(0)
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="12" style="height: 320px">
    <AmapToolBar position="RT" :offset="[16, 16]" />
    <AmapScale :offset="[16, 86]" />
    <AmapControlBar
      :show-zoom-bar="showZoomBar"
      :show-control-button="showControlButton"
    />
    <AmapMapType
      :default-type="mapTypeDefaultType"
      :show-traffic="false"
      :show-road="true"
    />
  </AmapMap>
</template>
```

响应式切换 props 可以重新定位控件、展示高级开关，或在不销毁底层 JSAPI 实例的情况下隐藏控件。

<ClientOnly>
  <ControlsDemo />
</ClientOnly>

<script setup lang="ts">
import ControlsDemo from '../examples/ControlsDemo.vue'
</script>

### 组件专属参数

- **`<AmapControlBar>`**：支持 `showZoomBar` 和 `showControlButton`，用于微调缩放滑杆与旋转/倾斜开关。额外 ControlBar 配置（如 `liteStyle`）可通过 `options: Partial<UseControlBarOptions>` 传入。
- **`<AmapMapType>`**：支持 `defaultType`（0 为标准图，1 为卫星图）、`showTraffic` 和 `showRoad`，用于展示快捷开关。由于这些是初始化配置，响应式变化时封装层会重建 JSAPI 控件，从而更新当前地图类型。其他 MapType 配置（如自定义图层列表）也可通过 `options: Partial<UseMapTypeOptions>` 传入。

### 定位提示

- 多个控件可复用同一个 `position`，再用递增的 `offset` 错开位置。
- `[x, y]` 偏移值以锚点角落为基准，单位为 CSS 像素。控件锚定在顶部时，使用正 `y` 值可向下移动。
- 控件可以混合摆放，例如将 `<AmapToolBar>` 放在 `RT`，同时把 `<AmapScale>` 锚定到 `LB`，避免遮挡覆盖物。

### 常见错误

- 控件必须放在 `<AmapMap>` 内部，才能访问注入的地图上下文。开发环境缺少上下文时会给出 warning。
- 同一个角落重复加载同类控件且不调整 `offset` 会发生重叠。请为每个实例设置偏移，或按断点隐藏重复控件。
- 将 `<AmapMapType>` 与 `<AmapTrafficLayer>` 搭配使用时，优先使用控件内置交通开关（`showTraffic`），避免状态冲突。

### TS 签名

```ts
export interface ToolBarProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  options?: Partial<UseToolBarOptions>
}

export interface ScaleProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  options?: Partial<UseScaleOptions>
}

export interface ControlBarProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  showZoomBar?: boolean
  showControlButton?: boolean
  options?: Partial<UseControlBarOptions>
}

export interface MapTypeProps {
  visible?: boolean
  position?: string
  offset?: PixelLike
  defaultType?: number
  showTraffic?: boolean
  showRoad?: boolean
  options?: Partial<UseMapTypeOptions>
}

type ControlReadyPayload = AMap.ToolBar | AMap.Scale | AMap.ControlBar | AMap.MapType
```

这些接口复用了 `@amap-vue/shared` 中的 `PixelLike` 类型，以及 `@amap-vue/hooks` 导出的 hook 配置类型。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
