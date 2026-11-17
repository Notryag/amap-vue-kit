# TODO

仅保留未完成事项；完成后删除，历史进度通过 Git 和 Changelog 查询。
开发规范见 [AGENTS.md](./AGENTS.md)，现有能力见 [README.md](./README.md)。

## P1：常用控件与服务

- [ ] `AmapHawkEye` / `useHawkEye`：鹰眼控件。
- [ ] `AmapRangingTool` / `useRangingTool`：测距工具，支持启停、结果事件与清理。
- [ ] `useDistrictSearch`：行政区查询，支持层级、子级及边界查询；与已有行政区图层区分。
- [ ] `AmapTransfer` / `useTransfer`：公交换乘，支持方案查询、地图展示与结果面板。

## P2：标准图层与楼块

- [ ] `AmapWMSLayer` / `useWMSLayer`：对接 `AMap.TileLayer.WMS`，支持服务地址与参数更新。
- [ ] `AmapWMTSLayer` / `useWMTSLayer`：对接 `AMap.TileLayer.WMTS`。
- [ ] `AmapBuildings` / `useBuildings`：楼块图层，支持样式、可见性与生命周期管理。

## P3：自定义渲染与轨迹

- [ ] `AmapCanvasLayer` / `useCanvasLayer`：Canvas 图层。
- [ ] `AmapCustomLayer` / `useCustomLayer`：自定义图层及渲染回调。
- [ ] `AmapGLCustomLayer` / `useGLCustomLayer`：WebGL 自定义图层，明确资源释放责任。
- [ ] `AmapFlexibleLayer` / `useFlexibleLayer`：对接 `AMap.TileLayer.Flexible`，支持自定义切片生成。
- [ ] `useMoveAnimation`：已有轨迹动画文档和示例，补充独立 Hook，支持启停、暂停、恢复及事件清理。

## 后续扩展

- [ ] `AmapIndoorMap` / `useIndoorMap`：室内地图及楼层切换。
- [ ] `AmapVectorLayer` / `useVectorLayer`：矢量图层与批量管理。
- [ ] `AmapLayerGroup` / `useLayerGroup`：图层分组管理，区别于已有的 `OverlayGroup`。
- [ ] `useTruckDriving`：货车路线规划。
- [ ] `useDragRoute`：拖拽路线规划。
- [ ] `useGraspRoad`：轨迹纠偏。
- [ ] `useCitySearch`：城市查询。
- [ ] `useLineSearch`：公交线路查询。
- [ ] `useStationSearch`：公交站点查询。
- [ ] `AmapGeolocation`：复用已有 `useGeolocation`，补充声明式定位组件。

## 发布与部署核实

- [ ] 推送修复后核实远端 CI 通过。
- [ ] 在 GitHub Pages 中将 Source 设为 GitHub Actions，并核实文档部署、资源路径及页面访问。
- [ ] 核实 npm 上四个 `@amap-vue/*` 包的实际发布版本及安装结果；本地 `0.1.0` 提交不作为发布成功依据。

## 每项功能的交付要求

组件优先复用 Hook；服务类优先提供 Hook，按场景增加展示组件。以上新增名称为暂定名称。

- 完善 TS 类型、JSDoc、按需插件加载、响应式更新和卸载清理，保持 SSR 安全。
- 添加覆盖创建、更新、事件与销毁行为的测试；同步最小示例和文档内嵌 Demo。
- 文档包含最小示例、完整示例、TS 签名、常见错误和 StackBlitz 入口。
- 运行 lint、类型检查、测试、全量构建及打包消费验证；公共包变更补充 Changeset。

## 参考

- [高德 JSAPI 2.0 官方 API 清单](https://a.amap.com/jsapi/static/doc/index.html)
- 能力缺项核对日期：2026-11-17。
