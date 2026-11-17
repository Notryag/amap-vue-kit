# `useHawkEye`

以响应式选项管理鹰眼缩略图，支持独立展开、显示和卸载清理。

<DemoPreview>
<ClientOnly><UseHawkEyeHookDemo /></ClientOnly>

<template #code>

<<< ../examples/hooks/UseHawkEyeHookDemo.vue

</template>
</DemoPreview>

## 最小示例

```ts
import { useHawkEye } from '@amap-vue/hooks'

// map 是 useMap 返回的地图引用。
const overview = useHawkEye(() => map.value, { isOpen: true, width: '180px' })
overview.close() // 最小化
overview.hide() // 隐藏整个控件
```

实例尚未就绪时命令式方法不会执行；需要设置初始状态时传入 `isOpen` / `visible`。

<script setup lang="ts">
import UseHawkEyeHookDemo from '../examples/hooks/UseHawkEyeHookDemo.vue'
</script>

## TS 签名

```ts
function useHawkEye(
  mapRef: MaybeRefOrGetter<AMap.Map | null | undefined>,
  options?: MaybeRefOrGetter<UseHawkEyeOptions>,
): UseHawkEyeReturn

interface UseHawkEyeOptions extends AMap.HawkEyeOptions {
  visible?: boolean
}

interface UseHawkEyeReturn {
  control: ShallowRef<AMap.HawkEye | null>
  show: () => void
  hide: () => void
  open: () => void
  close: () => void
  setOptions: (options: Partial<UseHawkEyeOptions>) => void
  destroy: () => void
}
```

`AMap.HawkEyeOptions` 包含 `autoMove`、`showRectangle`、`showButton`、`isOpen`、`mapStyle`、`layers`、CSS 尺寸与边框选项，以及 `[number, number]` 格式的 `offset`。

`setOptions()` 合并覆盖选项，下一个 Vue 更新周期生效。`isOpen` 与 `visible` 复用实例，其余配置变化重建实例。直接调用 `open/close/show/hide` 不会回写传入的响应式选项。

## 常见错误

- 应传入 `() => map.value` 等惰性引用，避免地图就绪前固定传入 `null`。
- 修改初始化选项可能替换 `control.value`，请勿长期缓存旧实例。
- 在组件外使用时主动调用 `destroy()`；组件内使用会自动清理。
- HawkEye 固定在右下角，使用 `offset` 调整位置，不提供通用 `position` 参数。

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/master/examples/basic)
