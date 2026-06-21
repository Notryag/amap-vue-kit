# @amap-vue/hooks

面向 [高德地图 JSAPI 2.x](https://lbs.amap.com/api/javascript-api/summary) 的 Vue 3 组合式 hooks。

它是 `amap-vue-kit` monorepo 的无渲染能力层，配合 `@amap-vue/shared` 完成脚本加载和共享类型管理。

## 安装

```bash
pnpm add @amap-vue/hooks @amap-vue/shared vue
```

## 使用

```ts
import { useMap, useMarker } from '@amap-vue/hooks'
import { loader } from '@amap-vue/shared'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
})
```

```vue
<script setup lang="ts">
import { useMap, useMarker } from '@amap-vue/hooks'
import { ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)
const center: [number, number] = [116.397428, 39.90923]

const { map, ready } = useMap({
  container,
  center,
  zoom: 12,
})

ready(() => {
  useMarker(() => map.value, { position: center })
})
</script>

<template>
  <div ref="container" style="height: 360px" />
</template>
```

Hooks 可以在组件内自动随组件卸载清理；在组件外使用时不会注册 Vue 生命周期钩子，请按需调用返回值里的 `destroy()`。

更多指南和可运行示例见文档站与仓库 README。
