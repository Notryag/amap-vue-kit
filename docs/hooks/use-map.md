# `useMap`

`useMap` 是围绕地图生命周期封装的组合式函数。它会惰性加载 JSAPI、创建地图实例，并暴露命令式辅助方法。

```ts
const { map, ready, setCenter, setZoom, on, off, destroy } = useMap(() => ({
  container: containerRef,
  center: [116.397, 39.908],
  zoom: 11,
  plugins: ['AMap.ToolBar']
}))
```

`<AmapMap>` 内部也基于 `useMap`，因此两者适用同一套配置和事件语义。

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `map` | `ShallowRef<AMap.Map \| null>` | 指向地图实例的响应式引用。 |
| `ready` | `(callback: (map: AMap.Map) => void) => void` | 注册地图可用后的回调。 |
| `setCenter` | `(center?: LngLatLike) => void` | 更新中心点。 |
| `setZoom` | `(zoom?: number) => void` | 更新缩放级别。 |
| `setPitch` | `(pitch?: number) => void` | 更新俯仰角。 |
| `setRotation` | `(rotation?: number) => void` | 更新旋转角。 |
| `setMapStyle` | `(style?: string) => void` | 更新地图样式。 |
| `setTheme` | `(theme?: string) => void` | 应用已注册主题。 |
| `setViewMode` | `(mode?: AMap.MapViewMode) => void` | 切换 2D/3D 渲染模式。 |
| `on` / `off` | `(event: string, handler: (event: any) => void)` | 订阅 JSAPI 事件。 |
| `destroy` | `() => void` | 销毁地图并解绑监听器。 |

loader 是共享单例，在多个组件中调用 `useMap` 会复用同一次脚本注入与插件配置。

## 完整示例

<ClientOnly>
  <UseMapHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMapHookDemo from '../examples/hooks/UseMapHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
