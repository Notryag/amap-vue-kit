# 快速开始

AMap Vue Kit 用 Vue 3 组件和组合式 hooks 封装 [高德地图 JSAPI 2.x](https://lbs.amap.com/api/javascript-api/summary)。这份指南会带你完成安装、配置 Key、渲染第一张地图，并避开首次接入最常见的问题。

## 准备工作

- Node.js 18+ 和 [pnpm](https://pnpm.io/)（也可以使用 npm 或 yarn）。
- 一个[高德地图 Web JSAPI Key](https://lbs.amap.com/api/javascript-api/guide/create-project/get-key)。如果你在高德控制台启用了安全密钥，也可以通过 loader 一并传入。

## 安装

```bash
pnpm add @amap-vue/core @amap-vue/hooks @amap-vue/shared vue
```

> 如果不用 pnpm，可以换成等价的 `npm install` 或 `yarn add` 命令。

## 配置高德 Key

在应用启动时配置一次 Key，所有地图实例都会复用同一个 loader：

```ts
// main.ts
import { loader } from '@amap-vue/shared'
import { createApp } from 'vue'
import App from './App.vue'

loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY, // 可选
})

createApp(App).mount('#app')
```

无论页面渲染多少张地图，loader 都只会注入一次 JSAPI 脚本。如果希望在网络异常时快速失败，可以设置 `timeout`（毫秒）。加载失败时 promise 会 reject，方便你在界面上展示友好提示：

```ts
loader.config({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  timeout: 15_000,
})
```

某些页面需要更严格的超时时，也可以在单次调用里使用 `loader.load({ timeout: 10_000 })` 覆盖默认值。

## 最小示例

```vue
<script setup lang="ts">
import { AmapMap, AmapMarker } from '@amap-vue/core'

const center = [116.397, 39.908]
</script>

<template>
  <AmapMap :center="center" :zoom="11" style="height: 320px">
    <AmapMarker :position="center" />
  </AmapMap>
</template>
```

`<AmapMap>` 接收与 `new AMap.Map()` 类似的配置，并会抛出 `ready`、`moveend`、`click`、`complete`、`error` 等原生事件。嵌套的 Marker、Polyline、InfoWindow 等覆盖物会自动使用最近的 `<AmapMap>` 实例。

### StackBlitz

[打开最小示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)

## 容器尺寸

JSAPI 要求地图容器有明确高度。没有高度时，地图通常会显示为空白。你可以写内联样式，也可以使用 CSS 类：

```css
.map-shell {
  height: 320px;
  width: 100%;
}
```

```vue
<template>
  <AmapMap class="map-shell" :center="[116.397, 39.908]" :zoom="11" />
</template>
```

如果地图放在 flex 布局里，也要确认父级元素有非零高度。

## 使用 Hooks

更喜欢组合式 API？`@amap-vue/hooks` 提供了更细粒度的控制方式。下面用 `useMap` 创建地图，并在实例 ready 后创建 Marker：

```vue
<script setup lang="ts">
import { useMap, useMarker } from '@amap-vue/hooks'
import { ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)
const { map, ready } = useMap(() => ({
  container,
  center: [116.397, 39.908],
  zoom: 11,
}))

ready(() => {
  useMarker(() => map.value, { position: [116.397, 39.908] })
})
</script>

<template>
  <div ref="container" class="map-shell" />
</template>
```

所有 hooks 都会延迟访问 `window`，避免在 SSR 的 setup 阶段触发浏览器环境错误。

## 常见问题

- **地图空白**：地图容器或父级没有高度。按上面的 `map-shell` 样式补上高度即可。
- **提示缺少 Key**：首次渲染地图前调用 `loader.config({ key: 'YOUR_KEY' })`。开发环境会主动 warning，避免静默失败。
- **插件未找到**：确认插件名已经放进地图的 `plugins` prop 或 loader 配置里。编辑器、热力图等组件会自动请求依赖插件，但手写 JSAPI 代码时仍需要调用 `map.plugin(...)`。
- **JSAPI 返回 `SECURITY_ERROR`**：如果高德控制台启用了安全密钥，请把它作为 `securityJsCode` 传给 loader。

完成这些基础配置后，就可以继续查看组件、hooks、高级能力和性能指南，按业务场景逐步接入。
