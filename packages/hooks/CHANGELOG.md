# @amap-vue/hooks

## 0.2.0

### Minor Changes

- eaf19bf: 新增 `AmapBuildings` 和 `useBuildings`，支持 3D 楼块样式、显隐与卸载清理。`AmapMap` 新增 `showBuildingBlock` 初始化选项，用于关闭默认楼块。
- 6013a85: 新增 `AmapCanvasLayer` 和 `useCanvasLayer`，支持响应式 Canvas、经纬度范围、显隐以及 3D 视图下的主动刷新。
- 8179b1f: 新增 `AmapCustomLayer` 和 `useCustomLayer`，支持 SDK 驱动的 Canvas 渲染回调、主动重绘、显隐和卸载清理。
- 93f4838: 新增 `useDistrictSearch`，支持按行政区名或编码查询，按需返回子级行政区和边界坐标。
- d22fa61: 新增 `AmapFlexibleLayer` 和 `useFlexibleLayer`，支持按瓦片坐标生成 Canvas 或图片、重新加载，以及忽略旧图层迟到的回调。
- 5894e27: 新增 WebGL 自定义图层组件和 Hook。初始化回调可以返回资源清理函数，供地图切换和卸载时调用。
- 3b14bdf: 新增 AmapHawkEye 与 useHawkEye，支持鹰眼展开、可见性、响应式配置及生命周期管理，并补齐 SDK 类型。修复公共控件加载期间切换地图或卸载的竞态。
- 4288d02: Add the IndoorMap layer and composable for opening indoor buildings and switching floors.
- a5aa50a: Add a LayerGroup component and composable for batch management of native map layers.
- 0593cbb: Add the `useMoveAnimation` hook for controlling point-marker animations and cleaning up playback and events.
- 33cf0e5: 新增 `AmapRangingTool` 和 `useRangingTool`，支持交互式测距、结果事件、覆盖物清理和卸载时自动释放。
- 5026751: 新增 `useTransfer` 和 `AmapTransfer`，支持公交换乘查询、方案切换和地图分段绘制。
- 49f2987: Add a VectorLayer component and composable for batch management of native vector overlays.
- 6398ad9: 新增 `AmapWMSLayer` 和 `useWMSLayer`，支持加载 EPSG:3857 WMS 图层并响应式更新服务地址、请求参数和图层显示选项。
- f915a35: 新增 `AmapWMTSLayer` 和 `useWMTSLayer`，支持 Web Mercator WMTS 图层、响应式 GetTile 参数、瓦片刷新及卸载清理。

### Patch Changes

- ce541a4: 共享服务 Hook 的异步初始化，修复首次并发查询及加载期间销毁的竞态。覆盖物加载后仅挂载到当前地图；Loca 图层记录实际挂载容器，切换和销毁时正确移除。提取图形公共操作，保持现有公开 API。
- f00c509: 信息窗体清理改用公开 close API，避免内部 destroy 导致地图销毁时重复删除 DOM。隔离地图画布与 Vue 子组件，并通过 Teleport 保持信息窗体插槽内容的响应式更新与正确卸载。
- 17e93a2: 跟随 lint 工具链升级统一属性存在性检查，并在批量点及 Loca 数据类型无效时抛出更明确的 TypeError，保留原有错误信息。
- e824e88: 修复地图卸载时先销毁父地图导致子图层清理异常的问题，取消卸载后尚未完成的地图初始化，并避免热力图重复解绑。
- d77a41b: 修复 `useMassMarkers` 在组件卸载时未清理海量点实例的问题，并取消尚未完成的初始化。
- Updated dependencies [eaf19bf]
- Updated dependencies [6013a85]
- Updated dependencies [8179b1f]
- Updated dependencies [93f4838]
- Updated dependencies [d22fa61]
- Updated dependencies [5894e27]
- Updated dependencies [3b14bdf]
- Updated dependencies [4288d02]
- Updated dependencies [a5aa50a]
- Updated dependencies [6b83561]
- Updated dependencies [0593cbb]
- Updated dependencies [33cf0e5]
- Updated dependencies [5026751]
- Updated dependencies [49f2987]
- Updated dependencies [6398ad9]
- Updated dependencies [f915a35]
  - @amap-vue/shared@0.2.0

## 0.1.0

### Minor Changes

- c5faedd: 首个可发布版本：提供 Vue 3 高德地图组件、组合式 hooks、共享加载器与 Loca 可视化能力。

### Patch Changes

- Updated dependencies [c5faedd]
  - @amap-vue/shared@0.1.0
