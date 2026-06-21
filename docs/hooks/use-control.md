# `useControl`, `useToolBar`, `useScale`, `useControlBar`, `useMapType`

通过 Vue 状态驱动 JSAPI 地图控件。底层 `useControl` 是各类控件 hooks 的基础，支持
组件响应属性变化，并在需要自定义行为时直接访问控件实例。

```ts
import { useToolBar } from '@amap-vue/hooks'

const control = useToolBar(() => map.value, () => ({
  position: 'RT',
  offset: [16, 16],
  showZoomBar: true,
}))

control.show()
control.setOptions({ liteStyle: true })
```

## 参数

这些 hooks 接收对应的 JSAPI 选项（例如 `ToolBarOptions`），并额外支持下列通用字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `visible` | `boolean` | 切换控件可见性但不销毁实例。 |
| `position` | `any` | 锚定角落（`'LT'`、`'RT'` 等），会透传给 JSAPI 控件。 |
| `offset` | `PixelLike` | 相对锚点的像素偏移，数组会转换为 `AMap.Pixel`。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `control` | `ShallowRef<TControl \| null>`，指向控件实例。 |
| `show()` / `hide()` | 以命令式方式切换可见性。 |
| `setPosition(position)` | 将控件移动到另一个角落。 |
| `setOffset(offset)` | 更新偏移量（支持 `PixelLike`）。 |
| `setOptions(options)` | 将任意选项转发给 JSAPI 控件。 |
| `destroy()` | 从地图上移除控件并清理监听器。 |

### 说明

- hook 首次运行时会懒加载所需插件（`AMap.ToolBar`、`AMap.Scale` 等），无需手动调用 `loader.config`。
- 地图引用变化时（例如重新挂载 `<AmapMap>`），控件会自动重新挂载。
- 优先切换响应式 `visible` 选项，而不是条件渲染组件，这样可以复用同一个控件实例。

## 在线示例

<ClientOnly>
  <UseControlHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseControlHookDemo from '../examples/hooks/UseControlHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
