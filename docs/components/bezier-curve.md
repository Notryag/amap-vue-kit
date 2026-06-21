# `<AmapBezierCurve>`

使用 JSAPI 插件渲染贝塞尔折线。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `BezierCurvePath` | 贝塞尔曲线片段数组，每段为 `[start, ctrl1, ctrl2, end]` 四点数组。 |
| `visible` | `boolean` | 控制可见性。 |
| `extData` | `any` | 自定义元数据。 |
| `options` | `Partial<AMap.BezierCurveOptions>` | 额外 JSAPI 选项。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.BezierCurve` | 曲线创建完成后触发。 |
| `click` | `any` | 点击事件。 |
| `mouseover` | `any` | 鼠标移入事件。 |
| `mouseout` | `any` | 鼠标移出事件。 |

## 最小示例

```vue
<AmapMap :center="[116.4, 39.93]" :zoom="12" style="height: 320px">
  <AmapBezierCurve
    :path="[
      [[116.35, 39.9], [116.36, 39.94], [116.38, 39.96], [116.41, 39.97]],
      [[116.41, 39.97], [116.43, 39.96], [116.45, 39.92], [116.46, 39.9]]
    ]"
    :options="{ strokeColor: '#722ed1', strokeWeight: 4 }"
  />
</AmapMap>
```

## 完整示例

<ClientOnly>
  <BezierCurveComponentDemo />
</ClientOnly>

<script setup lang="ts">
import BezierCurveComponentDemo from '../examples/BezierCurveComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本组件的 props、emits 与插槽类型由 `@amap-vue/core` 的 `.d.ts` 文件导出；上方属性和事件表与发布类型保持同步。

## 常见错误

- 地图空白时，先确认容器有明确高度，并已配置有效的高德 JSAPI Key。
- 需要插件的组件应通过组件内部自动加载或在 `<AmapMap :plugins>` 中提前声明，避免实例创建时插件缺失。
- 在 SSR 环境中不要在 setup 顶层直接访问 `window` 或 `AMap`；等待 `ready` 事件后再读取实例。
