# Loca & Visualizations

Loca builds on top of JSAPI WebGL capabilities to render dense visualizations. The shared loader exposes a `loca` option to request the Loca script together with the base JSAPI.

```ts
import { loader } from '@amap-vue/shared'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  loca: true
})
```

From there you can instantiate `Loca.Container` instances inside `ready` callbacks. Future releases of AMap Vue Kit will ship dedicated helpers for common visualizations.
