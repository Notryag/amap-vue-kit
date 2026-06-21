# `useBezierCurve`

以命令式方式管理贝塞尔曲线。

```ts
const curve = useBezierCurve(() => map.value, () => ({
  path: [
    [[116.35, 39.9], [116.36, 39.94], [116.38, 39.96], [116.41, 39.97]],
  ],
  strokeColor: '#13c2c2',
}))

curve.on('click', (event) => {
  console.log('点击贝塞尔曲线', event)
})
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.BezierCurve \| null>`，指向曲线实例。 |
| `setPath`, `setOptions`, `setExtData` | 命令式 setter。 |
| `show` / `hide` | 切换可见性。 |
| `on` / `off` | 监听曲线事件。 |
| `destroy` | 移除覆盖物。 |

## 完整示例

<ClientOnly>
  <UseBezierCurveHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseBezierCurveHookDemo from '../examples/hooks/UseBezierCurveHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
