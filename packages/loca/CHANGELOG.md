# @amap-vue/loca

## 0.2.0

### Minor Changes

- 8914b73: 新增声明式 `<AmapLocaPulseLineLayer>`，支持响应式轨迹数据和样式。`<AmapLocaProvider animate>` 可控制容器的动画循环。

### Patch Changes

- ce541a4: 共享服务 Hook 的异步初始化，修复首次并发查询及加载期间销毁的竞态。覆盖物加载后仅挂载到当前地图；Loca 图层记录实际挂载容器，切换和销毁时正确移除。提取图形公共操作，保持现有公开 API。
- 17e93a2: 跟随 lint 工具链升级统一属性存在性检查，并在批量点及 Loca 数据类型无效时抛出更明确的 TypeError，保留原有错误信息。
- 015af8f: 修复 Loca 组件卸载顺序，先解绑并销毁子图层，再销毁 Loca 容器。
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
