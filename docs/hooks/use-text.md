# `useText`

Imperatively create and manage `AMap.Text` overlays.

```ts
const textOverlay = useText(() => map.value, () => ({
  position: [116.397, 39.908],
  text: 'Hello Beijing',
  style: {
    padding: '6px 10px',
    borderRadius: '12px',
    background: 'rgba(22, 119, 255, 0.92)',
    color: '#fff',
  },
  anchor: 'bottom-center',
  offset: [0, -26],
}))

textOverlay.on('click', () => {
  console.log('Text clicked')
})
```

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Text \| null>` referencing the text overlay. |
| `setPosition`, `setOffset`, `setText`, `setStyle`, `setZIndex`, `setExtData`, `setOptions` | Imperative setters mirroring JSAPI methods. |
| `show` / `hide` | Toggle visibility. |
| `on` / `off` | Subscribe to events. |
| `destroy` | Remove the overlay. |

## Live example

<ClientOnly>
  <UseTextHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseTextHookDemo from '../examples/hooks/UseTextHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
