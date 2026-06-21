# `useEditorCircle`, `useEditorRectangle`, `useEditorEllipse`, `useEditorPolyline`, `useEditorBezierCurve`, `useEditorPolygon`

将 JSAPI 图形编辑器封装为组合式函数。每个 hook 会等地图和目标覆盖物就绪后再加载插件，同步 `active` 状态，并暴露切换目标与监听编辑事件的方法。

```ts
import { useEditorPolygon } from '@amap-vue/hooks'

const polygonEditor = useEditorPolygon(() => map.value, () => ({
  target: 'campus-fence',
  active: editing.value,
  snapDistance: 4,
}))

polygonEditor.on('end', () => {
  console.log('多边形编辑完成')
  editing.value = false
})
```

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `target` | `AMap.Circle \| AMap.Rectangle \| AMap.Ellipse \| AMap.Polyline \| AMap.BezierCurve \| AMap.Polygon \| string \| null` | 要编辑的覆盖物。字符串会通过 `overlay.getId()`、`overlay.getExtData().id` 或普通 `overlay.id` 属性解析。 |
| `active` | `boolean` | 编辑器是否打开，与 `open()` / `close()` 状态保持一致。 |
| `…options` | `Partial<AMap.CircleEditorOptions>` / `Partial<AMap.RectangleEditorOptions>` / … | 透传给对应编辑器类型的额外插件配置。每个 hook 会推断正确的 options 接口。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `editor` | `ShallowRef<TEditor \| null>`，指向当前编辑器实例。 |
| `open()` / `close()` | 以命令式方式开关编辑器，并同步更新响应式 `active` 状态。 |
| `setTarget(target)` | 运行时切换到其他覆盖物实例或标识。 |
| `getTarget()` | 获取当前绑定的覆盖物（如果存在）。 |
| `on(event, handler)` / `off(event, handler)` | 订阅 JSAPI 编辑器事件，例如 `adjust`、`end`。 |
| `destroy()` | 销毁编辑器、取消轮询并清理监听器。 |

## 说明

- 当 `target` 是字符串时，hook 会轮询 `map.getAllOverlays()` 直到覆盖物出现，因此可以在覆盖物挂载前先传入 ID。
- 更新响应式选项会触发 `editor.setOptions`，无需重建编辑器即可调整控制点（吸附距离、颜色等）。
- 手动移除目标覆盖物前，请先停用编辑器（`active = false`）或调用 `destroy()`，避免残留引用。

## 在线示例

<ClientOnly>
  <UseEditorHookDemo />
</ClientOnly>

<ClientOnly>
  <UsePolylineEditorHookDemo />
</ClientOnly>

<ClientOnly>
  <UseBezierCurveEditorHookDemo />
</ClientOnly>

<ClientOnly>
  <UsePolygonEditorHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseEditorHookDemo from '../examples/hooks/UseEditorHookDemo.vue'
import UsePolylineEditorHookDemo from '../examples/hooks/UsePolylineEditorHookDemo.vue'
import UseBezierCurveEditorHookDemo from '../examples/hooks/UseBezierCurveEditorHookDemo.vue'
import UsePolygonEditorHookDemo from '../examples/hooks/UsePolygonEditorHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
