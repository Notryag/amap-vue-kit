---

# TODO

> 项目：**amap-vue-kit**（建议 npm：`@<your-scope>/amap-vue-kit`）
> 目标：Vue 3 + TS 的高德地图组件 & hooks 库；文档站用 VitePress；ESLint 用 `@antfu/eslint-config`（**不用 Prettier**）。

## 里程碑

* [x] **M0 — 初始化（Day 0）**

  * [x] pnpm monorepo：`packages/{core,hooks,shared}`、`docs`、`examples`
  * [x] packages/playground：本地最小示例
  * [x] ESLint：`@antfu/eslint-config`（flat config），VSCode 建议开启保存即修复
  * [x] Vitest + Vue Test Utils
  * [x] Changesets（版本与 Changelog）
  * [x] `shared`：AMap 脚本单例加载器 `loadAmap()`
* [x] **M1 — MVP 基础组件/Hook（Map/Marker/InfoWindow/Polyline/Polygon/Circle）**
* [x] **M2 — 图层 & 控件（TileLayer/Traffic/Satellite/RoadNet + ToolBar/Scale/ControlBar）**
* [x] **M3 — Labels 系列 & 高性能（LabelsLayer/LabelMarker + OverlayGroup 批量）**
* [x] **M4 — 编辑器 & 热力图（Circle/Rectangle/Ellipse Editor + HeatMap）**
* [x] **M5 — 文档站完善、示例、性能指南、对比页、首次发布**

---

## 包结构（计划）

```
amap-vue-kit/
├─ packages/
│  ├─ shared/     # loader、types、utils
│  ├─ core/       # 组件（SFC）
│  ├─ hooks/      # composables
│  └─ playground/ # 本地最小示例
├─ docs/          # VitePress 文档站
├─ examples/      # 独立 Demo（可部署）
└─ .github/workflows/  # CI（lint/test/build/docs）
```

---

## 全局规范（给 AI / 开发者）

* Vue 3 SFC：`<script setup lang="ts">`，**TS strict**，**ESM only**
* 组件以 **最少 props** + **清晰 emits** 为先；**SSR 安全**（避免直接触碰 `window`）
* 所有可视对象有 **destroy/cleanup**；`onUnmounted` 移除实例
* **Dev 警告**：未设置 key、非法坐标、脚本加载失败等
* **按需 / Tree-shaking**：独立导出 + 文档示例按需引入
* 文档每页包含：**一句话概述 + 最小示例 + TS 签名 + 常见错误 + StackBlitz 按钮**

---

## Shared（基础设施）

* [x] `packages/shared/src/loader.ts`

  * [x] `loader.load({ key, version, plugins, securityJsCode })`：仅注入一次
  * [x] `loader.get()`：返回已加载的 `AMap` 对象或 `undefined`
  * [x] 脚本加载失败 / 重复配置提示
  * [x] 加载超时机制（可选）
  * **给 AI 的提示词：**

    ```
    用 TypeScript 实现单例 AMap 脚本加载器：
    - 全局只注入一次 <script>；支持 key/version/plugins/securityJsCode 参数
    - 返回 Promise<AMap>；失败给出具名错误
    - 导出 loader.load() 与 loader.get()
    ```

* [x] `packages/shared/src/types.ts`：导出常用类型别名（LngLatLike、BoundsLike 等）

* [x] `packages/shared/src/utils.ts`：浅比较、坐标校验、事件绑定工具

---

## Core 组件（MVP → 进阶）

### A. 基础容器与覆盖物（M1）

* [x] **`<AmapMap>`**

  * props：`center`, `zoom`, `viewMode`, `mapStyle`, `pitch`, `rotation`, `plugins`
  * emits：`ready(map)`, `click`, `moveend`, `complete`, `error`
  * provide：`map` 实例给子组件
  * **AI 提示词：**

    ```
    实现 <AmapMap>（SFC + TS）：
    - 挂载后通过 shared.loadAmap 创建 new AMap.Map
    - provide(map)；expose getMap()
    - watch center/zoom 做 setCenter/setZoom；dev 下做参数校验与 warning
    - emits ready 只触发一次；卸载时销毁
    ```

