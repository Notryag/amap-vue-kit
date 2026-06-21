# `<AmapOverlayGroup>`

批量管理大量覆盖物，无需逐个处理生命周期 hook。组件封装了 `AMap.OverlayGroup`，支持切换数据集、整体显示/隐藏分组，并通过 `ref` 调用命令式辅助方法。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `overlays` | `any[]` | `[]` | 要管理的 JSAPI 覆盖物实例数组。每一项应由 `new AMap.Marker(...)`、`new AMap.Circle(...)` 等创建。 |
| `visible` | `boolean` | `true` | 显示或隐藏整个分组，但不重建内容。 |
| `extData` | `any` | – | 透传给底层覆盖物分组的任意元数据。 |
| `options` | `Record<string, any>` | `{}` | 传给 JSAPI 构造函数的额外配置。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.OverlayGroup` | 分组实例创建并挂载到地图后触发一次。 |

## 最小示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const overlays = ref<AMap.Marker[]>([])
const showGroup = ref(true)
const groupRef = ref<any>(null)

function clearGroup() {
  groupRef.value?.clearOverlays?.()
}
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell">
    <AmapOverlayGroup ref="groupRef" :overlays="overlays" :visible="showGroup" />
  </AmapMap>
  <button type="button" @click="clearGroup">
    清空覆盖物
  </button>
</template>
```

可以通过组件 ref 调用暴露方法，以命令式方式修改分组：

```ts
const api = groupRef.value
api?.addOverlays(nextBatch)
api?.clearOverlays()
api?.hide()
```

<ClientOnly>
  <OverlayGroupDemo />
</ClientOnly>

<script setup lang="ts">
import OverlayGroupDemo from '../examples/OverlayGroupDemo.vue'
</script>

### 暴露方法

`<AmapOverlayGroup>` 通过 `defineExpose` 暴露覆盖物分组引用和工具方法：

- `group`：底层 `AMap.OverlayGroup` 的 shallow ref。
- `addOverlay(overlay)`、`addOverlays(overlays)`：批量追加覆盖物。
- `removeOverlay(overlay)`、`removeOverlays(overlays)`：从分组中移除覆盖物。
- `clearOverlays()`：移除分组管理的全部覆盖物。
- `getOverlays()`：获取当前覆盖物列表快照。

### TS 签名

```ts
export interface OverlayGroupProps {
  overlays?: any[]
  visible?: boolean
  extData?: any
  options?: Record<string, any>
}

type OverlayGroupReadyPayload = AMap.OverlayGroup
```

### 常见错误

- 传入组件前覆盖物必须已完成实例化。切换数据集时，请释放旧数组（例如对标记调用 `setMap(null)`）以避免泄漏。
- 该组件不会渲染子内容。请在其他位置渲染交互 UI，并响应式修改 `overlays` prop。
- 如果需要单个覆盖物级别的响应式，可结合 watcher 在数据变化时重建 `overlays` 数组。

### 完整示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
