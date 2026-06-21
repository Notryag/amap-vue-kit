# @amap-vue/loca

面向 [高德 Loca 2.0](https://lbs.amap.com/api/jsapi-v2/guide/loca/loca-overview) 的 Vue 组件和组合式 hooks。

> 它是 `amap-vue-kit` monorepo 的可视化扩展包，依赖 `@amap-vue/shared` 加载脚本，并可配合 `@amap-vue/core` 的基础地图组件使用。

## 安装

```bash
pnpm add @amap-vue/loca @amap-vue/core @amap-vue/shared vue
```

## 使用

```ts
import AmapVue from '@amap-vue/core'
import AmapLoca from '@amap-vue/loca'
import { loader } from '@amap-vue/shared'
import { createApp } from 'vue'
import App from './App.vue'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
  loca: true,
})

createApp(App)
  .use(AmapVue)
  .use(AmapLoca)
  .mount('#app')
```

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const map = shallowRef<AMap.Map | null>(null)
const points = [
  { lng: 116.397428, lat: 39.90923, value: 1 },
]
</script>

<template>
  <AmapMap :center="[116.397428, 39.90923]" :zoom="11" style="height: 420px" @ready="map = $event">
    <AmapLocaProvider v-if="map" :map="map">
      <AmapLocaPointLayer
        :data="points"
        :layer-style="{ radius: 12, color: '#22d3ee' }"
      />
    </AmapLocaProvider>
  </AmapMap>
</template>
```

更多指南和可运行示例见文档站与仓库 README。
