# FAQ 与排障

## 为什么地图是空白的？

1. **给容器设置尺寸。** `<AmapMap>` 根元素必须有明确高度。缺少高度或容器处于 `display: none` 时，地图会表现为空白。
2. **检查 API Key。** 没有配置 Key 时，loader 会拒绝加载，地图也不会挂载。
3. **查看控制台 warning。** 坐标无效、loader 配置冲突等问题会在开发环境给出提示，并指向需要修正的响应式参数。

## 提示缺少 API Key 怎么办？

在挂载应用前配置 loader。AMap Vue Kit 会强制检查 Key，让环境尽早失败，而不是静默渲染一块空白。

```ts
// main.ts
import { loader } from '@amap-vue/shared'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  plugins: ['AMap.Scale', 'AMap.ToolBar'],
})
```

如果项目启用了高德安全密钥，也要传入 `securityJsCode`。后续 `load` 调用里的插件数组会自动合并，所以通用配置建议在应用启动时集中设置。

## 严格 CSP 下如何加载 SDK？

在 `script-src` 中允许 JSAPI 域名。使用 Loca 覆盖物时，也需要加入 Loca 脚本来源。

```http
Content-Security-Policy:
  script-src 'self' https://webapi.amap.com https://webapi.amap.com/loca;
  connect-src 'self' https://webapi.amap.com;
  img-src 'self' data: blob: https://webapi.amap.com;
```

如果 CSP 依赖 nonce 或 hash，请把它们设置在 `<body>` / `<head>` 上，让 loader 注入的 `<script>` 能继承。也可以通过 `loader.config({ baseUrl, serviceHost })` 自托管 SDK，并从允许的域名提供脚本。

## JSAPI 加载失败或超时

网络错误会以 rejected promise 的形式向外抛出。建议用 `try/catch` 包住 `loader.load()`，并在界面上展示友好状态。网络不稳定时可以设置 `timeout` 快速失败：

```ts
await loader.load({ key, timeout: 8000 })
```

如果网络稍后恢复，可以再次调用 `load()`；单例 loader 会保留首次成功的配置。

## 如何运行示例？

```bash
pnpm install
pnpm --filter examples/basic dev
```

在 `examples/basic` 目录下创建 `.env.local`，写入 `VITE_AMAP_KEY=<your-key>`。

## SSR 中如何使用？

所有 hooks 都会避免在 setup 阶段访问 `window`。地图实例应只在客户端的 `onMounted` 或 `ready` 回调中创建。水合时可以先渲染占位内容，等 `loader.load()` 完成后再显示地图，从而保证 SSR 输出稳定。
