# `useEditorCircle`, `useEditorRectangle`, `useEditorEllipse`, `useEditorPolyline`, `useEditorBezierCurve`, `useEditorPolygon`

Wrap the JSAPI geometry editors in composables. Each hook defers plugin loading until the map and target overlay are ready, keeps the `active` state in sync with Vue, and exposes helpers to switch targets or listen to edit events.

```ts
import { useEditorPolygon } from '@amap-vue/hooks'

const polygonEditor = useEditorPolygon(() => map.value, () => ({
  target: 'campus-fence',
  active: editing.value,
  snapDistance: 4,
}))

polygonEditor.on('end', () => {
  console.log('Polygon editing finished')
  editing.value = false
})
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `target` | `AMap.Circle \| AMap.Rectangle \| AMap.Ellipse \| AMap.Polyline \| AMap.BezierCurve \| AMap.Polygon \| string \| null` | Overlay to edit. Strings resolve via `overlay.getId()`, `overlay.getExtData().id`, or the plain `overlay.id` property. |
| `active` | `boolean` | Whether the editor should be opened. Mirrors `open()`/`close()`. |
| `…options` | `Partial<AMap.CircleEditorOptions>` / `Partial<AMap.RectangleEditorOptions>` / … | Additional plugin configuration forwarded to the specific editor type. Each hook infers the correct options interface. |

## Return value

| Key | Description |
| --- | --- |
| `editor` | `ShallowRef<TEditor \| null>` referencing the active editor instance. |
| `open()` / `close()` | Imperatively toggle the editor. Updates the reactive `active` flag. |
| `setTarget(target)` | Switch to a different overlay instance or identifier at runtime. |
| `getTarget()` | Retrieve the currently bound overlay (if any). |
| `on(event, handler)` / `off(event, handler)` | Subscribe to JSAPI editor events (`adjust`, `end`, etc.). |
| `destroy()` | Dispose of the editor, cancel polling, and clear listeners. |

## Notes

- When a string `target` is provided the hook polls `map.getAllOverlays()` until the overlay appears, making it safe to pass IDs before overlays mount.
- Updating the reactive options triggers `editor.setOptions`, letting you tweak handles (snap distance, color, etc.) without re-creating the editor.
- Always deactivate (`active = false`) or call `destroy()` before manually removing the target overlay to avoid stale references.

## Live demos

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

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
