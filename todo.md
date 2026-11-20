# TODO

仅保留未完成事项；完成后删除，历史进度通过 Git 和 Changelog 查询。
开发规范见 [AGENTS.md](./AGENTS.md)，现有能力见 [README.md](./README.md)。

## 发布与部署核实

- [ ] 配置与高德 Key 匹配的安全密钥，验证室内地图加载和真实楼层切换。
- [ ] 推送修复后核实远端 CI 通过。
- [ ] 在 GitHub Pages 中将 Source 设为 GitHub Actions，并核实文档部署、资源路径及页面访问。
- [ ] 核实 npm 上四个 `@amap-vue/*` 包的实际发布版本及安装结果；本地 `0.1.0` 提交不作为发布成功依据。

## 每项功能的交付要求

组件优先复用 Hook；服务类优先提供 Hook，按场景增加展示组件。

- 完善 TS 类型、JSDoc、按需插件加载、响应式更新和卸载清理；面向浏览器运行，保留静态文档构建所需的安全导入和 SDK 惰性初始化。
- 添加覆盖创建、更新、事件与销毁行为的测试；同步最小示例和文档内嵌 Demo。
- 文档包含最小示例、完整示例、TS 签名、常见错误和 StackBlitz 入口。
- 运行 lint、类型检查、测试、全量构建及打包消费验证；公共包变更补充 Changeset。

## 参考

- [高德 JSAPI 2.0 官方 API 清单](https://a.amap.com/jsapi/static/doc/index.html)
- 能力缺项核对日期：2026-11-17。