* [x] **`<AmapMarker>`**

  * props：`position`, `icon`, `label`, `draggable`, `zIndex`, `extData`
  * emits：`click`, `dragend`, `mouseover`, `mouseout`
  * slot：自定义 content（`isCustom`）
  * **AI 提示词：**

    ```
    实现 <AmapMarker>：
    - inject(map) 创建 AMap.Marker；watch props -> setOptions/setPosition
    - 支持 slot 作为自定义内容（isCustom）
    - onUnmounted remove；绑定常见事件为 emits
    ```

* [x] **`<AmapInfoWindow>`**

  * props：`position`, `isOpen`, `offset`（后续扩展 `anchor`、`isCustom`）
  * emits：`ready`, `open`, `close`
  * TODO：
    * [x] 支持 `anchor`、`isCustom` 等配置透传
    * [x] 允许通过 props 设置字符串/DOM `content`
  * **AI 提示词：**

    ```
    实现 <AmapInfoWindow>：
    - isOpen=true -> infoWindow.open(map, position)；false -> close()
    - 内容来自 slot；支持 isCustom
    ```

* [x] **`<AmapPolyline>`**

  * props：`path`, `strokeColor`, `strokeWeight`, `opacity`, `zIndex`, `extData`
  * emits：`click`, `dblclick`, `mouseover`, `mouseout`
  * **AI 提示词：**

    ```
    实现 <AmapPolyline>：
    - new AMap.Polyline(options)，watch path/样式做增量更新
    - 绑定常用鼠标事件；卸载销毁
    ```

* [x] **`<AmapPolygon>`**（同上，`path` 为多边形）

* [x] **`<AmapCircle>`**（`center` + `radius`）

### B. 图层类（M2）

* [x] **`<AmapTileLayer>`（基类/自定义 URL）**

  * props：`visible`, `opacity`, `zIndex`, `zooms`, `tileSize`, `tileUrl?`
  * **AI 提示词：**

    ```
    实现 <AmapTileLayer>：
    - 支持自定义 tileUrl；visible 控制 add/remove；watch 做 setOptions
    ```

* [x] **子类快捷组件**

  * [x] `<AmapTileLayerSatellite>`
  * [x] `<AmapTileLayerRoadNet>`
  * [x] `<AmapTileLayerTraffic>`（含 `autoRefresh` 说明）
  * **AI 提示词：**

    ```
    为 TileLayer 实现 3 个子组件（Satellite/RoadNet/Traffic）：
    - 内部直接构造对应子类实例；其余行为与基类一致
    ```

* [x] **`<AmapImageLayer>`**（图片地面覆盖，`url` + `bounds`）

### C. 控件（M2）

* [x] **`<AmapToolBar>`**
* [x] **`<AmapScale>`**
* [x] **`<AmapControlBar>`**
* [x] **`<AmapMapType>`**

  * 通用 props：`position`, `offset`, `visible`
  * **AI 提示词：**

    ```
    实现 3 个控件组件：
    - 通过 map.plugin(['AMap.ToolBar'...]) 异步加载再实例化
    - visible 控制 add/remove；变更 offset/position 时更新
    ```

### D. 标签与高性能（M3）

* [x] **`<AmapLabelsLayer>`**（容器，provide layer）

* [x] **`<AmapLabelMarker>`**（作为子节点，inject layer）

  * props：`position`, `text`, `icon`, `zIndex`, `zoom?`, `collision?`
  * **AI 提示词：**

    ```
    实现 <AmapLabelsLayer> + <AmapLabelMarker>：
    - Layer 容器 add 到 map；子组件创建 LabelMarker 后挂到 Layer
    - 支持碰撞避让/透明度/批量增删（可配合 hooks）
    ```

