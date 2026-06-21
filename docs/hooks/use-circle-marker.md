# `useCircleMarker`

Imperatively manage JSAPI circle markers, ideal for rendering large numbers of simple points.

```ts
const circle = useCircleMarker(() => map.value, () => ({
  center: [116.397, 39.908],
  radius: 10,
  options: {
    stroke颜色: '#1677ff',
    fill颜色: 'rgba(22, 119, 255, 0.45)',
  },
}))

circle.on('click', () => console.log('Circle marker clicked'))
```

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.CircleMarker \| null>` referencing the marker. |
| `setCenter`, `setRadius`, `setOptions`, `setExtData` | Imperative setters mirroring JSAPI methods. |
| `show` / `hide` | Toggle visibility. |
| `on` / `off` | Subscribe to marker events. |
| `destroy` | Remove the marker from the map. |

## 在线示例

<ClientOnly>
  <UseCircleMarkerHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseCircleMarkerHookDemo from '../examples/hooks/UseCircleMarkerHookDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
