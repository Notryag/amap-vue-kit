# `useLabelsLayer`

以命令式方式管理 JSAPI `LabelsLayer`，同时保持 Vue 响应式。该组合式函数会惰性加载 `AMap.LabelsLayer` 插件，将图层挂载到传入地图，并在响应式配置变化时更新可见性和透明度。

```ts
import { useLabelMarker, useLabelsLayer } from '@amap-vue/hooks'
import { ref } from 'vue'

const markers = ref(points)
const labelsLayer = useLabelsLayer(() => map.value, () => ({
  visible: true,
  zooms: [10, 20],
  collision: true,
}))

markers.value.forEach((item) => {
  useLabelMarker(labelsLayer, { position: item.position, text: item.text })
})
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.LabelsLayer \| null>`，指向图层实例。 |
| `ready` | 注册图层可用后执行的回调。 |
| `setOptions` | 调用 `layer.setOptions()` 进行增量更新。 |
| `setOpacity` / `setZIndex` | 不重建图层即可调整样式属性。 |
| `show` / `hide` | 切换可见性；响应式 `visible` 配置变化时也会触发。 |
| `add` / `remove` | 挂载或移除一个或多个 `LabelMarker` 实例。 |
| `clear` | 从图层中移除所有已注册标记。 |
| `destroy` | 销毁图层并从地图解绑。 |

### 说明

- 该组合式函数会深度监听响应式配置，因此 `collision`、`visible` 和 `opacity` 会自动更新。
- 当地图引用变为 `null` 时，图层会自动解绑；地图再次可用后会重新挂载。
- 编写模板时优先使用更高层的 `<AmapLabelsLayer>` 组件；`useLabelsLayer` 更适合自定义渲染器或服务端驱动场景。

## 在线示例

<ClientOnly>
  <UseLabelsLayerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseLabelsLayerHookDemo from '../examples/hooks/UseLabelsLayerHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