* [x] **`<AmapOverlayGroup>`**（批量增删/清理容器）

  * **AI 提示词：**

    ```
    实现 <AmapOverlayGroup> 容器组件：
    - 内部持有 OverlayGroup；提供 addOverlays/removeOverlays/clearOverlays 的 expose 方法
    - 演示一次性增删上千点的性能
    ```

### E. 编辑器与热力图（M4）

* [x] **`<AmapCircleEditor>`**

* [x] **`<AmapRectangleEditor>`**

* [x] **`<AmapEllipseEditor>`**

  * props：`target`（覆盖物实例或 id）、`active`
  * emits：`adjust`, `end`
  * **AI 提示词：**

    ```
    实现 3 个 Editor 组件：
    - active=true 时 open()；false 时 close()
    - target 变更后重绑定；事件转发为 emits
    ```

* [x] **`<AmapHeatMap>`**

  * props：`data`, `radius`, `gradient`, `max`
  * **AI 提示词：**

    ```
    实现 <AmapHeatMap>（插件加载）：
    - map.plugin(['AMap.HeatMap']) 后 new AMap.HeatMap(map, opts)
    - setDataSet 支持动态更新
    ```

---

## Hooks（与组件并行，VueUse 风格）

> 所有 hooks 放在 `packages/hooks`，组件内部优先复用 hooks。

* [x] **`useMap(options)`**

  * 返回：`{ map, ready, setCenter, setZoom, destroy }`
  * **AI 提示词：**

    ```
    实现 useMap：
    - 懒加载 SDK；ready(cb) 保证回调在 map 创建后执行
    - SSR 安全；onUnmounted 自动 destroy（可配置）
    ```

* [x] **`useMarker(mapRef, options)`**

* [x] **`useInfoWindow(mapRef, options)`**

* [x] **`usePolyline / usePolygon / useCircle`**

* [x] **`useTileLayer / useTrafficLayer / useRoadNetLayer / useSatelliteLayer`**

* [x] **`useLabelsLayer / useLabelMarker`**

* [x] **`useOverlayGroup`**

* [x] **`useEditorCircle / useEditorRectangle / useEditorEllipse`**

* [x] **`useHeatMap`**

* [x] 覆盖物 hooks 单元测试：`useInfoWindow` / `usePolyline` / `usePolygon` / `useCircle`
* [x] 文档：新增 hooks 页面（`use-info-window`、`use-polyline`、`use-polygon`、`use-circle`）

  * **AI 通用提示词：**

    ```
    为每个 useXxx 实现：
    - 参数：mapRef: Ref<AMap.Map|undefined> + Partial<对应 Options>
    - 返回：{ 实例 shallowRef, on, off, setOptions..., destroy }
    - watch 深比较后做增量更新；onUnmounted 自动销毁
    - 不直接访问 window；在 map 就绪后才创建实例
    ```

---

## 文档站（VitePress）

* [x] 初始化 `docs`（暗黑模式、侧边栏、DocSearch 预留）
* [x] 侧边栏结构

  * [x] Getting Started（安装、Key、最小示例、容器尺寸、常见报错）
  * [x] Components（按 A/B/C/D 分组）
    * [x] B 组：TileLayer + 子层文档初稿
    * [x] C 组：地图控件（ToolBar/Scale/ControlBar/MapType）
* [x] Hooks（与组件一一对应）
  * [x] TileLayer / Traffic / RoadNet / Satellite hooks 文档
  * [x] Advanced（大数据点/性能、ImageLayer、轨迹动画、主题样式）
* [x] Recipes（园区底图、聚合、信息窗联动）
  * [x] FAQ（Key、CSP、地图不显示排错）
  * [x] Changelog（changesets）
