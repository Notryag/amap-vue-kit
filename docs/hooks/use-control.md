# `useControl`, `useToolBar`, `useScale`, `useControlBar`, `useMapType`

Drive JSAPI map controls from Vue state. The base `useControl` helper powers the specialised hooks exported by the kit, letting
components react to prop changes and giving you direct access when you need custom behaviour.

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

## Options

The hooks accept the corresponding JSAPI options (for example `ToolBarOptions`) plus the shared keys below:

| Key | Type | Description |
| --- | --- | --- |
| `visible` | `boolean` | Toggles the control without destroying it. |
| `position` | `any` | Corner to anchor to (`'LT'`, `'RT'`, etc.). Passed through to the JSAPI control. |
| `offset` | `PixelLike` | Pixel offset from the anchor corner. Arrays are converted to `AMap.Pixel`. |

## Return value

| Key | Description |
| --- | --- |
| `control` | `ShallowRef<TControl \| null>` referencing the control instance. |
| `show()` / `hide()` | Imperatively toggle visibility. |
| `setPosition(position)` | Move the control to another corner. |
| `setOffset(offset)` | Update the offset (accepts `PixelLike`). |
| `setOptions(options)` | Forward arbitrary options to the JSAPI control. |
| `destroy()` | Remove the control from the map and clean up listeners. |

### Notes

- The hook lazily loads the required plugin (`AMap.ToolBar`, `AMap.Scale`, etc.) the first time it runs. No manual `loader.config` call is required.
- Controls automatically reattach themselves if the map reference changes (for example, when remounting `<AmapMap>`).
- Prefer toggling the reactive `visible` option over conditional rendering so the control instance can be reused.

## Live example

<ClientOnly>
  <UseControlHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseControlHookDemo from '../examples/hooks/UseControlHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
