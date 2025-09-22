# `useBezierCurve`

Imperatively manage bezier curves.

```ts
const curve = useBezierCurve(() => map.value, () => ({
  path: [
    [[116.35, 39.9], [116.36, 39.94], [116.38, 39.96], [116.41, 39.97]],
  ],
  strokeColor: '#13c2c2',
}))

curve.on('click', (event) => {
  console.log('Bezier curve clicked', event)
})
```

## Return value

| Key | Description |
| --- | --- |
| `overlay` | `ShallowRef<AMap.BezierCurve \| null>` referencing the curve. |
| `setPath`, `setOptions`, `setExtData` | Imperative setters. |
| `show` / `hide` | Toggle visibility. |
| `on` / `off` | Listen to curve events. |
| `destroy` | Remove the overlay. |

## Live example

<ClientOnly>
  <UseBezierCurveHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseBezierCurveHookDemo from '../examples/hooks/UseBezierCurveHookDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
