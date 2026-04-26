# AMap Vue Kit

![AMap Vue Kit demo](docs/public/hero.gif)

Vue 3 components, composables, and tooling for the [AMap JSAPI 2.x](https://lbs.amap.com/api/javascript-api/summary).

## Packages

- `@amap-vue/shared` – shared loader, utilities, and types.
- `@amap-vue/hooks` – type-safe composables (`useMap`, `useMarker`, `useOverlay`, `useMassMarkers`, `useTileLayer`, `useTrafficLayer`, `useSatelliteLayer`, `useRoadNetLayer`, `useToolBar`, `useScale`, `useControlBar`, `useMapType`).
- `@amap-vue/core` – declarative Vue components (`<AmapMap>`, `<AmapMarker>`, `<AmapInfoWindow>`, `<AmapPolyline>`, `<AmapPolygon>`, `<AmapCircle>`, `<AmapTileLayer>`, `<AmapTrafficLayer>`, `<AmapSatelliteLayer>`, `<AmapRoadNetLayer>`, `<AmapToolBar>`, `<AmapScale>`, `<AmapControlBar>`, `<AmapMapType>`).
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

### Component prop naming

Do not use Vue reserved/fallthrough attribute names such as `style`, `class`, `key`, or `ref` for public component props. Vue may treat them as DOM attributes before they reach the component, especially in templates. When wrapping JSAPI options named `style`, expose a semantic alias instead:

- Use `styles` for multi-style overlay configuration, such as `<AmapMassMarks>`.
- Use `textStyle` for CSS-like text overlay styling, such as `<AmapText>`.
- Use `layerStyle` for Loca layer visual configuration.

Keep lower-level composables aligned with the JSAPI naming where useful; this rule is specifically for Vue component props and docs/examples that users copy into templates.

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
