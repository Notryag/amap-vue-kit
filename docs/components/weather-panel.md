# `<AmapWeatherPanel>`

通过封装 `useWeather` 的面板展示实时天气和天气预报。组件内置城市下拉选择、刷新按钮，并暴露命令式方法，便于更深度集成。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 当前选中的城市，支持 `v-model`。 |
| `cities` | `string[]` | `['北京', '上海', '广州', '深圳']` | 下拉框中展示的可选城市列表。 |
| `auto` | `boolean` | `true` | 组件挂载或城市变化时自动获取天气数据。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 传给 `useWeather` 的自定义加载配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 用户选择其他城市时触发。 |
| `ready` | `AMap.Weather` | 天气服务初始化后触发一次。 |
| `error` | `string` | 请求失败或返回空数据时触发。 |

## 最小示例

```vue
<AmapWeatherPanel v-model="city" :cities="['北京', '上海', '深圳']" @error="handleError" />
```

组件会通过 `ref` 暴露 `weather`、`live`、`forecast`、`loading`、`error` 和 `refresh`。如果需要更细粒度控制或后台刷新，可以直接搭配 [`useWeather`](/hooks/use-weather) 使用。

<ClientOnly>
  <WeatherPanelDemo />
</ClientOnly>

<script setup lang="ts">
import WeatherPanelDemo from '../examples/WeatherPanelDemo.vue'
</script>

### TS 签名

```ts
export interface WeatherPanelProps {
  modelValue?: string
  cities?: string[]
  auto?: boolean
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- 面板挂载前请提供 `VITE_AMAP_KEY` 并启用 `AMap.Weather` 插件，否则不会加载数据。
- 监听 `error` 事件，将网络或配额问题反馈给用户，并考虑重试策略。
- `auto` 为 `false` 时，更新 `modelValue` 后需要手动调用暴露的 `refresh(city)` 方法。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
