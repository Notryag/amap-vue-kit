# FAQ & Troubleshooting

## Why is the map blank?

1. **Give the container a size.** The `<AmapMap>` root element must have an explicit height. A missing height or `display: none` container leads to a blank canvas.
2. **Check the API key.** The loader refuses to resolve when no key is configured, which leaves the map unmounted.
3. **Look for console warnings.** Components emit development warnings when coordinates are invalid or when a loader conflict is detected. They point to the reactive prop that needs fixing.

## I see an error about a missing API key

Configure the loader before mounting your app. The loader enforces a key so that environments fail fast instead of silently rendering nothing.

```ts
// main.ts
import { loader } from '@amap-vue/shared'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  plugins: ['AMap.Scale', 'AMap.ToolBar'],
})
```

If your project enables AMap security mode, also pass `securityJsCode`. The loader merges plugin arrays across subsequent `load` calls, so configure shared options once during bootstrap.

## How do I load the SDK under a strict Content Security Policy?

Allow the JSAPI domains in your `script-src` directive. When using Loca overlays, add the Loca origin as well.

```http
Content-Security-Policy:
  script-src 'self' https://webapi.amap.com https://webapi.amap.com/loca;
  connect-src 'self' https://webapi.amap.com;
  img-src 'self' data: blob: https://webapi.amap.com;
```

If your CSP relies on nonces or hashes, set them on `<body>`/`<head>` so that the loader-injected `<script>` inherits them. You can also self-host the SDK via `loader.config({ baseUrl, serviceHost })` and serve it from an allowed domain.

## The JSAPI fails to load or times out

Network errors bubble up as rejected promises. Wrap `loader.load()` in a `try/catch` and surface a friendly UI state. Use the `timeout` option to fail fast in unreliable networks:

```ts
await loader.load({ key, timeout: 8000 })
```

If the loader recovers later, call `load()` again—the singleton keeps the first successful configuration.

## How do I run the examples?

```bash
pnpm install
pnpm --filter examples/basic dev
```

Create a `.env.local` file inside `examples/basic` with `VITE_AMAP_KEY=<your-key>`.

## How do I use the components in SSR?

All composables guard against `window` access during setup. Instantiate maps only inside `onMounted`/`ready` callbacks on the client. When hydrating, render placeholders until `loader.load()` resolves to keep SSR deterministic.
