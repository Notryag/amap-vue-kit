# `<AmapContextMenu>`

Add contextual actions to right-click interactions on the map. `<AmapContextMenu>` wraps `AMap.ContextMenu`, keeps menu items reactive, and exposes imperative helpers via `ref`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ContextMenuItem[]` | `[]` | Menu entries rendered in order. Each item defines `text`, a `handler`, and an optional insertion `index`. |
| `options` | `Partial<AMap.ContextMenuOptions>` | `{}` | Extra JSAPI options such as `width` or `isCustom`. |
| `bindMapRightClick` | `boolean` | `true` | Automatically listen for the map's `rightclick` event and open the menu. Disable if you want manual control. |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | – | Custom loader configuration (plugins, security code) when instantiating the menu. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.ContextMenu` | Fired once the context menu is created. |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell" @ready="map => (mapRef = map)">
  <AmapContextMenu
    ref="menuRef"
    :items="[
      { text: 'Zoom in', handler: () => mapRef?.zoomIn?.() },
      { text: 'Center here', handler: event => mapRef?.setCenter?.(event.lnglat) },
    ]"
  />
</AmapMap>
```

## Live example

<ClientOnly>
  <ContextMenuComponentDemo />
</ClientOnly>

<script setup lang="ts">
import ContextMenuComponentDemo from '../examples/ContextMenuComponentDemo.vue'
</script>

### TypeScript signature

```ts
export interface ContextMenuItem {
  text: string
  handler: (event: any) => void
  index?: number
}

export interface ContextMenuProps {
  items?: ContextMenuItem[]
  options?: Partial<AMap.ContextMenuOptions>
  bindMapRightClick?: boolean
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### Common pitfalls

- When `bindMapRightClick` is `true` the component attaches listeners automatically—ensure you destroy the menu or unmount the map to avoid duplicate handlers.
- The menu is created lazily; use `ref` + `onMounted` or the `ready` event before calling imperative methods like `open`.
- Provide stable function references for menu item handlers so reactivity can diff and update items correctly.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
