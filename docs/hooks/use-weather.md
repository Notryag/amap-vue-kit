# `useWeather`

通过 JSAPI 天气服务查询城市实况与预报。该组合式函数会处理插件加载，并为同步 UI 或后台刷新任务暴露带类型的辅助方法。

```ts
import { useWeather } from '@amap-vue/hooks'

const weather = useWeather()

const live = await weather.getLive('北京')
const forecast = await weather.getForecast('北京')
```

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

## 在线示例

<ClientOnly>
  <UseWeatherHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseWeatherHookDemo from '../examples/hooks/UseWeatherHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
