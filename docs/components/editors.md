# `<AmapCircleEditor>`, `<AmapRectangleEditor>`, `<AmapEllipseEditor>`

Enable interactive geometry editing without hand-rolling plugin wiring. These lightweight components wrap their respective JSAPI editors and sync the `active` state and target overlay reactively.

## Shared props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `AMap.Circle \| AMap.Rectangle \| AMap.Ellipse \| string \| null \| undefined` | – | Overlay instance (or identifier) to edit. Strings resolve against `overlay.getId()` or `overlay.getExtData().id`. |
| `active` | `boolean` | `false` | Whether the editor should be open. Toggle reactively to start/stop editing. |
| `options` | `Partial<AMap.CircleEditorOptions \| AMap.RectangleEditorOptions \| AMap.EllipseEditorOptions>` | `{}` | Extra plugin options forwarded on creation. Each component narrows this union to the right type. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.CircleEditor \| AMap.RectangleEditor \| AMap.EllipseEditor` | Fired once the editor instance is instantiated. |
| `adjust` | `any` | Mirrors the JSAPI `adjust` event emitted while dragging control points. |
| `end` | `any` | Emitted after editing finishes (`mouseup`). |

## Usage

```vue
<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { onBeforeUnmount, ref, shallowRef } from 'vue'

const circleEditing = ref(false)
const rectangleEditing = ref(false)
const ellipseEditing = ref(false)
const map = shallowRef<AMap.Map | null>(null)
const rectangle = shallowRef<AMap.Rectangle | null>(null)
const ellipse = shallowRef<AMap.Ellipse | null>(null)

async function handleReady(instance: AMap.Map) {
  map.value = instance
  const AMap = await loader.load()
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
}

onBeforeUnmount(() => {
  rectangle.value?.destroy?.()
  ellipse.value?.destroy?.()
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
  </AmapMap>
</template>
```

Use the controls in the live demo to toggle each editor, switch between string identifiers and direct overlay references, and listen to the emitted `adjust`/`end` events.

<ClientOnly>
  <ShapeEditorsDemo />
</ClientOnly>

<script setup lang="ts">
import ShapeEditorsDemo from '../examples/ShapeEditorsDemo.vue'
</script>

### TypeScript signature

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

type EditorReadyPayload = AMap.CircleEditor | AMap.RectangleEditor | AMap.EllipseEditor
```

### Common pitfalls

- Provide a stable way to resolve the target overlay—either pass the overlay instance directly or set `extData.id`/`id` so string lookups succeed.
- Editors request their corresponding plugins (`AMap.CircleEditor`, etc.) lazily; make sure your loader key has permission to access them.
- When destroying overlays manually, also set the editor `active` flag to `false` to avoid the plugin holding stale references.

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
