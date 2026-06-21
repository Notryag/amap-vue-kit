# `useCircle`

Control circular overlays reactively. The hook keeps the center and radius synchronized with Vue state, normalizes `LngLatLike` values, and handles visibility toggling.

```ts
import { useCircle } from '@amap-vue/hooks'
import { ref } from 'vue'

const circleOptions = ref({
  center: [116.397, 39.908],
  radius: 500,
  stroke颜色: '#ff6d00',
  fill颜色: 'rgba(255, 109, 0, 0.2)',
})

const circleApi = useCircle(() => map.value, circleOptions)

circleApi.on('dragend', () => {
  console.log('circle moved')
})
```

`useCircle` is the imperative counterpart to `<AmapCircle>`—share option objects between the two when composing larger widgets.

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Circle \| null>` referencing the circle instance. |
| `setCenter` | Update the center with `LngLatLike` input; values are converted to `AMap.LngLat`. |
| `setRadius` | Adjust the radius in meters. |
| `setOptions` | Proxy to `Circle#setOptions` for styling updates. |
| `setExtData` | Attach arbitrary metadata to the circle. |
| `show` / `hide` | Toggle visibility without destroying the overlay. |
| `destroy` | Remove the circle from the map and tear down listeners. |

### 说明

- Setting the reactive `visible` option hides or shows the circle automatically.
- When the map reference becomes `null`, the circle detaches itself and reattaches once a map instance is available again.

## 在线示例

<ClientOnly>
  <UseCircleHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseCircleHookDemo from '../examples/hooks/UseCircleHookDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
