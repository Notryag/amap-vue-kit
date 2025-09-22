# `useEditorCircle`, `useEditorRectangle`, `useEditorEllipse`

Wrap the JSAPI geometry editors in a composable. The hooks defer plugin loading until both the map and the target overlay are ready, keep the editor `active` state in sync with Vue, and expose helpers to switch targets on the fly.

```ts
import { useEditorCircle } from '@amap-vue/hooks'

const circleEditor = useEditorCircle(() => map.value, () => ({
  target: 'demo-circle',
  active: isEditing.value,
  radius: 12,
}))

circleEditor.on('end', () => {
  console.log('Circle editing completed')
})
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `target` | `AMap.Circle \| AMap.Rectangle \| AMap.Ellipse \| string \| null` | Overlay to edit. Strings resolve via `getId()` or `extData.id`. |
| `active` | `boolean` | Whether the editor should be opened. |
| `…options` | `Partial<AMap.CircleEditorOptions>` / `Partial<AMap.RectangleEditorOptions>` / `Partial<AMap.EllipseEditorOptions>` | Extra plugin configuration forwarded on creation. |

## Return value

| Key | Description |
| --- | --- |
| `editor` | `ShallowRef<TEditor \| null>` referencing the editor instance. |
| `open()` / `close()` | Imperatively toggle the editor. The reactive `active` option mirrors these calls. |
| `setTarget(target)` | Switch to a different overlay instance or identifier. |
| `getTarget()` | Retrieve the currently bound overlay (if any). |
| `on(event, handler)` / `off(event, handler)` | Subscribe to JSAPI editor events (`adjust`, `end`, …). |
| `destroy()` | Dispose of the editor and clear listeners. |

### Notes

- When a string `target` is provided the hook polls `map.getAllOverlays()` until the overlay appears, making it safe to pass IDs before overlays mount.
- Updating the reactive options triggers `editor.setOptions` so you can tweak handles (e.g. `radius`, `borderWeight`) without recreating the editor.
- Remember to destroy or deactivate the editor when removing the target overlay to prevent stale references.
