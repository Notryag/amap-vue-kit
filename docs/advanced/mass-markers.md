# Mass Markers

Mass markers allow you to render tens of thousands of points efficiently by delegating rendering to the JSAPI.

```ts
import { useMassMarkers } from '@amap-vue/hooks'

const mass = useMassMarkers(() => map.value, () => ({
  data: points,
  style: [{
    url: 'https://a.amap.com/jsapi_demos/static/resource/img/markers/mark_b.png',
    anchor: [6, 6],
    size: [11, 11]
  }]
}))
```

Use the composable inside `ready` handlers to ensure the map exists before instantiation. Mass markers share the loader so additional plugins are only requested once.
