# AMap Vue Kit

Vue 3 components, composables, and tooling for the [AMap JSAPI 2.x](https://lbs.amap.com/api/javascript-api/summary).

## Packages

- `@amap-vue/shared` – shared loader, utilities, and types.
- `@amap-vue/hooks` – type-safe composables (`useMap`, `useMarker`, `useOverlay`, `useMassMarkers`).
- `@amap-vue/core` – declarative Vue components (`<AmapMap>`, `<AmapMarker>`, `<AmapInfoWindow>`, `<AmapPolyline>`, `<AmapPolygon>`, `<AmapCircle>`).
- `docs` – VitePress documentation site with live demos.
- `examples/basic` – Vite example app used for smoke testing.
- `packages/playground` – local development workspace with interactive controls.

## Development

```bash
pnpm install
pnpm lint
pnpm test
pnpm run build:all
```

### Docs

```bash
pnpm --filter @amap-vue/docs dev
```

### Example app

```bash
pnpm --filter amap-vue-example dev
```

### Playground

```bash
pnpm run dev:playground
```

Set `VITE_AMAP_KEY` in a `.env.local` file to load the live JSAPI map during development.

## Releasing

Use [Changesets](https://github.com/changesets/changesets) to manage versions and changelog entries.

```bash
pnpm changeset
pnpm changeset version
pnpm install
pnpm changeset publish
```
