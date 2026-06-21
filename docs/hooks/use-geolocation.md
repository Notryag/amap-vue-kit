# `useGeolocation`

通过适配 Composition API 的封装访问 JSAPI 定位服务。该 hook 会按需加载 `AMap.Geolocation`，暴露 Promise 风格工具，并帮你管理连续定位的 watcher ID。

```ts
import { useGeolocation } from '@amap-vue/hooks'

const geolocation = useGeolocation({ enableHighAccuracy: true })

const result = await geolocation.getCurrentPosition()
if (result)
  console.log(result.position.toString())
```

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

## 在线示例

<ClientOnly>
  <UseGeolocationHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseGeolocationHookDemo from '../examples/hooks/UseGeolocationHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
