# @amap-vue/shared

`amap-vue-kit` 的共享包，提供高德地图 JSAPI 单例 loader、类型和通用工具。

## 安装

```bash
pnpm add @amap-vue/shared vue
```

## 使用

```ts
import { loader } from '@amap-vue/shared'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
})

const AMap = await loader.load({
  plugins: ['AMap.ToolBar', 'AMap.Scale'],
})
```

`loader` 会复用同一个 JSAPI script，并在后续调用中按需补充插件。生产环境如果不希望在前端暴露安全密钥，建议使用高德 `serviceHost` 代理方案。

更多指南和可运行示例见文档站与仓库 README。
