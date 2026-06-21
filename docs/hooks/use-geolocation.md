# `useGeolocation`

通过适配 Composition API 的封装访问 JSAPI 定位服务。该 hook 会按需加载 `AMap.Geolocation`，暴露 Promise 风格工具，并帮你管理连续定位的 watcher ID。

```ts
import { useGeolocation } from '@amap-vue/hooks'

const geolocation = useGeolocation({ enableHighAccuracy: true })

const result = await geolocation.getCurrentPosition()
if (result)
  console.log(result.position.toString())
```

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 自定义 Key、插件或安全密钥时使用的加载器配置。 |
| ...`AMap.Geolocation.Options` | `Partial<AMap.Geolocation.Options>` | 原生选项，例如 `timeout`、`zoomToAccuracy`、`GeoLocationFirst`。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `geolocation` | `ShallowRef<AMap.Geolocation \| null>`，指向已创建的插件实例。 |
| `getCurrentPosition()` | 返回一次定位快照的 Promise。 |
| `watchPosition(handler)` | 开始连续定位，解析为数字 watcher ID 或 `null`。 |
| `clearWatch(id?)` | 停止指定 watcher；不传 ID 时停止全部 watcher。 |
| `getCityInfo()` | 获取当前省市信息。 |
| `setOptions(options)` | 不重建实例即可更新插件配置。 |
| `destroy()` | 清空 watcher 并释放插件实例。 |

### 说明

- 组件卸载时始终调用 `clearWatch` / `destroy`，避免后台计时器残留。
- 可以监听解析后的坐标，并与 `<AmapWeatherPanel>` 或自定义覆盖物组合使用。
- 部分浏览器要求 HTTPS 与明确的用户授权后才会返回定位结果。

## 完整示例

<ClientOnly>
  <UseGeolocationHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseGeolocationHookDemo from '../examples/hooks/UseGeolocationHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
