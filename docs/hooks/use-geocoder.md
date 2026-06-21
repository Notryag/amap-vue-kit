# `useGeocoder`

在组合式 API 中完成正向和逆向地理编码。该组合式函数会惰性加载 `AMap.Geocoder` 插件，暴露 Promise 风格方法，也可以搭配 `<AmapReverseGeocodePanel>` 快速得到可用 UI。

```ts
import { useGeocoder } from '@amap-vue/hooks'

const geocoder = useGeocoder({
  city: '北京',
})

const result = await geocoder.getLocation('天安门')
if (result)
  console.log(result.geocodes[0].location)
```

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 额外加载配置，包括 key、安全密钥和插件。 |
| ...`AMap.Geocoder.Options` | `Partial<AMap.Geocoder.Options>` | 原生地理编码选项，例如 `batch`、`extensions` 或默认 `city`。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `geocoder` | `ShallowRef<AMap.Geocoder \| null>`，指向底层实例。 |
| `getLocation(address, city?)` | 将地址字符串解析为地理编码结果（正向地理编码）。 |
| `getAddress(position)` | 将坐标解析为可读地址（逆向地理编码）。 |
| `setOptions(options)` | 运行时更新地理编码选项。 |
| `destroy()` | 销毁实例并释放引用。 |

### 说明

- JSAPI 返回 `no_data` 时，`getLocation` 与 `getAddress` 会返回 `null`；请在 UI 中处理兜底状态。
- 切换城市或 `extensions` 标记时，优先调用 `setOptions`，无需重新创建 hook。
- 可搭配 [`<AmapReverseGeocodePanel>`](/components/reverse-geocode-panel) 使用内置加载和错误状态的面板。

## 在线示例

<ClientOnly>
  <UseGeocoderHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseGeocoderHookDemo from '../examples/hooks/UseGeocoderHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
