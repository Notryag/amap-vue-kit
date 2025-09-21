# FAQ & Troubleshooting

## Why is the map blank?

Ensure that the container element hosting `<AmapMap>` has an explicit height. Without a height the JSAPI will render an empty container.

## I see an error about missing API key

Call `loader.config({ key: 'YOUR_KEY' })` before rendering maps. The loader throws in development when no key is provided to avoid silent failures.

## How do I run the examples?

```bash
pnpm install
pnpm --filter examples/basic dev
```

Set `VITE_AMAP_KEY` in a `.env.local` file to use your own key.

## How do I use the components in SSR?

All composables guard against `window` access during setup. Only instantiate maps inside `onMounted`/`ready` callbacks on the client.
