# `useOverlay`

`useOverlay` 是用于构建覆盖物组合式函数的底层辅助方法。多边形、折线、圆形等组件内部会使用它；任何暴露 `setMap` 的覆盖物都可以用它封装。

```ts
const { overlay, destroy } = useOverlay(
  () => map.value,
  () => ({ path, strokeColor: '#4b8bff' }),
  ({ AMap, map, options }) => {
    const polyline = new AMap.Polyline({
      ...options,
      map,
      path: options.path
    })
    return polyline
  },
  (polyline, options) => {
    polyline.setOptions(options)
  }
)
```

`useOverlay` 会延迟到地图和 JSAPI 都就绪后再创建实例，自动重新绑定监听器，并在卸载时清理资源。

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

1. `mapRef`：返回当前地图实例的 getter。
2. `options`：传给 factory 和 updater 的响应式选项。
3. `factory`：接收 `{ AMap, map, options }`，必须返回带 `setMap` 的覆盖物。
4. `updater`（可选）：响应式选项变化时调用。
5. `loadOptions`（可选）：额外加载器配置，例如插件、超时等。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<TOverlay | null>`，指向创建出的覆盖物。 |
| `on` / `off` | 注册 JSAPI 事件监听器，并在实例重建后继续保留。 |
| `destroy` | 从地图移除覆盖物并释放引用。 |

## 完整示例

<ClientOnly>
  <UseOverlayHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseOverlayHookDemo from '../examples/hooks/UseOverlayHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
