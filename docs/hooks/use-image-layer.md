# `useImageLayer`

在组合式 API 中创建并控制 `AMap.ImageLayer` 覆盖物。该 hook 会监听响应式配置，并转换 `BoundsLike`
输入，同时暴露命令式 setter 便于精细调整。

```ts
import { useImageLayer } from '@amap-vue/hooks'

const imageLayer = useImageLayer(() => map.value, () => ({
  url: currentOverlay.value.url,
  bounds: currentOverlay.value.bounds,
  opacity: 0.7,
  visible: showOverlay.value,
}))

watch(currentOverlay, (next) => {
  imageLayer.setImageUrl(next.url)
  imageLayer.setBounds(next.bounds)
})
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 要显示的图片 URL。 |
| `bounds` | `BoundsLike` | 图片地理范围，数组会转换为 `AMap.Bounds`。 |
| `visible` | `boolean` | 显示或隐藏覆盖物。 |
| `opacity` | `number` | 图片相对底图的透明度。 |
| `zIndex` | `number` | 渲染顺序。 |
| `…options` | `Partial<AMap.ImageLayerOptions>` | 创建时透传的额外 JSAPI 选项。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.ImageLayer \| null>`，指向图片图层实例。 |
| `show()` / `hide()` | 切换可见性但不重建图层。 |
| `setImageUrl(url)` | 运行时切换图片 URL。 |
| `setBounds(bounds)` | 更新地理范围（支持 `BoundsLike`）。 |
| `setOpacity(opacity)` | 动态调整透明度。 |
| `setzIndex(zIndex)` | 调整图层相对其他图层的层级。 |
| `setOptions(options)` | 将任意选项转发给 JSAPI 实例。 |
| `destroy()` | 从地图上移除图层并释放引用。 |

### 说明

- hook 首次运行时会自动请求 `AMap.ImageLayer` 插件。
- 地图引用变为 `null` 时，图层会自动解绑；新的地图实例传入后会重新挂载。
- 范围与偏移会通过 `@amap-vue/shared` 的共享工具规范化，因此可以安全传入数组简写。

## 完整示例

<ClientOnly>
  <UseImageLayerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseImageLayerHookDemo from '../examples/hooks/UseImageLayerHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