* [x] 每个页面都包含可运行示例（docs 内嵌 SFC + `ClientOnly`）
* [x] 顶部 README 动图（Map + Marker + InfoWindow 3 秒演示）
* **AI 提示词：**

  ```
  生成 VitePress 站点与侧边栏配置：
  - docs/.vitepress/config.ts：站点标题、侧边栏、导航、暗黑模式
  - 在 docs/components 下为每个组件写页面：最小示例 + TS 类型 + 常见错误
  - 为示例提供 StackBlitz 链接按钮
  ```

---

## 工程化 / DX

* [x] **ESLint（flat config）**

  * `eslint.config.js`：

      ```js
      import antfu from '@antfu/eslint-config'

      export default antfu()
      ```
  * `package.json`：

    ```json
    { "devDependencies": { "eslint": "^9", "@antfu/eslint-config": "^2.20.0" } }
    ```
  * [x] 清理 docs/hooks 代码示例的 import 顺序，确保 `pnpm lint` 通过
* [x] **Vitest**：核心组件与 hooks 的单元测试（创建/更新/销毁/事件）
* [x] **CI**：`lint/test/build/docs-deploy`（GitHub Actions）
  * 已添加 `.github/workflows/ci.yml`，执行 `pnpm lint`、`pnpm test -- --run`、`pnpm run build:all`
* [x] **Changesets**：`pnpm changeset` 流程 + 自动发版（需要 NPM\_TOKEN）
* [x] **Examples**：`examples/basic`（Vite + Vue 最小演示），用于 e2e 冒烟
* [x] **发布脚本**：`release:canary` / `release:stable`，scoped 包 `--access public`

---

## 快速核对（完成判据）

* [x] `loader.load()` 单例、失败有明确错误信息
* [x] Map/Marker/InfoWindow/Polyline/Polygon/Circle 全部具备：props → 增量更新；事件 → emits；卸载清理
* [x] TileLayer 三子类可切换显示且不泄漏
* [x] 控件能动态 position/offset 并可隐藏
* [x] LabelsLayer/LabelMarker 支撑千级点，不明显卡顿
* [x] OverlayGroup 一次性增删上千覆盖物成功
* [x] 三种 Editor 可开关编辑，事件上报
* [x] HeatMap 数据集可动态变更
* [x] hooks 与组件 API 对应、文档同步
* [x] 文档站：入门 5 分钟能跑；页面齐备；动图与 StackBlitz 可用
* [x] CI 全绿；首次 npm 发布成功；版本与文档一致（CI 通过、本地验证完成；发布由 Release workflow + NPM_TOKEN 驱动）

---

## 待完善的高德示例功能

### 点标记

* [x] `<AmapMarker>` 支持自定义 HTML/SVG 内容（官方「自定义点标记」示例需要 `content`/slot 能力）。
* [x] `<AmapMarker>` 暴露 `anchor`/`offset` 组合示例，完善锚点位置说明。
* [x] 新增 `<AmapText>` 组件与 `useText` hook，对接 `AMap.Text`（覆盖「文本点标记」）。
* [x] 新增 `<AmapCircleMarker>` / `useCircleMarker`，支持轻量圆点覆盖物。
* [x] 新增 `<AmapElasticMarker>` / `useElasticMarker`，封装灵活点标记插件。
* [x] 新增 `<AmapMarkerCluster>` 组件或 `useMarkerClusterer` hook，整合点聚合能力。

### 海量标注

* [x] 为海量点/海量标注整理统一 Demo，覆盖 `MassMarks` 与 `LabelsLayer` 联动场景。

### 线覆盖物

* [x] 新增 `<AmapBezierCurve>` 组件与 `useBezierCurve` hook，封装贝塞尔曲线。
* [x] 提供折线/贝塞尔编辑组件或 `usePolylineEditor`、`useBezierCurveEditor` hook，对接官方编辑插件。

### 面覆盖物

