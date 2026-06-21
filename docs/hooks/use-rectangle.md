# `useRectangle`

通过 Vue 状态命令式控制 `AMap.Rectangle` 覆盖物。该组合式函数会在地图就绪后创建矩形，保持选项响应式，并暴露范围、可见性、元数据相关方法。

```ts
import { useRectangle } from '@amap-vue/hooks'

const rectangle = useRectangle(() => map.value, () => ({
  bounds: bounds.value,
  strokeColor: '#20c997',
  fillColor: 'rgba(32, 201, 151, 0.35)',
}))

rectangle.on('click', event => console.log(event))
```

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `bounds` | `BoundsLike` | 矩形范围。传入 `undefined` 会保留上一次取值。 |
| `visible` | `boolean` | 显示或隐藏覆盖物但不销毁实例。 |
| `…options` | `Partial<AMap.RectangleOptions>` | 透传给 `setOptions` 的额外 JSAPI 选项。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Rectangle \| null>`，包含矩形实例。 |
| `setBounds(bounds)` | 运行时更新范围，并自动规范化为 `AMap.Bounds`。 |
| `setOptions(options)` | 转发额外选项。 |
| `setExtData(extData)` | 为矩形绑定元数据。 |
| `show()` / `hide()` | 显式切换可见性。 |
| `destroy()` | 销毁矩形并移除监听器。 |
| `on(event, handler)` / `off(event, handler)` | 订阅 `click`、`mouseover` 等 JSAPI 事件。 |

## 在线示例

<ClientOnly>
  <UseRectangleHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseRectangleHookDemo from '../examples/hooks/UseRectangleHookDemo.vue'
</script>

### 说明

- `bounds` 接收数组、`AMap.Bounds` 或任何 `toBounds` 支持的结构；hook 会自动规范化为原生范围。
- 配合编辑器 hook（`useEditorRectangle`）或鼠标工具，可以让用户交互式绘制和编辑矩形。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
