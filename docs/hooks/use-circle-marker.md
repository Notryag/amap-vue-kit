# `useCircleMarker`

以命令式方式管理 JSAPI 圆点标记，适合渲染大量简单点位。

```ts
const circle = useCircleMarker(() => map.value, () => ({
  center: [116.397, 39.908],
  radius: 10,
  options: {
    strokeColor: '#1677ff',
    fillColor: 'rgba(22, 119, 255, 0.45)',
  },
}))

circle.on('click', () => console.log('点击圆点标记'))
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.CircleMarker \| null>`，指向标记实例。 |
| `setCenter`, `setRadius`, `setOptions`, `setExtData` | 对应 JSAPI 方法的命令式 setter。 |
| `show` / `hide` | 切换可见性。 |
| `on` / `off` | 订阅标记事件。 |
| `destroy` | 从地图上移除标记。 |

## 完整示例

<ClientOnly>
  <UseCircleMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseCircleMarkerHookDemo from '../examples/hooks/UseCircleMarkerHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
