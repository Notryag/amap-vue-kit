# `<AmapCircleEditor>`, `<AmapRectangleEditor>`, `<AmapEllipseEditor>`, `<AmapPolylineEditor>`, `<AmapBezierCurveEditor>`, `<AmapPolygonEditor>`

为常见几何图形启用交互编辑，无需手动装配插件。这些轻量组件封装对应的 JSAPI 编辑器，监听 `active` 状态，并支持传入覆盖物实例或字符串标识。

## 共享 props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `target` | `AMap.Circle \| AMap.Rectangle \| AMap.Ellipse \| AMap.Polyline \| AMap.BezierCurve \| AMap.Polygon \| string \| null \| undefined` | – | 要编辑的覆盖物实例或标识。字符串会按 `overlay.getId()`、`overlay.getExtData().id`、`overlay.id` 依次解析。 |
| `active` | `boolean` | `false` | 编辑器是否打开。响应式切换即可开始或停止编辑。 |
| `options` | `Partial<AMap.CircleEditorOptions>` / `Partial<AMap.RectangleEditorOptions>` / `Partial<AMap.EllipseEditorOptions>` / `Partial<AMap.PolylineEditorOptions>` / `Partial<AMap.BezierCurveEditorOptions>` / `Partial<AMap.PolygonEditorOptions>` | `{}` | 创建时透传给插件的额外选项。每个组件会收窄到对应的编辑器类型。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.CircleEditor \| AMap.RectangleEditor \| AMap.EllipseEditor \| AMap.PolylineEditor \| AMap.BezierCurveEditor \| AMap.PolygonEditor` | 编辑器实例创建完成后触发。 |
| `adjust` | `any` | 透传拖拽控制点时触发的 JSAPI `adjust` 事件。 |
| `end` | `any` | 编辑结束后触发（`mouseup`）。 |

## 用法

```vue
<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { onBeforeUnmount, ref, shallowRef } from 'vue'

const circleEditing = ref(false)
const rectangleEditing = ref(false)
const ellipseEditing = ref(false)
const polylineEditing = ref(false)
const bezierEditing = ref(false)
const polygonEditing = ref(false)

const map = shallowRef<AMap.Map | null>(null)
const rectangle = shallowRef<AMap.Rectangle | null>(null)
const ellipse = shallowRef<AMap.Ellipse | null>(null)
const polyline = shallowRef<AMap.Polyline | null>(null)
const bezier = shallowRef<AMap.BezierCurve | null>(null)
const polygon = shallowRef<AMap.Polygon | null>(null)

async function handleReady(instance: AMap.Map) {
  map.value = instance
  const AMap = await loader.load({ plugins: ['AMap.BezierCurve'] })

  const rect = new AMap.Rectangle({
    bounds: new AMap.Bounds([116.36, 39.9], [116.41, 39.94]),
    strokeColor: '#20c997',
    fillColor: 'rgba(32, 201, 151, 0.3)',
    extData: { id: 'demo-rectangle' },
  })
  rect.setMap(instance)
  rectangle.value = rect

  const ell = new AMap.Ellipse({
    center: [116.406, 39.912],
    radius: [900, 420],
    strokeColor: '#fd7e14',
    fillColor: 'rgba(253, 126, 20, 0.25)',
    extData: { id: 'demo-ellipse' },
  })
  ell.setMap(instance)
  ellipse.value = ell

  const line = new AMap.Polyline({
    path: [
      [116.35, 39.9],
      [116.38, 39.92],
      [116.41, 39.91],
    ],
    strokeColor: '#722ed1',
    strokeWeight: 4,
  })
  line.setMap(instance)
  polyline.value = line

  const curve = new (AMap as any).BezierCurve({
    path: [
      [
        [116.36, 39.88],
        [116.38, 39.92],
        [116.4, 39.94],
        [116.42, 39.91],
      ],
    ],
    strokeColor: '#13c2c2',
    strokeWeight: 4,
  }) as AMap.BezierCurve
  curve.setMap(instance)
  bezier.value = curve

  const polygonOverlay = new AMap.Polygon({
    path: [
      [116.37, 39.9],
      [116.41, 39.9],
      [116.42, 39.93],
      [116.38, 39.94],
    ],
    strokeColor: '#fa8c16',
    fillColor: 'rgba(250, 140, 22, 0.25)',
  })
  polygonOverlay.setMap(instance)
  polygon.value = polygonOverlay
}

onBeforeUnmount(() => {
  rectangle.value?.destroy?.()
  ellipse.value?.destroy?.()
  polyline.value?.destroy?.()
  bezier.value?.destroy?.()
  polygon.value?.destroy?.()
})
</script>

<template>
  <AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell" @ready="handleReady">
    <AmapCircle
      :center="[116.397, 39.908]"
      :radius="600"
      :ext-data="{ id: 'demo-circle' }"
      :options="{ strokeColor: '#4b8bff', fillColor: 'rgba(75, 139, 255, 0.2)' }"
    />

    <AmapCircleEditor target="demo-circle" :active="circleEditing" />
    <AmapRectangleEditor :target="rectangle" :active="rectangleEditing" />
    <AmapEllipseEditor target="demo-ellipse" :active="ellipseEditing" />
    <AmapPolylineEditor :target="polyline" :active="polylineEditing" />
    <AmapBezierCurveEditor :target="bezier" :active="bezierEditing" />
    <AmapPolygonEditor :target="polygon" :active="polygonEditing" />
  </AmapMap>
</template>
```

在在线示例中可以切换每个编辑器，比较字符串标识与直接覆盖物引用两种写法，并监听 `adjust` / `end` 事件。

<ClientOnly>
  <ShapeEditorsDemo />
</ClientOnly>

<script setup lang="ts">
import ShapeEditorsDemo from '../examples/ShapeEditorsDemo.vue'
</script>

### TypeScript 签名

```ts
export interface CircleEditorProps {
  target?: AMap.Circle | string | null
  active?: boolean
  options?: Partial<AMap.CircleEditorOptions>
}

export interface RectangleEditorProps {
  target?: AMap.Rectangle | string | null
  active?: boolean
  options?: Partial<AMap.RectangleEditorOptions>
}

export interface EllipseEditorProps {
  target?: AMap.Ellipse | string | null
  active?: boolean
  options?: Partial<AMap.EllipseEditorOptions>
}

export interface PolylineEditorProps {
  target?: AMap.Polyline | string | null
  active?: boolean
  options?: Partial<AMap.PolylineEditorOptions>
}

export interface BezierCurveEditorProps {
  target?: AMap.BezierCurve | string | null
  active?: boolean
  options?: Partial<AMap.BezierCurveEditorOptions>
}

export interface PolygonEditorProps {
  target?: AMap.Polygon | string | null
  active?: boolean
  options?: Partial<AMap.PolygonEditorOptions>
}

type EditorReadyPayload = AMap.CircleEditor
  | AMap.RectangleEditor
  | AMap.EllipseEditor
  | AMap.PolylineEditor
  | AMap.BezierCurveEditor
  | AMap.PolygonEditor
```

### 常见错误

- 为目标覆盖物提供稳定的解析方式：直接传实例，或设置 `extData.id` / `id` 让字符串查找成功。
- 编辑器会懒加载对应插件（`AMap.CircleEditor`、`AMap.BezierCurveEditor` 等）；请确认当前 Key 有权限访问这些插件。
- 手动销毁覆盖物时，也要把编辑器的 `active` 设为 `false`，避免插件继续持有失效引用。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
