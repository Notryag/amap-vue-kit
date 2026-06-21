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

## 最小示例

最小用法见下方示例；hooks 通常接收 `() => map.value` 形式的地图引用，以兼容延迟挂载和 SSR。

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

## 完整示例

<ClientOnly>
  <UseGeocoderHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseGeocoderHookDemo from '../examples/hooks/UseGeocoderHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)

## TS 签名

本 hook 的参数、返回值和辅助类型由 `@amap-vue/hooks` 的 `.d.ts` 文件导出；上方参数和返回值表与发布类型保持同步。

## 常见错误

- 始终传入惰性的地图引用，例如 `() => map.value`，避免地图尚未创建时同步访问实例。
- 需要插件的 hook 会按需加载 JSAPI 插件；如果自定义组合多个插件，请在 `useMap` 或 loader 配置中保持插件名一致。
- 组件卸载会自动清理；在组件外使用 hook 时，请按需调用返回值里的 `destroy()`。
