# `useWeather`

通过 JSAPI 天气服务查询城市实况与预报。该组合式函数会处理插件加载，并为同步 UI 或后台刷新任务暴露带类型的辅助方法。

```ts
import { useWeather } from '@amap-vue/hooks'

const weather = useWeather()

const live = await weather.getLive('北京')
const forecast = await weather.getForecast('北京')
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 加载器配置（Key、securityJsCode、插件列表）。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `weather` | `ShallowRef<AMap.Weather \| null>`，暴露 JSAPI 实例。 |
| `getLive(city)` | 获取指定城市的实时天气。 |
| `getForecast(city)` | 获取指定城市 3-4 天预报。 |
| `destroy()` | 释放插件实例和缓存引用。 |

### 说明

- 如果 JSAPI 返回 `no_data`，两个辅助方法都会返回 `null`；请在 UI 中处理兜底展示。
- 同时展示实况与预报时，可以用 `Promise.all` 批量请求。
- 可搭配 [`<AmapWeatherPanel>`](/components/weather-panel) 使用内置城市选择和展示层。

## 完整示例

<ClientOnly>
  <UseWeatherHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseWeatherHookDemo from '../examples/hooks/UseWeatherHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
