# `useRectangle`

Imperatively control an `AMap.Rectangle` overlay from Vue state. The composable creates the rectangle when the map is ready, keeps options reactive, and exposes helpers for bounds, visibility, and metadata.

```ts
import { useRectangle } from '@amap-vue/hooks'

const rectangle = useRectangle(() => map.value, () => ({
  bounds: bounds.value,
  strokeColor: '#20c997',
  fillColor: 'rgba(32, 201, 151, 0.35)',
}))

rectangle.on('click', event => console.log(event))
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `bounds` | `BoundsLike` | Rectangle bounds. Pass `undefined` to keep the previous value. |
| `visible` | `boolean` | Show or hide the overlay without destroying it. |
| `…options` | `Partial<AMap.RectangleOptions>` | Additional JSAPI options forwarded to `setOptions`. |

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Rectangle \| null>` containing the rectangle instance. |
| `setBounds(bounds)` | Update bounds at runtime. Automatically normalises to `AMap.Bounds`. |
| `setOptions(options)` | Forward additional options. |
| `setExtData(extData)` | Attach metadata to the rectangle. |
| `show()` / `hide()` | Toggle visibility explicitly. |
| `destroy()` | Dispose of the rectangle and remove listeners. |
| `on(event, handler)` / `off(event, handler)` | Subscribe to JSAPI events such as `click` or `mouseover`. |

## Live example

<ClientOnly>
  <UseRectangleHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseRectangleHookDemo from '../examples/hooks/UseRectangleHookDemo.vue'
</script>

### Tips

- `bounds` accepts arrays, `AMap.Bounds`, or any structure supported by `toBounds`; the hook normalises to native bounds automatically.
- Combine with editor hooks (`useEditorRectangle`) or the mouse tool to let users draw and edit rectangles interactively.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
