# `useInfoWindow`

以命令式方式结合 Vue 响应式管理 JSAPI 信息窗体。该组合式函数会等地图和 loader 就绪后再创建实例，同步打开状态，并在卸载时自动清理。

```ts
import { useInfoWindow } from '@amap-vue/hooks'
import { ref } from 'vue'

const options = ref({
  position: [116.397, 39.908],
  content: '你好，高德地图',
  open: true,
  offset: [12, 16],
})

const infoWindowApi = useInfoWindow(() => map.value, options)

infoWindowApi.on('open', () => {
  console.log('info window opened')
})
```

`useInfoWindow` powers `<AmapInfoWindow>` behind the scenes, so you can graduate from declarative slots to fully custom content strings or DOM nodes whenever necessary.

## 返回值

| 字段 | 说明 |
| --- | --- |
| `infoWindow` | `ShallowRef<AMap.InfoWindow \| null>`，指向底层实例。 |
| `open` / `close` | 以编程方式切换可见性，并保持响应式 `open` 标记同步。 |
| `setPosition`, `setOffset`, `setAnchor`, `setIsCustom`, `setContent` | Typed helpers that proxy to the matching JSAPI methods and accept Vue-friendly inputs (`LngLatLike`, `PixelLike`). |
| `setOptions` | 通过 `InfoWindow#setOptions` 批量更新其他配置。 |
| `on` / `off` | 订阅或移除 JSAPI 事件监听器。 |
| `destroy` | 销毁信息窗体并清理内部状态。 |

### 说明

- Passing reactive `open`, `position`, or `content` options keeps the JSAPI instance in sync without manual watchers.
- 当传入的地图引用变为 `null` 时，信息窗体会自动关闭；地图再次可用后会重新挂载。

## 在线示例

<ClientOnly>
  <UseInfoWindowHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseInfoWindowHookDemo from '../examples/hooks/UseInfoWindowHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
