# Track Animation

Animate paths using the JSAPI `MoveAnimation` plugin or `AMap.Loca` trajectory layers. AMap Vue Kit does not abstract these APIs yet, but you can create them inside `ready` callbacks while reusing the loader and reactivity helpers.

```ts
ready((map) => {
  map.plugin(['AMap.MoveAnimation'], () => {
    const marker = new AMap.Marker({ position: path[0], map })
    marker.moveAlong(path, { duration: 5000 })
  })
})
```

Consider combining track animations with `<AmapPolyline>` overlays to render the path outline while the marker moves along it.

## Live example

<ClientOnly>
  <TrackAnimationDemo />
</ClientOnly>

<script setup lang="ts">
import TrackAnimationDemo from '../examples/advanced/TrackAnimationDemo.vue'
</script>

### Tips

- Always load `AMap.MoveAnimation` before calling `moveAlong` to avoid runtime errors.
- Use `pauseMove` and `stopMove` to provide user controls for replaying the animation.
- Pair the marker with a polyline or mass markers to show the origin and destination context.
