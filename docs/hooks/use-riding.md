# `useRiding`

以编程方式使用 AMap 骑行路线服务。该组合式函数会按需加载骑行插件，支持绑定地图，并暴露搜索与清空路线的辅助方法。

```ts
import { useRiding } from '@amap-vue/hooks'

const riding = useRiding({ map })
const result = await riding.search('天安门', '北海公园')
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| ...`AMap.Riding.Options` | `Partial<AMap.Riding.Options>` | 原生骑行配置，例如 `policy`、`hideMarkers` 等。 |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | 将骑行服务绑定到已有地图实例。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 传给 `loader.load` 的自定义 Key 或插件配置。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `riding` | `ShallowRef<AMap.Riding \| null>`，暴露底层服务实例。 |
| `search(origin, destination)` | 计算两个端点之间的骑行路线。 |
| `setOptions(options)` | 更新原生骑行选项。 |
| `setMap(map)` | 将服务重新绑定到其他地图实例。 |
| `clear()` | 清空已渲染的路线和面板。 |
| `destroy()` | 销毁服务实例并从地图解绑。 |

## 完整示例

<ClientOnly>
  <UseRidingHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseRidingHookDemo from '../examples/hooks/UseRidingHookDemo.vue'
</script>

### 说明

- 提供 `map` 后，骑行路线会直接渲染到地图上。
- 如需展示结果摘要，可以通过 `AMap.Riding.Options` 传入自定义 `panel` 元素。
- 未找到路线时，hook 会解析为 `null`。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
