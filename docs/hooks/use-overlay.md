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

## 在线示例

<ClientOnly>
  <UseOverlayHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseOverlayHookDemo from '../examples/hooks/UseOverlayHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
