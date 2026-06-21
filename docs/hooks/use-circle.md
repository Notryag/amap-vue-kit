# `useCircle`

以响应式方式控制圆形覆盖物。该 hook 会同步中心点与半径状态，规范化 `LngLatLike` 坐标，并处理可见性切换。

```ts
import { useCircle } from '@amap-vue/hooks'
import { ref } from 'vue'

const circleOptions = ref({
  center: [116.397, 39.908],
  radius: 500,
  strokeColor: '#ff6d00',
  fillColor: 'rgba(255, 109, 0, 0.2)',
})

const circleApi = useCircle(() => map.value, circleOptions)

circleApi.on('dragend', () => {
  console.log('圆形已移动')
})
```

`useCircle` 是 `<AmapCircle>` 的命令式对应写法；组合更大组件时，可以在两者之间复用选项对象。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Circle \| null>`，指向圆形实例。 |
| `setCenter` | 使用 `LngLatLike` 更新中心点，并转换为 `AMap.LngLat`。 |
| `setRadius` | 调整半径，单位为米。 |
| `setOptions` | 代理到 `Circle#setOptions`，用于更新样式。 |
| `setExtData` | 为圆形附加任意元数据。 |
| `show` / `hide` | 切换可见性但不销毁覆盖物。 |
| `destroy` | 从地图上移除圆形并清理监听器。 |

### 说明

- 设置响应式 `visible` 选项会自动隐藏或显示圆形。
- 当地图引用变为 `null` 时，圆形会自动解绑；地图实例再次可用后会重新挂载。

## 在线示例

<ClientOnly>
  <UseCircleHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseCircleHookDemo from '../examples/hooks/UseCircleHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
