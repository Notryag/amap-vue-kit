# `useCircle`

以响应式方式控制圆形覆盖物。该 hook 会同步中心点与半径状态，规范化 `LngLatLike` 坐标，并处理可见性切换。

```ts
import { useCircle } from '@amap-vue/hooks'
import { ref } from 'vue'

const circleOptions = ref({
  center: [116.397, 39.908],
  radius: 500,
  strokeColor: '#ff6d00',
  fillColor: 'rgba(255, 109, 0, 0.2)',
})

const circleApi = useCircle(() => map.value, circleOptions)

circleApi.on('dragend', () => {
  console.log('圆形已移动')
})
```

`useCircle` 是 `<AmapCircle>` 的命令式对应写法；组合更大组件时，可以在两者之间复用选项对象。

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Circle \| null>`，指向圆形实例。 |
| `setCenter` | 使用 `LngLatLike` 更新中心点，并转换为 `AMap.LngLat`。 |
| `setRadius` | 调整半径，单位为米。 |
| `setOptions` | 代理到 `Circle#setOptions`，用于更新样式。 |
| `setExtData` | 为圆形附加任意元数据。 |
| `show` / `hide` | 切换可见性但不销毁覆盖物。 |
| `destroy` | 从地图上移除圆形并清理监听器。 |

### 说明

- 设置响应式 `visible` 选项会自动隐藏或显示圆形。
- 当地图引用变为 `null` 时，圆形会自动解绑；地图实例再次可用后会重新挂载。

## 完整示例

<ClientOnly>
  <UseCircleHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseCircleHookDemo from '../examples/hooks/UseCircleHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
