# `useWalking`

以编程方式使用 AMap 步行路线服务。该组合式函数会懒加载步行插件，可选绑定地图，并暴露搜索与清空路线的辅助方法。

```ts
import { useWalking } from '@amap-vue/hooks'

const walking = useWalking({ map })
const result = await walking.search('天安门', '景山公园')
```

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| ...`AMap.WalkingOptions` | `Partial<AMap.WalkingOptions>` | 原生步行配置，例如 `isOutline`、`hideMarkers` 等。 |
| `map` | `MaybeRefOrGetter<AMap.Map \| null \| undefined>` | 将步行服务绑定到已有地图实例。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 传给 `loader.load` 的自定义 Key 或插件配置。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `walking` | `ShallowRef<AMap.Walking \| null>`，暴露底层服务实例。 |
| `search(origin, destination)` | 计算两个端点之间的步行路线。 |
| `setOptions(options)` | 更新原生步行选项。 |
| `setMap(map)` | 将服务重新绑定到其他地图实例。 |
| `clear()` | 清空已渲染的路线和面板。 |
| `destroy()` | 销毁服务实例并从地图解绑。 |

## 在线示例

<ClientOnly>
  <UseWalkingHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseWalkingHookDemo from '../examples/hooks/UseWalkingHookDemo.vue'
</script>

### 说明

- 提供 `map` 后，步行路线会直接渲染到地图上。
- 可以通过 `AMap.WalkingOptions` 传入自定义 `panel` 元素来展示详情。
- 未找到路线时，hook 会解析为 `null`。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
