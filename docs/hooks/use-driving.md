# `useDriving`

以编程方式使用高德驾车路线服务。该组合式函数按需加载驾车插件，支持绑定地图，并暴露路线搜索与清理方法。

```ts
import { useDriving } from '@amap-vue/hooks'

const driving = useDriving({ map })
const result = await driving.search('天安门', '故宫')
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| ...`AMap.Driving.Options` | `Partial<AMap.Driving.Options>` | 原生驾车路线配置，例如 `policy`、`ferry`、`hideMarkers` 等。 |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | Bind the driving service to an existing map instance. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 传给 `loader.load` 的自定义 Key 或插件配置。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `driving` | `ShallowRef<AMap.Driving \| null>` exposing the underlying service. |
| `search(origin, destination, options?)` | Compute a driving route between two endpoints. |
| `setOptions(options)` | Update native driving options. |
| `setMap(map)` | Rebind the service to a different map instance. |
| `clear()` | 清空已渲染路线和面板。 |
| `destroy()` | 销毁服务实例并从地图解绑。 |

## 完整示例

<ClientOnly>
  <UseDrivingHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseDrivingHookDemo from '../examples/hooks/UseDrivingHookDemo.vue'
</script>

### 说明

- 如果希望 JSAPI 自动绘制路线折线，请传入 `map`。
- You can pass a custom `panel` element via `AMap.Driving.Options` if you need a summary list.
- Route planning returns `null` when the JSAPI responds with `no_data` or an error.

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