* [x] 新增 `<AmapPolygonEditor>`，并封装多边形绘制/编辑流程（结合 `MouseTool`）。
* [x] 新增 `<AmapRectangle>`、`<AmapEllipse>` 组件及对应 hooks，完善矩形/椭圆绘制流程。
* [x] 封装 `MouseTool` 抽象，统一圆形/矩形/椭圆/多边形的绘制交互。

### 控件与弹窗

* [x] 新增 `<AmapContextMenu>` 组件或 `useContextMenu` hook，支持右键菜单。

---

## Playground 优化（待实现）

* [ ] 支持一键切换的组件面板，覆盖 README 中列出的 Map / Marker / InfoWindow / Polyline / Polygon / Circle / TileLayer / Traffic / Satellite / RoadNet / ToolBar / Scale / ControlBar / MapType。
* [ ] 各面板提供受控表单（经纬度、缩放、旋转、可见性、样式、事件开关等），并在右下角显示实时事件日志。
* [ ] Playground 右上角提供「复制为示例代码」按钮，将当前表单状态序列化为 `<AmapXXX>` SFC 片段。
* [ ] 使用 URL Hash/Query 与 LocalStorage 持久化配置，实现刷新或分享状态不丢失。
* [ ] 内置小/中/大三档数据集（100 / 3k / 1 万点），用于展示渲染耗时或 FPS 统计，便于压测性能。
* [ ] 提供虚拟滚动 / 分块渲染开关，适配 MassMarkers 或 Clusterer 等大数据量场景。
* [ ] 增加 Map Inspector：展示当前 zoom / center / bounds、已加载图层列表以及覆盖物添加/销毁计数。
* [ ] Playground 提示与兜底：AMap Key 缺失时读取 `.env.local` 的 `VITE_AMAP_KEY`，并允许用户临时输入。

---

## 组件 / Hook 待补齐（优先级高 → 低）

### 聚合与海量点

* [ ] `<AmapMarkerClusterer>` 组件或 `useMarkerClusterer` hook，封装点聚合能力。
* [ ] `<AmapMassMarks>` 组件封装（基于 `useMassMarkers`），支持样式、事件与数据源增量优化。

### 热力图

* [ ] `<AmapHeatMap>` 组件与示例，涵盖权重字段映射、渐变色、半径与模糊度配置。

### 行政区与边界图层

* [ ] `<AmapDistrictLayer>` 组件，支持国家 / 省 / 市多级加载与切换。
* [ ] `<AmapGeoJSONLayer>` 组件，一键加载 GeoJSON 数据源。

### 绘制与编辑工具

* [ ] `<AmapMouseTool>` 组件或 UI，支持绘制点、线、面、矩形、圆。
* [ ] `<AmapPolylineEditor>` / `<AmapPolygonEditor>` 组件化（或 hooks + 简易 UI），补齐折线与多边形编辑流程。
* [ ] `<AmapCircleEditor>` / `<AmapRectangleEditor>` 组件封装，覆盖圆与矩形编辑场景。

### 检索与路线规划

* [ ] `<AmapAutoComplete>` / `<AmapPlaceSearch>` 组件，提供地点搜索体验。
* [ ] `<AmapDriving>` / `<AmapWalking>` / `<AmapRiding>` 组件，渲染路线并提供面板 slot。

### 服务能力

* [ ] `useGeocoder` / `<AmapReverseGeocodePanel>`，整合逆地理/正向地理编码能力。
* [ ] `useGeolocation`，包含权限处理与失败兜底。
* [ ] `useWeather`，配城市选择器与天气展示组件。

### 交互增强

* [ ] `<AmapContextMenu>` 组件（或 `useContextMenu`），支持右键菜单交互。

---

### 备注

* 所有对 AI 的提示词都已尽量简短聚焦，如需更细请在对应任务下补充「输入例子/期待输出」。
* 若 npm 名称冲突，优先用你自己的 scope（如 `@jointray/amap-vue-kit`），仓库名仍用 `amap-vue-kit` 即可。

