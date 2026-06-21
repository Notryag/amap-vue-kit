# 更新日志

正式发布后，本页会由 Changesets 根据版本变更自动生成。当前内容说明本仓库的发布流程，方便维护者在首次发布前检查 npm 配置。

## 发布流程

`Release` GitHub Action 会监听 `main` 分支推送，也支持手动触发。工作流通过 [`changesets/action`](https://github.com/changesets/action) 创建版本 PR；当 changeset 准备好后，会调用项目脚本发布新版本。

### 稳定版发布

1. 本地执行 `pnpm changeset` 记录本次变更。
2. 将生成的 changeset 文件合并到 `main`。
3. 工作流执行 `pnpm changeset version` 更新版本号。
4. 工作流执行 `pnpm run release:stable`，完成 lint、typecheck、test、build 和 packed tarball 消费端验证后发布到 npm。

如果需要临时发布，也可以手动触发工作流并选择 **stable** channel。

### Canary 发布

手动触发工作流并选择 **canary** channel 会发布快照版本。内部会调用 `pnpm run release:canary`，先执行 `changeset version --snapshot canary`，再用 `canary` dist-tag 发布。

### 本地预演

```bash
pnpm changeset
pnpm changeset version
# 可选：使用相同脚本试运行
pnpm run release:stable
pnpm run release:canary
```

发布前也可以单独执行 `pnpm run verify:pack`。该脚本会先构建四个可发布包，使用 `npm pack` 生成 tarball，再创建一个临时 Vue/Vite 消费端项目安装这些 tarball，并运行 `vue-tsc` 与 `vite build`，用于提前发现 npm 包入口、类型声明或样式导出问题。

首次发布前还应执行 `pnpm run verify:npm-names`，确认 `@amap-vue/core`、`@amap-vue/hooks`、`@amap-vue/shared` 和 `@amap-vue/loca` 在 npm registry 中仍未被占用。

> 需要在 GitHub Repository Secrets 中配置 `NPM_TOKEN`，必要时也可以配置 `NODE_AUTH_TOKEN`，CI 才能发布到 npm。
