# @amap-vue/core

面向 [高德地图 JSAPI 2.x](https://lbs.amap.com/api/javascript-api/summary) 的声明式 Vue 3 组件包。

它是 `amap-vue-kit` monorepo 的核心组件层，基于 `@amap-vue/hooks` 和 `@amap-vue/shared` 构建。

## 安装

```bash
pnpm add @amap-vue/core @amap-vue/shared vue
```

## 配置

```ts
import AmapVue from '@amap-vue/core'
import { loader } from '@amap-vue/shared'
import { createApp } from 'vue'
import App from './App.vue'
import '@amap-vue/core/style.css'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
})

createApp(App).use(AmapVue).mount('#app')
```

## 最小示例

```vue
<script setup lang="ts">
const center: [number, number] = [116.397428, 39.90923]
</script>

<template>
  <AmapMap :center="center" :zoom="12" style="height: 360px">
    <AmapToolBar />
    <AmapScale />
    <AmapMarker :position="center" label="北京天安门" />
  </AmapMap>
</template>
```

## 常见问题

- 地图空白：确认地图容器有明确高度。
- 缺少 Key：在渲染地图前调用 `loader.config({ key })`。
- 安全密钥报错：如果高德控制台启用了安全密钥，请传入 `securityJsCode`，生产环境建议使用 `serviceHost` 代理方式。

更多指南和可运行示例见文档站与仓库 README。
