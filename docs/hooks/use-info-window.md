# `useInfoWindow`

以命令式方式结合 Vue 响应式管理 JSAPI 信息窗体。该组合式函数会等地图和 loader 就绪后再创建实例，同步打开状态，并在卸载时自动清理。

```ts
import { useInfoWindow } from '@amap-vue/hooks'
import { ref } from 'vue'

const options = ref({
  position: [116.397, 39.908],
  content: '你好，高德地图',
  open: true,
  offset: [12, 16],
})

const infoWindowApi = useInfoWindow(() => map.value, options)

infoWindowApi.on('open', () => {
  console.log('info window opened')
})
```

`useInfoWindow` powers `<AmapInfoWindow>` behind the scenes, so you can graduate from declarative slots to fully custom content strings or DOM nodes whenever necessary.

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `infoWindow` | `ShallowRef<AMap.InfoWindow \| null>`，指向底层实例。 |
| `open` / `close` | 以编程方式切换可见性，并保持响应式 `open` 标记同步。 |
| `setPosition`, `setOffset`, `setAnchor`, `setIsCustom`, `setContent` | Typed helpers that proxy to the matching JSAPI methods and accept Vue-friendly inputs (`LngLatLike`, `PixelLike`). |
| `setOptions` | 通过 `InfoWindow#setOptions` 批量更新其他配置。 |
| `on` / `off` | 订阅或移除 JSAPI 事件监听器。 |
| `destroy` | 销毁信息窗体并清理内部状态。 |

### 说明

- Passing reactive `open`, `position`, or `content` options keeps the JSAPI instance in sync without manual watchers.
- 当传入的地图引用变为 `null` 时，信息窗体会自动关闭；地图再次可用后会重新挂载。

## 完整示例

<ClientOnly>
  <UseInfoWindowHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseInfoWindowHookDemo from '../examples/hooks/UseInfoWindowHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
