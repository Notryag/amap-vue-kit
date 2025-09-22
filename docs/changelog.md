# Changelog

This page is generated automatically from Changesets when a release is published.

## Release pipeline

The `Release` GitHub Action watches pushes to `main` and can also be invoked manually. It runs [`changesets/action`](https://github.com/changesets/action) to open a release PR and, when changesets are ready, publishes new versions via our package scripts.

### Stable release

1. Run `pnpm changeset` locally to record changes.
2. Merge the resulting changeset files into `main`.
3. The workflow bumps versions with `pnpm changeset version` and executes `pnpm run release:stable` to publish.
4. Documentation and package changelogs are updated from the generated notes.

The workflow can also be triggered manually with the **stable** channel if you prefer a one-off publish.

### Canary release

Trigger the workflow manually and pick the **canary** channel to publish snapshot builds. Internally this calls `pnpm run release:canary`, which performs `changeset version --snapshot canary` before publishing with the `canary` dist-tag.

### Local preview

```bash
pnpm changeset
pnpm changeset version
# Optional dry run using the same scripts
pnpm run release:stable
pnpm run release:canary
```

> ℹ️ Configure `NPM_TOKEN` (and optionally `NODE_AUTH_TOKEN`) in repository secrets so CI can publish to npm.
