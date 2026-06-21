# `useHeatMap`

在组合式 API 中驱动热力图插件。该 hook 会等 JSAPI 和地图都就绪后再创建实例，
并在响应式选项变化时同步数据集。

```ts
import { useHeatMap } from '@amap-vue/hooks'

const heatMap = useHeatMap(() => map.value, () => ({
  data: points.value,
  radius: 32,
  gradient: gradients.sunset,
}))

watch(points, (next) => {
  heatMap.setDataSet({ data: next, max: 120 })
})
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.HeatMap \| null>`，指向热力图实例。 |
| `ready` | 注册插件创建完成后触发的回调。 |
| `setOptions` | 更新 `radius`、`opacity`、`gradient` 等插件选项。 |
| `setDataSet` | 替换完整数据集（`{ data, max }`），hook 会缓存最新取值。 |
| `addDataPoint` | 不重建数据集即可追加单个点。 |
| `show` / `hide` | 以命令式方式切换可见性。 |
| `destroy` | 销毁热力图并释放引用。 |

### 说明

- hook 会自动请求 `AMap.HeatMap` 插件，无需通过 `loader.config` 预加载。
- `data` 选项会被深度监听。向响应式数组追加数据会触发增量更新，而不会重建实例。
- 当地图引用变为 `null` 时，热力图会自动解绑，并等待新的地图实例后重新挂载。

## 在线示例

<ClientOnly>
  <UseHeatMapHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseHeatMapHookDemo from '../examples/hooks/UseHeatMapHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
