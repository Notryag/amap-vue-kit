# `useContextMenu`

Control JSAPI context menus from setup code. The composable lazy-loads `AMap.ContextMenu`, keeps menu items reactive, and exposes `open`/`close` helpers so you can trigger menus programmatically.

```ts
import { useContextMenu } from '@amap-vue/hooks'

const menu = useContextMenu(() => map.value, () => ({
  items: [
    { text: 'Zoom in', handler: () => map.value?.zoomIn?.() },
    { text: 'Drop marker', handler: ({ lnglat }) => console.log(lnglat) },
  ],
}))

map.value?.on('rightclick', event => menu.open(event.lnglat))
```

## Options

| Key | Type | Description |
| --- | --- | --- |
| `items` | `ContextMenuItem[]` | Menu definitions. Each item has `text`, `handler`, and optional `index`. |
| `options` | `Partial<AMap.ContextMenuOptions>` | Extra JSAPI options. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | Loader configuration when creating the menu. |

## Return value

| Key | Description |
| --- | --- |
| `menu` | `ShallowRef<AMap.ContextMenu \| null>` referencing the menu instance. |
| `open(position)` | Open the menu at a `LngLatLike` location. Automatically resolves arrays to native `LngLat`. |
| `close()` | Hide the menu. |
| `addItem(item)` / `removeItem(item)` | Mutate menu entries on the fly. |
| `destroy()` | Dispose of the menu and detach listeners. |
| `on(event, handler)` / `off(event, handler)` | Subscribe to JSAPI menu events. |

## Live example

<ClientOnly>
  <UseContextMenuHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseContextMenuHookDemo from '../examples/hooks/UseContextMenuHookDemo.vue'
</script>

### Tips

- When using map right-click events, remember to remove listeners in `onBeforeUnmount` or by calling `destroy()`.
- `loadOptions` is handy when you need to load the menu from a different CDN or with security parameters than the main map.
- Call `addItem`/`removeItem` with stable object references to keep the internal diff clean.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
