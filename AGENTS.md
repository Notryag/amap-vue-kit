# Project Blueprint (follow VueUse + Vue Devtools style)

## Philosophy
- Small, composable, tree-shakable. (VueUse)
- Friendly DX: strong TS types, auto-complete, runtime warnings in dev, good docs. (Vue Devtools)
- Public API 文档即代码：类型、JSDoc 完整；示例可复制即可运行。

## Tech Baseline
- Vue 3 SFC + <script setup lang="ts">, TS strict, ESM only.
- Monorepo (pnpm): packages/{core,hooks,shared}, docs(vitepress), examples.
- ESLint: `@antfu/eslint-config` (flat config). No Prettier.
- Tests: Vitest + Vue Test Utils.
- Release: Changesets。Docs: VitePress（暗黑模式、Algolia DocSearch、live demos）。

## Packages
- @amap-vue-kit/core : 声明式组件 <AmapMap> <AmapMarker> ...
- @amap-vue-kit/hooks: composables useMap/useMarker/...（无渲染、可二次封装）
- @amap-vue-kit/shared: AMap script loader(singleton), types, utils.

## Conventions (emulate VueUse / Devtools)
- 目录/命名：composables 以 useXxx 命名，导出类型以 PascalCase。
- API 设计：props 最小必需 + 可选 options；事件 `onXxx` / Vue emits；支持 v-model 当合理。
- SSR-safe：在 setup 顶层避免直接访问 window，惰性加载 SDK。
- 错误与警告：缺少 AMap Key、脚本加载失败、无效坐标时给出友好 warning（仅 dev）。
- 文档：每个组件/Hook 有「最小示例 + 完整示例 + TS 签名 + 常见错误」。

## Loader
- `loadAmap({ key, version, plugins, securityJsCode })`：确保只注入一次；暴露 get()。
- 支持 plugin 按需：如 'AMap.ToolBar'、'AMap.Scale'、'AMap.HeatMap' 等。

## Performance
- 批量标注（LabelMarker/Mass）走批处理队列（microtask/RAF）。
- 提供 VectorLayer/OverlayGroup 管理批量增删。
- 文档含「大数据点」指南。

## Docs Structure (VitePress)
- Getting Started / Components / Hooks / Advanced(Loca, Cluster, Tiles) / Performance / Recipes / FAQ / Changelog
- 每页顶部：一段话+GIF，底部：在 StackBlitz 打开示例按钮。

## ESLint (flat)
import antfu from '@antfu/eslint-config'
export default antfu()

## Deliverables
- 最小示例（examples）和 docs 内嵌 demo 同步维护。
- CI: lint/test/build/docs-deploy on main.
