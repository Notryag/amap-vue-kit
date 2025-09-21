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
