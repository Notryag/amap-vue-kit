# `useMouseTool`

Drive interactive drawing tools (circle, rectangle, polygon, polyline, bezier curve, ellipse) without wiring the JSAPI manually. The hook lazily loads `AMap.MouseTool`, keeps a single instance per map, and exposes promise-based helpers for each drawing mode.

```ts
import { useMouseTool } from '@amap-vue/hooks'

const mouseTool = useMouseTool(() => map.value)

async function drawFence() {
  const polygon = await mouseTool.drawPolygon({ strokeColor: '#1677ff' })
  console.log('Fence drawn', polygon?.getPath?.())
}
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Optional loader configuration when requesting the `MouseTool` plugin. |

## Return value

| Key | Description |
| --- | --- |
| `tool` | `ShallowRef<AMap.MouseTool \| null>` referencing the underlying mouse tool. |
| `drawCircle(options?)` | Activate circle drawing; resolves with the resulting `AMap.Circle`. |
| `drawRectangle(options?)` | Activate rectangle drawing; resolves with an `AMap.Rectangle`. |
| `drawPolygon(options?)` | Activate polygon drawing; resolves with an `AMap.Polygon`. |
| `drawPolyline(options?)` | Activate polyline drawing; resolves with an `AMap.Polyline`. |
| `drawBezierCurve(options?)` | Activate bezier drawing; resolves with an `AMap.BezierCurve`. |
| `drawEllipse(options?)` | Activate ellipse drawing; resolves with an `AMap.Ellipse`. |
| `close()` | Stop the current drawing mode. |
| `destroy()` | Dispose of the mouse tool and clear listeners. |
| `on(event, handler)` / `off(event, handler)` | Subscribe to plugin events such as `draw`. |

## Live example

<ClientOnly>
  <UseMouseToolHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseMouseToolHookDemo from '../examples/hooks/UseMouseToolHookDemo.vue'
</script>

### Tips

- The hook reuses a single `MouseTool` instance. Calling another `draw*` method automatically cancels the previous mode.
- `drawBezierCurve` requires the `AMap.BezierCurve` plugin; configure `useDemoLoader` or pass `loadOptions` with `{ plugins: ['AMap.BezierCurve'] }` when needed.
- Remember to call `close()` (or `destroy()`) when navigating away to avoid stray listeners.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
