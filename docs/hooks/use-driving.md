# `useDriving`

以编程方式使用高德驾车路线服务。该组合式函数按需加载驾车插件，支持绑定地图，并暴露路线搜索与清理方法。

```ts
import { useDriving } from '@amap-vue/hooks'

const driving = useDriving({ map })
const result = await driving.search('天安门', '故宫')
```

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

## 在线示例

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
